/**
 * ToneSelector
 * Accessible radio-like selector for tone/style with a small recent-history.
 */

import { useEffect, useState } from 'react';
import type { ToneOption } from '../../types/workbench';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

const TONES: ToneOption[] = ['Structured & Formal', 'Exploratory & Creative', 'Input/Output Driven'];
const RECENT_KEY = 'wb_recent_tones';

/**
 * ToneSelector props
 */
interface ToneSelectorProps {
  value: ToneOption;
  onChange: (t: ToneOption) => void;
}

export default function ToneSelector({ value, onChange }: ToneSelectorProps) {
  const [recent, setRecent] = useState<ToneOption[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      const next = [value, ...recent.filter((r) => r !== value)].slice(0, 5);
      setRecent(next);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    } catch {
      // ignore
    }
  }, [value]);

  return (
    <div className="space-y-4">
      <div className="space-y-2" role="radiogroup" aria-label="Choose tone">
        {TONES.map((t) => {
          const checked = t === value;
          return (
            <button
              key={t}
              className={`w-full text-left p-3 border rounded-xl transition hover:bg-slate-50 focus:ring-2 focus:ring-indigo-500 ${
                checked ? 'border-indigo-500 bg-indigo-50' : ''
              }`}
              data-value={t}
              aria-checked={checked}
              role="radio"
              onClick={() => onChange(t)}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div>
        <Label className="font-medium text-sm mb-2 block">Recently Used</Label>
        <div className="text-xs text-slate-500 italic">
          {recent.length ? (
            <div className="flex gap-2 flex-wrap">
              {recent.map((r) => (
                <Button key={r} variant="outline" size="sm" className="bg-transparent" onClick={() => onChange(r)}>
                  {r}
                </Button>
              ))}
            </div>
          ) : (
            'No history yet'
          )}
        </div>
      </div>
    </div>
  );
}
