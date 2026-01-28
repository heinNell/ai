/**
 * Safe environment variable access utility for esbuild/browser.
 * Falls back across multiple sources to avoid runtime errors when Vite is not used.
 */
export function safeEnv(name: string, fallback = ''): string {
  // 1) Try Vite-like import.meta.env
  try {
    const viteEnv = (import.meta as any)?.env?.[name];
    if (typeof viteEnv === 'string' && viteEnv) return viteEnv;
  } catch {
    // ignore
  }

  // 2) Try window.ENV (runtime injection)
  if (typeof window !== 'undefined') {
    const w = window as any;
    const winEnv = w?.ENV?.[name];
    if (typeof winEnv === 'string' && winEnv) return winEnv;

    // 3) Try localStorage
    try {
      const ls = window.localStorage?.getItem(name);
      if (ls) return ls;
    } catch {
      // ignore
    }
  }

  // 4) Try process.env (if injected at build time)
  try {
    const procEnv = (process as any)?.env?.[name];
    if (typeof procEnv === 'string' && procEnv) return procEnv;
  } catch {
    // ignore
  }

  return fallback;
}

/**
 * Convenience getters for known keys.
 */
export const ENV = {
  OPENROUTER: () => safeEnv('VITE_OPENROUTER_API_KEY'),
  OPENAI: () => safeEnv('VITE_OPENAI_API_KEY'),
  ANTHROPIC: () => safeEnv('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'),
  GEMINI: () => safeEnv('VITE_GEMINI_API_KEY'),
  DEEPSEEK: () => safeEnv('VITE_DEEPSEEK_API_KEY'),

  // Newly added providers
  GROQ: () => safeEnv('sk-c95eb2ab5c7c4e5ca44ce0a24a3c4b28'),
  MORPH: () => safeEnv('VITE_MORPH_API_KEY'),
  MORPH_BASE_URL: () => safeEnv('VITE_MORPH_BASE_URL', 'https://api.morph.ai/v1'),
};