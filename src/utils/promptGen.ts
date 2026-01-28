/**
 * Summarization and prompt generation utilities
 * Provides lightweight keyword-based summarization and tone-specific prompt candidates.
 */

import type { ParsedFile, ToneOption, WorkbenchResults, PromptCandidate } from '../types/workbench';

/** Basic English stopwords for keyword extraction */
const STOPWORDS = new Set([
  'the','a','an','and','or','but','if','then','else','when','at','by','for','with','about','against','between','into',
  'through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under',
  'again','further','then','once','here','there','all','any','both','each','few','more','most','other','some','such',
  'no','nor','not','only','own','same','so','than','too','very','can','will','just','don','should','now','is','are',
  'was','were','be','been','being','of','it','that','this','as','i','you','he','she','we','they','them','their',
]);

/**
 * Create a short summary from text, with keywords extracted via frequency.
 */
export function summarizeText(text: string, maxSentences = 3): { summary: string; keywords: string[] } {
  const clean = text.replace(/\s+/g, ' ').trim();
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
  const summary = sentences.slice(0, maxSentences).join(' ') || clean.slice(0, 240);

  const words = clean
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w) && w.length > 2);

  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
  const keywords = Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([w]) => w);

  return { summary, keywords };
}

/**
 * Build cross-file themes by combining keywords.
 */
function buildThemes(perFileKeywords: string[][], maxThemes = 8): string[] {
  const freq = new Map<string, number>();
  perFileKeywords.forEach((arr) => {
    arr.forEach((k) => freq.set(k, (freq.get(k) || 0) + 1));
  });
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxThemes)
    .map(([k]) => k);
}

/**
 * Generate prompt candidates from files and optional selected tone.
 */
export function generateResults(files: ParsedFile[], selectedTone: ToneOption): WorkbenchResults {
  const perFile = files.map((f) => {
    const { summary, keywords } = summarizeText(f.text);
    return { name: f.name, summary, keywords };
  });
  const themes = buildThemes(perFile.map((p) => p.keywords));

  // Combine all text for context
  const combinedText = files.map((f) => `File: ${f.name}\n${f.text}`).join('\n\n');

  const candidates: PromptCandidate[] = [
    buildStructuredFormal(combinedText, themes),
    buildExploratoryCreative(combinedText, themes),
    buildInputOutputDriven(combinedText, themes),
  ];

  // Reorder to put selected tone first
  const sorted = candidates.sort((a, b) => (a.tone === selectedTone ? -1 : b.tone === selectedTone ? 1 : 0));

  return {
    summaries: { perFile, themes },
    candidates: sorted,
  };
}

/**
 * Candidate builders per tone
 */
function buildStructuredFormal(context: string, themes: string[]): PromptCandidate {
  const content = `You are a senior analyst. Using the context below, write an accurate, structured response with explicit constraints and a clear format.

Context:
${trimForContext(context)}

Key themes: ${themes.slice(0, 8).join(', ')}

Requirements:
- Provide a concise executive summary (3–4 sentences)
- Include a bulleted list of key findings (5–8 bullets)
- Cite file names if you reference specific segments
- Output JSON with "summary", "findings", "open_questions"

Return JSON only.`;
  return {
    id: crypto.randomUUID(),
    title: 'Structured & Formal — Analyst',
    tone: 'Structured & Formal',
    content,
  };
}

function buildExploratoryCreative(context: string, themes: string[]): PromptCandidate {
  const content = `You are an innovative strategist. Explore the context to propose several creative directions.

Context:
${trimForContext(context)}

Key themes: ${themes.slice(0, 8).join(', ')}

Deliver:
- 3 divergent concepts with titles, rationale, and risks
- 2 hybrid ideas that combine elements across files
- A short "what-if" exploration to challenge assumptions

Use markdown. Keep sections scannable.`;
  return {
    id: crypto.randomUUID(),
    title: 'Exploratory & Creative — Strategist',
    tone: 'Exploratory & Creative',
    content,
  };
}

function buildInputOutputDriven(context: string, themes: string[]): PromptCandidate {
  const content = `You are a precise system. Given the context, produce deterministic outputs matching the specified schema.

Context (truncated):
${trimForContext(context)}

Key themes: ${themes.slice(0, 8).join(', ')}

Schema:
{
  "tasks": [{"id": "string", "title": "string", "steps": ["string"]}],
  "entities": [{"name": "string", "type": "string", "notes": "string"}]
}

Instructions:
- Fill the schema with high-confidence information only
- Avoid speculation
- Keep strings concise`;
  return {
    id: crypto.randomUUID(),
    title: 'Input/Output Driven — System',
    tone: 'Input/Output Driven',
    content,
  };
}

/**
 * Shortens large context to a safe size for display/prompting.
 */
function trimForContext(text: string, maxChars = 4800): string {
  if (text.length <= maxChars) return text;
  const head = text.slice(0, Math.floor(maxChars * 0.7));
  const tail = text.slice(-Math.floor(maxChars * 0.2));
  return `${head}\n...\n${tail}`;
}
