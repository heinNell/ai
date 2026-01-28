/**
 * File parsing utilities
 * Provide lightweight text/JSON parsing for md, txt, ipynb, html/htm, and common code files.
 * Optional advanced parsers (PDF, DOCX, XLSX) are attempted only if global libs are present.
 */

import type { ParsedFile } from '../types/workbench';
import { toast } from 'sonner';

/** Supported text-like extensions treated as plain text */
const TEXT_EXTS = new Set([
  'md', 'txt', 'ipynb', 'html', 'htm',
  'ts', 'tsx', 'js', 'jsx', 'py', 'java', 'cpp', 'cs', 'go', 'rs', 'php', 'rb',
]);

/** Map common extensions to language hints */
const LANG_BY_EXT: Record<string, string> = {
  ts: 'TypeScript',
  tsx: 'TypeScript JSX',
  js: 'JavaScript',
  jsx: 'JavaScript JSX',
  py: 'Python',
  java: 'Java',
  cpp: 'C++',
  cs: 'C#',
  go: 'Go',
  rs: 'Rust',
  php: 'PHP',
  rb: 'Ruby',
  html: 'HTML',
  htm: 'HTML',
  md: 'Markdown',
  txt: 'Text',
  ipynb: 'Jupyter Notebook',
};

/**
 * Read a File as text.
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.onabort = () => reject(new Error('File reading aborted.'));
    reader.onload = () => resolve(String(reader.result || ''));
    reader.readAsText(file);
  });
}

/**
 * Strip HTML tags to produce readable text.
 */
function htmlToText(html: string): string {
  // Replace script/style content
  const noScript = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  // Remove tags
  const text = noScript.replace(/<[^>]+>/g, ' ');
  // Collapse whitespace
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Parse ipynb JSON into readable text by concatenating cell sources.
 */
function parseIpynb(jsonText: string): { text: string; headings: string[] } {
  try {
    const nb = JSON.parse(jsonText);
    const cells = Array.isArray(nb?.cells) ? nb.cells : [];
    const lines: string[] = [];
    const headings: string[] = [];
    cells.forEach((cell: any) => {
      const src: string[] = Array.isArray(cell?.source) ? cell.source : [];
      const joined = src.join('');
      lines.push(joined);
      // Basic heading detection from markdown
      if (cell?.cell_type === 'markdown') {
        const h = joined
          .split('\n')
          .filter((l) => /^#{1,6}\s/.test(l))
          .map((l) => l.replace(/^#{1,6}\s/, '').trim());
        headings.push(...h);
      }
    });
    return { text: lines.join('\n\n'), headings };
  } catch {
    return { text: jsonText, headings: [] };
  }
}

/**
 * Core per-file parsing based on extension.
 */
export async function parseFile(file: File): Promise<ParsedFile> {
  const name = file.name;
  const size = file.size;
  const type = file.type;
  const ext = (name.split('.').pop() || '').toLowerCase();

  // Optional advanced types
  if (ext === 'pdf' || ext === 'docx' || ext === 'xlsx') {
    // Lazy attempt using global libs if present; otherwise warn
    if (ext === 'pdf' && (window as any)?.pdfjsLib) {
      try {
        const text = await parsePdfWithGlobal(file);
        return {
          id: crypto.randomUUID(),
          name, size, type, ext,
          language: 'PDF',
          text,
          headings: [],
        };
      } catch (e) {
        toast.warning(`PDF parsing failed for ${name}. Falling back to binary notice.`);
      }
    } else if (ext === 'docx' && (window as any)?.mammoth) {
      try {
        const text = await parseDocxWithGlobal(file);
        return {
          id: crypto.randomUUID(),
          name, size, type, ext,
          language: 'DOCX',
          text,
          headings: [],
        };
      } catch (e) {
        toast.warning(`DOCX parsing failed for ${name}.`);
      }
    } else if (ext === 'xlsx' && (window as any)?.XLSX) {
      try {
        const text = await parseXlsxWithGlobal(file);
        return {
          id: crypto.randomUUID(),
          name, size, type, ext,
          language: 'Excel',
          text,
          headings: [],
        };
      } catch (e) {
        toast.warning(`XLSX parsing failed for ${name}.`);
      }
    } else {
      toast.message('Advanced parser not available', {
        description: `To parse .${ext} files, inject a global ${ext.toUpperCase()} parser or ask to install dependencies.`,
      });
    }

    // Fallback: no proper parsing available
    return {
      id: crypto.randomUUID(),
      name, size, type, ext,
      language: ext.toUpperCase(),
      text: '',
      headings: [],
    };
  }

  // Text-like files
  if (TEXT_EXTS.has(ext)) {
    const raw = await readFileAsText(file);

    if (ext === 'html' || ext === 'htm') {
      const text = htmlToText(raw);
      return {
        id: crypto.randomUUID(),
        name, size, type, ext,
        language: LANG_BY_EXT[ext],
        text,
        headings: extractHeadingsFromMarkdownLike(text),
      };
    }

    if (ext === 'ipynb') {
      const { text, headings } = parseIpynb(raw);
      return {
        id: crypto.randomUUID(),
        name, size, type, ext,
        language: LANG_BY_EXT[ext],
        text,
        headings,
      };
    }

    // md, txt, and code files -> keep as text, attempt basic headings for md
    return {
      id: crypto.randomUUID(),
      name, size, type, ext,
      language: LANG_BY_EXT[ext] || 'Text',
      text: raw,
      headings: ext === 'md' ? extractHeadingsFromMarkdown(raw) : [],
    };
  }

  // Generic fallback
  return {
    id: crypto.randomUUID(),
    name, size, type, ext,
    language: 'Unknown',
    text: '',
    headings: [],
  };
}

/**
 * Parse many files.
 */
export async function parseFiles(files: File[]): Promise<ParsedFile[]> {
  const tasks = files.map((f) => parseFile(f));
  return Promise.all(tasks);
}

/**
 * Extract headings from markdown content (#, ##, ###).
 */
function extractHeadingsFromMarkdown(md: string): string[] {
  return md
    .split('\n')
    .filter((l) => /^#{1,6}\s/.test(l))
    .map((l) => l.replace(/^#{1,6}\s/, '').trim())
    .slice(0, 20);
}

/**
 * Extract headings-like lines from plain text (heuristic).
 */
function extractHeadingsFromMarkdownLike(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && l.length < 120 && /^[A-Z].+/.test(l))
    .slice(0, 20);
}

/**
 * Optional: parse PDF using global pdfjsLib
 * Note: This relies on a pre-injected window.pdfjsLib. If not present, it will throw.
 */
async function parsePdfWithGlobal(file: File): Promise<string> {
  // @ts-ignore
  const pdfjsLib = (window as any).pdfjsLib;
  // @ts-ignore
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsLib.GlobalWorkerOptions.workerSrc || 'pdf.worker.min.js';

  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  let text = '';
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map((it: any) => it.str).join(' ');
    text += pageText + '\n\n';
  }
  return text.trim();
}

/**
 * Optional: parse DOCX using global mammoth
 */
async function parseDocxWithGlobal(file: File): Promise<string> {
  // @ts-ignore
  const mammoth = (window as any).mammoth;
  const buf = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buf });
  return String(result?.value || '').trim();
}

/**
 * Optional: parse XLSX using global XLSX
 */
async function parseXlsxWithGlobal(file: File): Promise<string> {
  // @ts-ignore
  const XLSX = (window as any).XLSX;
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const out: string[] = [];
  wb.SheetNames.forEach((name: string) => {
    const ws = wb.Sheets[name];
    const csv = XLSX.utils.sheet_to_csv(ws);
    out.push(`Sheet: ${name}\n${csv}`);
  });
  return out.join('\n\n').trim();
}
