/**
 * Type definitions for AI providers and models
 * Defines the structure for different AI services and their configurations
 */

import { ENV } from '../lib/env';

/**
 * AI Provider enum for supported services
 */
export enum AIProvider {
  OPENROUTER = 'openrouter',
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GEMINI = 'gemini',
  DEEPSEEK = 'deepseek',
  GROQ = 'groq',
  MORPH = 'morph',
}

/**
 * AI Model configuration interface
 */
export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  description: string;
  maxTokens: number;
  supportsStreaming: boolean;
  costPer1kTokens: number;
  category: 'chat' | 'code' | 'multimodal';
}

/**
 * API Response interface for AI calls
 */
export interface AIResponse {
  id: string;
  text: string;
  model: string;
  provider: AIProvider;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  timestamp: Date;
}

/**
 * Provider configuration interface
 */
export interface ProviderConfig {
  provider: AIProvider;
  apiKey: string;
  baseUrl?: string;
  headers?: Record<string, string>;
}

/**
 * Available models for each provider
 */
export const AVAILABLE_MODELS: AIModel[] = [
  // OpenRouter Models
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: AIProvider.OPENROUTER,
    description: 'Latest Anthropic model with enhanced reasoning',
    maxTokens: 200000,
    supportsStreaming: true,
    costPer1kTokens: 0.003,
    category: 'chat',
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: AIProvider.OPENROUTER,
    description: "OpenAI's most advanced multimodal model",
    maxTokens: 128000,
    supportsStreaming: true,
    costPer1kTokens: 0.005,
    category: 'multimodal',
  },
  {
    id: 'google/gemini-pro-1.5',
    name: 'Gemini Pro 1.5',
    provider: AIProvider.OPENROUTER,
    description: "Google's advanced multimodal model",
    maxTokens: 2097152,
    supportsStreaming: true,
    costPer1kTokens: 0.00125,
    category: 'multimodal',
  },
  {
    id: 'deepseek/deepseek-r1',
    name: 'DeepSeek R1',
    provider: AIProvider.OPENROUTER,
    description: "DeepSeek's reasoning model",
    maxTokens: 64000,
    supportsStreaming: true,
    costPer1kTokens: 0.00055,
    category: 'chat',
  },

  // OpenAI Models
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: AIProvider.OPENAI,
    description: "OpenAI's most advanced multimodal model",
    maxTokens: 128000,
    supportsStreaming: true,
    costPer1kTokens: 0.005,
    category: 'multimodal',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: AIProvider.OPENAI,
    description: 'Smaller, faster version of GPT-4o',
    maxTokens: 128000,
    supportsStreaming: true,
    costPer1kTokens: 0.00015,
    category: 'chat',
  },

  // Anthropic Models
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: AIProvider.ANTHROPIC,
    description: 'Latest Anthropic model with enhanced reasoning',
    maxTokens: 200000,
    supportsStreaming: true,
    costPer1kTokens: 0.003,
    category: 'chat',
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: AIProvider.ANTHROPIC,
    description: 'Fast and compact model for quick tasks',
    maxTokens: 200000,
    supportsStreaming: true,
    costPer1kTokens: 0.00025,
    category: 'chat',
  },

  // Gemini Models
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: AIProvider.GEMINI,
    description: "Google's advanced multimodal model",
    maxTokens: 2097152,
    supportsStreaming: true,
    costPer1kTokens: 0.00125,
    category: 'multimodal',
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: AIProvider.GEMINI,
    description: 'Fast and efficient model for high-volume tasks',
    maxTokens: 1048576,
    supportsStreaming: true,
    costPer1kTokens: 0.000075,
    category: 'chat',
  },

  // DeepSeek Models
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: AIProvider.DEEPSEEK,
    description: "DeepSeek's conversational AI model",
    maxTokens: 64000,
    supportsStreaming: true,
    costPer1kTokens: 0.00014,
    category: 'chat',
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    provider: AIProvider.DEEPSEEK,
    description: 'Specialized model for code generation',
    maxTokens: 64000,
    supportsStreaming: true,
    costPer1kTokens: 0.00014,
    category: 'code',
  },

  // Groq (OpenAI-compatible endpoint)
  {
    id: 'llama-3.1-70b-versatile',
    name: 'Llama 3.1 70B (Groq)',
    provider: AIProvider.GROQ,
    description: 'High-throughput, low-latency inference via Groq',
    maxTokens: 32768,
    supportsStreaming: true,
    costPer1kTokens: 0.0002,
    category: 'chat',
  },
  {
    id: 'mixtral-8x7b-32768',
    name: 'Mixtral 8x7B (Groq)',
    provider: AIProvider.GROQ,
    description: 'Efficient MoE model served by Groq',
    maxTokens: 32768,
    supportsStreaming: true,
    costPer1kTokens: 0.0001,
    category: 'chat',
  },
  {
    id: 'gemma2-9b-it',
    name: 'Gemma 2 9B IT (Groq)',
    provider: AIProvider.GROQ,
    description: 'Instruction-tuned model via Groq',
    maxTokens: 32768,
    supportsStreaming: true,
    costPer1kTokens: 0.00012,
    category: 'chat',
  },

  // Morph (OpenAI-compatible; model IDs vary, so keep flexible)
  // Tip: Use the ProviderSelector and ModelIdInput to set the exact model ID for Morph.
];

/**
 * Provider configurations with API keys
 */
export const PROVIDER_CONFIGS: ProviderConfig[] = [
  {
    provider: AIProvider.OPENROUTER,
    apiKey: ENV.OPENROUTER(),
    baseUrl: 'https://openrouter.ai/api/v1',
    headers: {
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
      'X-Title': 'Prompt Engineering AI Tool',
    },
  },
  {
    provider: AIProvider.OPENAI,
    apiKey: ENV.OPENAI(),
    baseUrl: 'https://api.openai.com/v1',
  },
  {
    provider: AIProvider.ANTHROPIC,
    apiKey: ENV.ANTHROPIC(),
    baseUrl: 'https://api.anthropic.com',
  },
  {
    provider: AIProvider.GEMINI,
    apiKey: ENV.GEMINI(),
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
  },
  {
    provider: AIProvider.DEEPSEEK,
    apiKey: ENV.DEEPSEEK(),
    baseUrl: 'https://api.deepseek.com',
  },
  {
    provider: AIProvider.GROQ,
    apiKey: ENV.GROQ(),
    baseUrl: 'https://api.groq.com/openai/v1',
  },
  {
    provider: AIProvider.MORPH,
    apiKey: ENV.MORPH(),
    baseUrl: ENV.MORPH_BASE_URL(),
  },
];

/**
 * Get models by provider
 */
export function getModelsByProvider(provider: AIProvider): AIModel[] {
  return AVAILABLE_MODELS.filter((model) => model.provider === provider);
}

/**
 * Get model by ID
 */
export function getModelById(id: string): AIModel | undefined {
  return AVAILABLE_MODELS.find((model) => model.id === id);
}

/**
 * Get provider configuration
 */
export function getProviderConfig(provider: AIProvider): ProviderConfig | undefined {
  return PROVIDER_CONFIGS.find((config) => config.provider === provider);
}