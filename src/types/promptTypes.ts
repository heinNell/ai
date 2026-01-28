
/**
 * Type definitions for the Prompt Engineering AI Tool
 * Defines the structure for categories, form data, and AI models
 */

/**
 * Available prompt categories based on the master engineer principles
 */
export type PromptCategory = 
  | 'foundation-principles'
  | 'meta-prompting'
  | 'advanced-strategies'
  | 'debugging-flow'
  | 'quality-assurance'
  | 'design-system'
  | 'workflow-automation'
  | 'template-library';

/**
 * Form data structure for each prompt category
 * Uses index signature to allow dynamic properties
 */
export interface PromptFormData {
  role?: string;
  context?: string;
  constraints?: string;
  format?: string;
  requirements?: string;
  originalPrompt?: string;
  specificity?: string;
  task?: string;
  steps?: string;
  outputFormat?: string;
  error?: string;
  file?: string;
  component?: string;
  dependencies?: string;
  implementation?: string;
  componentType?: string;
  colors?: string;
  typography?: string;
  spacing?: string;
  breakpoints?: string;
  process?: string;
  trigger?: string;
  templateType?: string;
  props?: string;
  styling?: string;
  functionality?: string;
  [key: string]: string | undefined;
}

/**
 * AI model configuration for different providers
 */
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens: number;
  supportsStreaming: boolean;
}

/**
 * Category information for the selector
 */
export interface CategoryInfo {
  id: PromptCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}

/**
 * Prompt generation result
 */
export interface PromptResult {
  prompt: string;
  category: PromptCategory;
  timestamp: Date;
  formData: PromptFormData;
}
