/**
 * AI Tester component for testing generated prompts with different models
 * Handles API calls and displays responses from various AI providers
 * Now also checks if the selected provider is configured and guides the user.
 */

import { useEffect, useMemo, useState } from 'react';
import { aiService } from '../services/aiService';
import type { AIModel, AIResponse } from '../types/aiProviders';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Slider } from './ui/slider';

interface AITesterProps {
  /** The prompt to test against the chosen model */
  prompt: string;
  /** An optional initial model passed from parent. Will be synced on changes. */
  initialModel?: AIModel | null;
}

/**
 * Provider names for display
 */
const PROVIDER_NAMES: Record<string, string> = {
  openrouter: 'OpenRouter',
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  gemini: 'Gemini',
  deepseek: 'DeepSeek',
  groq: 'Groq',
  morph: 'Morph',
};

/**
 * Provider colors for visual distinction
 */
const PROVIDER_COLORS: Record<string, string> = {
  openrouter: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  openai: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  anthropic: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  gemini: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  deepseek: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  groq: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  morph: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
};

/**
 * Mapping from provider id -> runtime env key required by the app
 */
const ENV_KEY_BY_PROVIDER: Record<string, string> = {
  openrouter: 'VITE_OPENROUTER_API_KEY',
  openai: 'VITE_OPENAI_API_KEY',
  anthropic: 'VITE_ANTHROPIC_API_KEY',
  gemini: 'VITE_GEMINI_API_KEY',
  deepseek: 'VITE_DEEPSEEK_API_KEY',
  groq: 'VITE_GROQ_API_KEY',
  morph: 'VITE_MORPH_API_KEY',
};

/**
 * AITester renders controls to execute a prompt against a selected model.
 * It syncs its internal model with the parent-provided initialModel.
 * It now also checks if the model's provider is configured and provides guidance if not.
 */
export default function AITester({ prompt, initialModel = null }: AITesterProps) {
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(initialModel);
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([1000]);
  const [isTesting, setIsTesting] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  /** Sync internal selectedModel whenever parent-provided initialModel changes. */
  useEffect(() => {
    setSelectedModel(initialModel ?? null);
  }, [initialModel]);

  /** Derive configuration info for the currently selected model/provider. */
  const providerId = String(selectedModel?.provider || '');
  const isConfigured = useMemo(
    () => (selectedModel ? aiService.isProviderConfigured(selectedModel.provider) : false),
    [selectedModel]
  );
  const envKey = providerId ? ENV_KEY_BY_PROVIDER[providerId] : '';

  /** Triggers an API call via aiService for the selected model. */
  const handleTestPrompt = async () => {
    if (!selectedModel || !prompt.trim()) return;
    if (!isConfigured) {
      setError(
        `Provider not configured: ${PROVIDER_NAMES[providerId] || providerId}. Add ${envKey} via localStorage and reload.`
      );
      return;
    }

    setIsTesting(true);
    setError(null);
    setResponse(null);

    try {
      const aiResponse = await aiService.generateResponse(prompt, selectedModel, {
        temperature: temperature[0],
        maxTokens: maxTokens[0],
      });
      setResponse(aiResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsTesting(false);
    }
  };

  /** Copies only the response text. */
  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(response.text);
    }
  };

  /** Copies model, provider, token usage, and the full text. */
  const handleCopyFullResponse = () => {
    if (response) {
      const prov = String(response.provider);
      const providerName = PROVIDER_NAMES[prov] || prov;
      const fullResponse = `Model: ${response.model}\nProvider: ${providerName}\nTokens: ${response.usage.totalTokens}\n\n${response.text}`;
      navigator.clipboard.writeText(fullResponse);
    }
  };

  return (
    <div className="space-y-6">
      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Test with AI Models</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Selected Model</Label>
            {selectedModel ? (
              <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="font-medium">{selectedModel.name}</span>
                <Badge className={PROVIDER_COLORS[String(selectedModel.provider)] || ''}>
                  {PROVIDER_NAMES[String(selectedModel.provider)] || String(selectedModel.provider)}
                </Badge>
                <Badge variant="outline">{selectedModel.category}</Badge>
                {!isConfigured && (
                  <Badge variant="outline" className="border-amber-300 text-amber-700">
                    Not configured
                  </Badge>
                )}
              </div>
            ) : (
              <div className="text-slate-500 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                No model selected
              </div>
            )}
          </div>

          {/* Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Temperature: {temperature[0].toFixed(2)}</Label>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                max={2}
                min={0}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Controls randomness (0 = deterministic, 2 = creative)
              </p>
            </div>

            <div className="space-y-2">
              <Label>Max Tokens: {maxTokens[0].toLocaleString()}</Label>
              <Slider
                value={maxTokens}
                onValueChange={setMaxTokens}
                max={selectedModel?.maxTokens || 4000}
                min={100}
                step={100}
                className="w-full"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">Maximum response length</p>
            </div>
          </div>

          {/* Configuration hint when provider isn't ready */}
          {selectedModel && !isConfigured && (
            <div className="rounded-md border border-amber-300 bg-amber-50 text-amber-900 p-3 text-sm">
              <div className="font-medium mb-1">Provider not configured</div>
              <p className="mb-2">
                Set {PROVIDER_NAMES[providerId] || providerId} API key in your browser, then reload:
              </p>
              <div className="bg-white rounded border px-3 py-2 text-xs overflow-x-auto">
                <code>
                  {`localStorage.setItem('${envKey}', 'YOUR_API_KEY')\n// then reload`}
                </code>
              </div>
              {providerId === 'morph' && (
                <p className="mt-2 text-xs">
                  Optional: set base URL if custom:{' '}
                  <code>localStorage.setItem('VITE_MORPH_BASE_URL','https://api.morph.ai/v1')</code>
                </p>
              )}
              <p className="mt-2 text-xs">
                Or pick an OpenRouter model and set <code>VITE_OPENROUTER_API_KEY</code>.
              </p>
            </div>
          )}

          <Button
            onClick={handleTestPrompt}
            disabled={!selectedModel || !prompt.trim() || isTesting || !isConfigured}
            className="w-full"
            size="lg"
          >
            {isTesting ? 'Testing Prompt...' : 'Test Prompt with AI'}
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="text-red-600 dark:text-red-400">
              <h3 className="font-medium mb-2">Error</h3>
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Response Display */}
      {response && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-semibold">AI Response</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleCopyResponse} className="bg-transparent">
                Copy Response
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyFullResponse} className="bg-transparent">
                Copy All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Response Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge className={PROVIDER_COLORS[String(response.provider)] || ''}>
                {PROVIDER_NAMES[String(response.provider)] || String(response.provider)}
              </Badge>
              <Badge variant="outline">{response.model}</Badge>
              <span className="text-slate-500 dark:text-slate-400">
                {response.timestamp.toLocaleString()}
              </span>
            </div>

            {/* Usage Statistics */}
            <div className="grid grid-cols-3 gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {response.usage.promptTokens.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Prompt Tokens</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {response.usage.completionTokens.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Completion Tokens</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {response.usage.totalTokens.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Total Tokens</div>
              </div>
            </div>

            {/* Response Content */}
            <div className="space-y-2">
              <Label>Response</Label>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200 font-mono">
                  {response.text}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
