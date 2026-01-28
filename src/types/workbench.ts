/**
 * Types for the Prompt Workbench (tone, provider, files, parsing, prompts)
 */

export type ToneOption = 'Structured & Formal' | 'Exploratory & Creative' | 'Input/Output Driven';

export type ProviderOption = 'openrouter' | 'deepseek' | 'openai' | 'anthropic' | 'groq';

/**
 * Basic metadata extracted from a file.
 */
export interface ParsedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  ext: string;
  language?: string;
  /** Plain-text content extracted for summarization/prompting */
  text: string;
  /** Short headings the parser could infer */
  headings?: string[];
}

/**
 * Generated prompt candidate.
 */
export interface PromptCandidate {
  id: string;
  title: string;
  tone: ToneOption;
  content: string;
}

/**
 * Result of summarization and prompt generation across all files.
 */
export interface WorkbenchResults {
  summaries: {
    /** One short summary per file */
    perFile: Array<{ name: string; summary: string; keywords: string[] }>;
    /** Cross-file themes */
    themes: string[];
  };
  candidates: PromptCandidate[];
}

/**
 * Mapping from extension to a display label (optional convenience).
 */
export type ExtensionMap = Record<string, string>;
