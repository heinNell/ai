/**
 * AI Service for handling API calls to different providers
 * Manages communication with OpenRouter, OpenAI, Anthropic, Gemini, DeepSeek, Groq, and Morph
 */

import {
  AIProvider,
  AIModel,
  AIResponse,
  ProviderConfig,
  getModelsByProvider,
} from '../types/aiProviders';
import { ENV } from '../lib/env';

/**
 * AI Service class for handling API requests
 */
export class AIService {
  /** In-memory map of configured providers -> credentials and defaults */
  private configs: Map<AIProvider, ProviderConfig> = new Map();

  constructor() {
    /**
     * Initialize provider configurations using safe env access.
     * Only providers with available keys will be added.
     */
    const providerConfigs = [
      { provider: AIProvider.OPENROUTER, apiKey: ENV.OPENROUTER() },
      { provider: AIProvider.OPENAI, apiKey: ENV.OPENAI() },
      { provider: AIProvider.ANTHROPIC, apiKey: ENV.ANTHROPIC() },
      { provider: AIProvider.GEMINI, apiKey: ENV.GEMINI() },
      { provider: AIProvider.DEEPSEEK, apiKey: ENV.DEEPSEEK() },
      { provider: AIProvider.GROQ, apiKey: ENV.GROQ() },
      { provider: AIProvider.MORPH, apiKey: ENV.MORPH() },
    ] as const;

    providerConfigs.forEach(({ provider, apiKey }) => {
      if (apiKey) {
        const baseUrl = this.getBaseUrl(provider);
        const headers = this.getHeaders(provider, apiKey);
        this.configs.set(provider, {
          provider,
          apiKey,
          baseUrl,
          headers,
        });
      }
    });
  }

  /**
   * Get base URL for provider
   */
  private getBaseUrl(provider: AIProvider): string {
    const urls: Record<AIProvider, string> = {
      [AIProvider.OPENROUTER]: 'https://openrouter.ai/api/v1',
      [AIProvider.OPENAI]: 'https://api.openai.com/v1',
      [AIProvider.ANTHROPIC]: 'https://api.anthropic.com/v1',
      [AIProvider.GEMINI]: 'https://generativelanguage.googleapis.com/v1beta',
      [AIProvider.DEEPSEEK]: 'https://api.deepseek.com',
      [AIProvider.GROQ]: 'https://api.groq.com/openai/v1',
      [AIProvider.MORPH]: ENV.MORPH_BASE_URL(),
    };
    return urls[provider];
  }

  /**
   * Build headers for provider
   */
  private getHeaders(provider: AIProvider, apiKey?: string): Record<string, string> {
    const baseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    switch (provider) {
      case AIProvider.OPENROUTER:
        return {
          ...baseHeaders,
          Authorization: `Bearer ${apiKey || ''}`,
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
          'X-Title': 'Prompt Engineering AI Tool',
        };
      case AIProvider.OPENAI:
      case AIProvider.GROQ:
      case AIProvider.DEEPSEEK:
      case AIProvider.MORPH:
        return {
          ...baseHeaders,
          Authorization: `Bearer ${apiKey || ''}`,
        };
      case AIProvider.ANTHROPIC:
        return {
          ...baseHeaders,
          'x-api-key': apiKey || '',
          'anthropic-version': '2023-06-01',
        };
      case AIProvider.GEMINI:
        // Uses API key via query param; keep base headers
        return baseHeaders;
      default:
        return baseHeaders;
    }
  }

  /**
   * Generate response using specified model
   */
  async generateResponse(
    prompt: string,
    model: AIModel,
    options?: {
      temperature?: number;
      maxTokens?: number;
      stream?: boolean;
    }
  ): Promise<AIResponse> {
    const config = this.configs.get(model.provider);
    if (!config) {
      throw new Error(`No configuration found for provider: ${model.provider}`);
    }

    try {
      let responseData: {
        id: string;
        text: string;
        usage?: { promptTokens: number; completionTokens: number; totalTokens: number };
      };

      switch (model.provider) {
        case AIProvider.OPENROUTER:
        case AIProvider.OPENAI:
        case AIProvider.DEEPSEEK:
        case AIProvider.GROQ:
        case AIProvider.MORPH:
          responseData = await this.callOpenAICompatible(prompt, model, config, options);
          break;
        case AIProvider.ANTHROPIC:
          responseData = await this.callAnthropic(prompt, model, config, options);
          break;
        case AIProvider.GEMINI:
          responseData = await this.callGemini(prompt, model, config, options);
          break;
        default:
          throw new Error(`Unsupported provider: ${model.provider}`);
      }

      return {
        id: responseData.id || Date.now().toString(),
        text: responseData.text,
        model: model.id,
        provider: model.provider,
        usage:
          responseData.usage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        timestamp: new Date(),
      };
    } catch (error) {
      console.error(`Error calling ${model.provider}:`, error);
      throw new Error(
        `Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Call OpenAI-compatible APIs (OpenRouter, OpenAI, DeepSeek, Groq, Morph)
   */
  private async callOpenAICompatible(
    prompt: string,
    model: AIModel,
    config: ProviderConfig,
    options?: { temperature?: number; maxTokens?: number }
  ) {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify({
        model: model.id,
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? Math.min(model.maxTokens, 4000),
      }),
    });

    if (!response.ok) {
      let error: any = {};
      try {
        error = await response.json();
      } catch {
        // ignore
      }
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    return {
      id: data.id,
      text: data.choices?.[0]?.message?.content || '',
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
    };
  }

  /**
   * Call Anthropic API
   */
  private async callAnthropic(
    prompt: string,
    model: AIModel,
    config: ProviderConfig,
    options?: { temperature?: number; maxTokens?: number }
  ) {
    const response = await fetch(`${config.baseUrl}/messages`, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify({
        model: model.id,
        max_tokens: options?.maxTokens ?? Math.min(model.maxTokens, 4000),
        temperature: options?.temperature ?? 0.7,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      let error: any = {};
      try {
        error = await response.json();
      } catch {
        // ignore
      }
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    return {
      id: data.id,
      text: data.content?.[0]?.text || '',
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      },
    };
  }

  /**
   * Call Gemini API
   */
  private async callGemini(
    prompt: string,
    model: AIModel,
    config: ProviderConfig,
    options?: { temperature?: number; maxTokens?: number }
  ) {
    const response = await fetch(
      `${config.baseUrl}/models/${model.id}:generateContent?key=${config.apiKey}`,
      {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: options?.temperature ?? 0.7,
            maxOutputTokens: options?.maxTokens ?? Math.min(model.maxTokens, 4000),
          },
        }),
      }
    );

    if (!response.ok) {
      let error: any = {};
      try {
        error = await response.json();
      } catch {
        // ignore
      }
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    return {
      id: Date.now().toString(),
      text: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      },
    };
  }

  /**
   * Test API connection for a provider using a known model
   */
  async testConnection(provider: AIProvider): Promise<boolean> {
    const config = this.configs.get(provider);
    if (!config) return false;

    try {
      const models = getModelsByProvider(provider);
      const model = models[0];
      if (!model) return false;

      await this.generateResponse('Hello, this is a test.', model, { maxTokens: 10 });
      return true;
    } catch (error) {
      console.error(`Connection test failed for ${provider}:`, error);
      return false;
    }
  }

  /**
   * Get available providers (configured)
   */
  getAvailableProviders(): AIProvider[] {
    return Array.from(this.configs.keys());
  }

  /**
   * Check if provider is configured
   */
  isProviderConfigured(provider: AIProvider): boolean {
    return this.configs.has(provider);
  }
}

// Export singleton instance
export const aiService = new AIService();
