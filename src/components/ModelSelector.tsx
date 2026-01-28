/**
 * Model selector component for choosing AI models and providers
 * Displays available models grouped by provider with search and filtering
 */

import { useState, useMemo } from 'react';
import { AIProvider, AIModel, AVAILABLE_MODELS, getModelsByProvider } from '../types/aiProviders';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ModelSelectorProps {
  /** Currently selected model (optional, for highlight) */
  selectedModel: AIModel | null;
  /** Callback when a model is chosen */
  onModelSelect: (model: AIModel) => void;
  /** Disable interactions */
  disabled?: boolean;
}

/**
 * Provider names for display
 */
const PROVIDER_NAMES: Record<AIProvider, string> = {
  [AIProvider.OPENROUTER]: 'OpenRouter',
  [AIProvider.OPENAI]: 'OpenAI',
  [AIProvider.ANTHROPIC]: 'Anthropic',
  [AIProvider.GEMINI]: 'Gemini',
  [AIProvider.DEEPSEEK]: 'DeepSeek',
  [AIProvider.GROQ]: 'Groq',
  [AIProvider.MORPH]: 'Morph',
};

/**
 * Provider colors for visual distinction
 */
const PROVIDER_COLORS: Record<AIProvider, string> = {
  [AIProvider.OPENROUTER]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [AIProvider.OPENAI]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [AIProvider.ANTHROPIC]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [AIProvider.GEMINI]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [AIProvider.DEEPSEEK]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  [AIProvider.GROQ]: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  [AIProvider.MORPH]: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
};

/**
 * Category badges
 */
const CATEGORY_COLORS = {
  chat: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  code: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  multimodal: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
};

export default function ModelSelector({ selectedModel, onModelSelect, disabled = false }: ModelSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<AIProvider | 'all'>('all');

  // Filter models based on search and provider filter
  const filteredModels = useMemo(() => {
    let models = AVAILABLE_MODELS;

    // Filter by provider
    if (selectedProvider !== 'all') {
      models = getModelsByProvider(selectedProvider);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      models = models.filter((model) =>
        model.name.toLowerCase().includes(query) ||
        model.description.toLowerCase().includes(query) ||
        model.id.toLowerCase().includes(query)
      );
    }

    return models;
  }, [searchQuery, selectedProvider]);

  // Group models by provider
  const groupedModels = useMemo(() => {
    const groups = new Map<AIProvider, AIModel[]>();

    filteredModels.forEach((model) => {
      if (!groups.has(model.provider)) {
        groups.set(model.provider, []);
      }
      groups.get(model.provider)!.push(model);
    });

    return groups;
  }, [filteredModels]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Select AI Model</CardTitle>

        {/* Search and Filter Controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Models</Label>
            <Input
              id="search"
              placeholder="Search by name, description, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label>Filter by Provider</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedProvider === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedProvider('all')}
                disabled={disabled}
                className="bg-transparent"
              >
                All Providers
              </Button>
              {Object.values(AIProvider).map((provider) => (
                <Button
                  key={provider}
                  variant={selectedProvider === provider ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedProvider(provider)}
                  disabled={disabled}
                  className="bg-transparent"
                >
                  {PROVIDER_NAMES[provider]}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredModels.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No models found matching your search criteria.
          </div>
        ) : (
          <div className="space-y-6">
            {Array.from(groupedModels.entries()).map(([provider, models]) => (
              <div key={provider} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">
                    {PROVIDER_NAMES[provider]}
                  </h3>
                  <Badge className={PROVIDER_COLORS[provider]}>
                    {models.length} models
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {models.map((model) => (
                    <Card
                      key={model.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedModel?.id === model.id
                          ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => !disabled && onModelSelect(model)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-slate-800 dark:text-slate-100">
                              {model.name}
                            </h4>
                            <div className="flex space-x-1">
                              <Badge
                                variant="outline"
                                className={`text-xs ${PROVIDER_COLORS[provider]}`}
                              >
                                {PROVIDER_NAMES[provider]}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`text-xs ${CATEGORY_COLORS[model.category as keyof typeof CATEGORY_COLORS]}`}
                              >
                                {model.category}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                            {model.description}
                          </p>

                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>
                              Max tokens: {model.maxTokens.toLocaleString()}
                            </span>
                            <span>
                              ${model.costPer1kTokens.toFixed(4)}/1K tokens
                            </span>
                          </div>

                          {model.supportsStreaming && (
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600 dark:text-green-400">
                                Streaming supported
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
