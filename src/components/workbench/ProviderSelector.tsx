/**
 * ProviderSelector
 * Accessible radio-like selector to choose the model provider.
 */

import type { ProviderOption } from '../../types/workbench';

const PROVIDERS: { id: ProviderOption; label: string; disabled?: boolean }[] = [
  { id: 'openrouter', label: 'OpenRouter (multi‑model hub)' },
  { id: 'deepseek', label: 'DeepSeek (direct)' },
  { id: 'openai', label: 'OpenAI (direct)' },
  { id: 'anthropic', label: 'Anthropic (direct)' },
  { id: 'groq', label: 'Groq (direct)', disabled: true },
];

interface ProviderSelectorProps {
  value: ProviderOption;
  onChange: (p: ProviderOption) => void;
}

export default function ProviderSelector({ value, onChange }: ProviderSelectorProps) {
  return (
    <div className="space-y-2" role="radiogroup" aria-label="Choose provider">
      {PROVIDERS.map((p) => {
        const checked = p.id === value;
        const disabled = !!p.disabled;
        return (
          <button
            key={p.id}
            className={`w-full text-left p-3 border rounded-xl transition hover:bg-slate-50 focus:ring-2 focus:ring-indigo-500 ${
              checked ? 'border-indigo-500 bg-indigo-50' : ''
            } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            data-provider={p.id}
            aria-checked={checked}
            aria-disabled={disabled}
            role="radio"
            disabled={disabled}
            onClick={() => !disabled && onChange(p.id)}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
