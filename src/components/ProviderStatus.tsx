/**
 * Provider status component showing API connection status
 * Displays which AI providers are available and properly configured
 */

import { useState, useEffect } from 'react';
import { AIProvider } from '../types/aiProviders';
import { aiService } from '../services/aiService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

/**
 * Provider information for display
 */
const PROVIDER_INFO: Record<
  AIProvider,
  { name: string; description: string; website?: string }
> = {
  [AIProvider.OPENROUTER]: {
    name: 'OpenRouter',
    description: 'Access to multiple AI models through OpenRouter',
    website: 'https://openrouter.ai',
  },
  [AIProvider.OPENAI]: {
    name: 'OpenAI',
    description: 'GPT-4, GPT-4o, and other OpenAI models',
    website: 'https://openai.com',
  },
  [AIProvider.ANTHROPIC]: {
    name: 'Anthropic',
    description: 'Claude 3.5 Sonnet and other Anthropic models',
    website: 'https://anthropic.com',
  },
  [AIProvider.GEMINI]: {
    name: 'Google Gemini',
    description: 'Gemini 1.5 Pro and Flash models',
    website: 'https://ai.google.dev',
  },
  [AIProvider.DEEPSEEK]: {
    name: 'DeepSeek',
    description: 'DeepSeek Chat and Coder models',
    website: 'https://deepseek.ai',
  },
  [AIProvider.GROQ]: {
    name: 'Groq',
    description: 'OpenAI-compatible endpoint for Llama, Mixtral, Gemma',
    website: 'https://groq.com',
  },
  [AIProvider.MORPH]: {
    name: 'Morph',
    description: 'OpenAI-compatible endpoint (custom base URL). Set model ID in UI.',
    website: 'https://morph.ai',
  },
};

export default function ProviderStatus() {
  const [connectionStatus, setConnectionStatus] = useState<Map<AIProvider, boolean>>(
    new Map()
  );
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    // Check initial configuration status
    const initialStatus = new Map<AIProvider, boolean>();
    Object.values(AIProvider).forEach((provider) => {
      initialStatus.set(provider, aiService.isProviderConfigured(provider as AIProvider));
    });
    setConnectionStatus(initialStatus);
  }, []);

  const testAllConnections = async () => {
    setIsTesting(true);
    const newStatus = new Map<AIProvider, boolean>();

    for (const provider of Object.values(AIProvider)) {
      try {
        const isConnected = await aiService.testConnection(provider as AIProvider);
        newStatus.set(provider as AIProvider, isConnected);
      } catch {
        newStatus.set(provider as AIProvider, false);
      }
    }

    setConnectionStatus(newStatus);
    setIsTesting(false);
  };

  /**
   * Returns a badge class string based on configured/connected state
   */
  const getStatusColor = (isConfigured: boolean, isConnected: boolean) => {
    if (!isConfigured) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    return isConnected
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    };

  /**
   * Returns a human-readable status label
   */
  const getStatusText = (isConfigured: boolean, isConnected: boolean) => {
    if (!isConfigured) return 'Not Configured';
    return isConnected ? 'Connected' : 'Connection Failed';
  };

  const availableProviders = aiService.getAvailableProviders();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">AI Provider Status</CardTitle>
        <Button
          onClick={testAllConnections}
          disabled={isTesting}
          variant="outline"
          className="bg-transparent"
        >
          {isTesting ? 'Testing...' : 'Test Connections'}
        </Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            <p>
              This tool supports multiple AI providers. Configure your API keys in the environment
              variables to enable testing with different models.
            </p>
            <p className="mt-2">
              <strong>Available providers:</strong> {availableProviders.length} of{' '}
              {Object.values(AIProvider).length}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(AIProvider).map((provider) => {
              const info = PROVIDER_INFO[provider as AIProvider];
              const isConfigured = aiService.isProviderConfigured(provider as AIProvider);
              const isConnected = connectionStatus.get(provider as AIProvider) || false;

              return (
                <Card key={provider} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-slate-800 dark:text-slate-100">
                        {info?.name || provider}
                      </h3>
                      <Badge className={getStatusColor(isConfigured, isConnected)}>
                        {getStatusText(isConfigured, isConnected)}
                      </Badge>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {info?.description || '—'}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      {info?.website ? (
                        <a
                          href={info.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          Visit website →
                        </a>
                      ) : (
                        <span>&nbsp;</span>
                      )}
                      {isConfigured && (
                        <span className="flex items-center space-x-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              isConnected ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          />
                          <span>{isConnected ? 'Ready' : 'Error'}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Configuration Notes
            </h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• API keys are stored in environment variables (VITE_*_API_KEY)</li>
              <li>• Keys are only accessible in the browser environment</li>
              <li>• Connection tests use minimal API calls to verify credentials</li>
              <li>• Some providers may have rate limits or regional restrictions</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
