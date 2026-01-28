/**
 * ModelIdInput
 * Free-form model id input with a "Pick from catalog" option that reuses ModelSelector.
 */

import { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import type { ProviderOption } from '../../types/workbench';
import type { AIModel } from '../../types/aiProviders';
import ModelSelector from '../ModelSelector';

interface ModelIdInputProps {
  value: string;
  onChange: (v: string) => void;
  provider: ProviderOption;
  /** Called when user picks a model from the catalog */
  onPickModel: (model: AIModel) => void;
}

export default function ModelIdInput({ value, onChange, provider, onPickModel }: ModelIdInputProps) {
  const [showCatalog, setShowCatalog] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor="model-id">Model ID</Label>
      <Input
        id="model-id"
        placeholder="e.g., deepseek/deepseek-chat or gpt-4o"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-xs text-slate-500">Prefilled with a sensible default when you switch providers.</p>

      <div className="pt-2">
        <Button variant="outline" className="bg-transparent" onClick={() => setShowCatalog((s) => !s)}>
          {showCatalog ? 'Hide catalog' : 'Pick from catalog'}
        </Button>
      </div>

      {showCatalog && (
        <div className="mt-3 rounded-lg border p-3">
          <ModelSelector
            selectedModel={null}
            onModelSelect={(m) => {
              onPickModel(m);
              setShowCatalog(false);
            }}
          />
          <p className="mt-2 text-xs text-slate-500">
            Tip: Selecting here will also update the free-form Model ID above.
          </p>
        </div>
      )}
    </div>
  );
}
