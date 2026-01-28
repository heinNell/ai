/** 
 * env.local.ts
 * Local browser environment variables for development/testing only.
 * Injects keys into window.ENV so the app can read them via safeEnv().
 *
 * Usage:
 * - Put temporary/dev keys below (do NOT commit real secrets).
 * - Or set them via browser console:
 *   localStorage.setItem('VITE_OPENROUTER_API_KEY','...'); location.reload();
 */

/** Local runtime env values merged into window.ENV at startup. */
export const ENV_LOCAL: Record<string, string> = {
  /**
   * OpenRouter (recommended to get started)
   * https://openrouter.ai
   */
  VITE_OPENROUTER_API_KEY: '',

  /**
   * Direct provider keys (fill only what you intend to use)
   */
  VITE_OPENAI_API_KEY: '',
  VITE_ANTHROPIC_API_KEY: '',
  VITE_GEMINI_API_KEY: '',
  VITE_DEEPSEEK_API_KEY: '',
  VITE_GROQ_API_KEY: '',
  VITE_MORPH_API_KEY: '',

  /**
   * Optional custom base URL for Morph (OpenAI-compatible)
   */
  VITE_MORPH_BASE_URL: 'https://api.morph.ai/v1',
} as const;

/**
 * Merge ENV_LOCAL into window.ENV at runtime so safeEnv() can find them.
 */
declare global {
  interface Window {
    /** In-page runtime environment values */
    ENV?: Record<string, string>;
  }
}

if (typeof window !== 'undefined') {
  // Merge defaults with any preexisting window.ENV entries.
  window.ENV = { ...(window.ENV || {}), ...ENV_LOCAL };
}
