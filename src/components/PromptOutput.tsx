
/**
 * Component to display the generated prompt with formatting and actions
 * Provides copy functionality and model selection for testing
 */

import { useState } from 'react';
import { PromptCategory } from '../types/promptTypes';
import { AIModel } from '../types/aiProviders';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import ModelSelector from './ModelSelector';
import AITester from './AITester';

/**
 * Component props
 */
interface PromptOutputProps {
  prompt: string;
  category: PromptCategory;
}

/**
 * Category display names
 */
const CATEGORY_NAMES = {
  'foundation-principles': 'Foundation Principles',
  'meta-prompting': 'Meta Prompting',
  'advanced-strategies': 'Advanced Strategies',
  'debugging-flow': 'Debugging Flow',
  'quality-assurance': 'Quality Assurance',
  'design-system': 'Design System',
  'workflow-automation': 'Workflow Automation',
  'template-library': 'Template Library'
};

/**
 * Category colors for visual distinction
 */
const CATEGORY_COLORS = {
  'foundation-principles': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'meta-prompting': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'advanced-strategies': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'debugging-flow': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'quality-assurance': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'design-system': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  'workflow-automation': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  'template-library': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
};

export default function PromptOutput({ prompt, category }: PromptOutputProps) {
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [showAITester, setShowAITester] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
  };

  const handleTestWithAI = () => {
    setShowModelSelector(true);
    setShowAITester(false);
  };

  const handleModelSelect = (model: AIModel) => {
    setSelectedModel(model);
    setShowModelSelector(false);
    setShowAITester(true);
  };

  const handleBackToModelSelection = () => {
    setShowModelSelector(true);
    setShowAITester(false);
  };

  return (
    <div className="space-y-6">
      {/* Generated Prompt Card */}
      <Card className="bg-white dark:bg-slate-800 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            Generated Prompt
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={CATEGORY_COLORS[category]}>
              {CATEGORY_NAMES[category]}
            </Badge>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyPrompt}
                className="bg-transparent"
              >
                Copy Prompt
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestWithAI}
                className="bg-transparent"
              >
                Test with AI
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <pre className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200 font-mono">
              {prompt}
            </pre>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Prompt Engineering Tips
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Be specific about roles and context to get better results</li>
              <li>• Include constraints to guide the AI's response format</li>
              <li>• Use structured formats for complex requests</li>
              <li>• Test and iterate on your prompts for optimal results</li>
            </ul>
          </div>
          
          <div className="mt-6 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>Category: {CATEGORY_NAMES[category]}</span>
            <span>Generated: {new Date().toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Model Selection */}
      {showModelSelector && (
        <ModelSelector
          selectedModel={selectedModel}
          onModelSelect={handleModelSelect}
        />
      )}

      {/* AI Tester */}
      {showAITester && selectedModel && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Testing with {selectedModel.name}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToModelSelection}
              className="bg-transparent"
            >
              Change Model
            </Button>
          </div>
          <AITester
            prompt={prompt}
            initialModel={selectedModel}
          />
        </div>
      )}
    </div>
  );
}
