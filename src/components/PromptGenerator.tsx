
import { useState } from 'react';
import CategorySelector from './CategorySelector';
import PromptForm from './PromptForm';
import PromptOutput from './PromptOutput';
import { PromptCategory, PromptFormData } from '../types/promptTypes';

/**
 * Main prompt generator component that orchestrates the prompt creation workflow
 * Manages state for category selection, form data, and generated prompts
 */
export default function PromptGenerator() {
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory>('foundation-principles');
  const [formData, setFormData] = useState<PromptFormData>({});
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleCategoryChange = (category: PromptCategory) => {
    setSelectedCategory(category);
    setFormData({});
    setGeneratedPrompt('');
  };

  const handleFormChange = (data: PromptFormData) => {
    setFormData(data);
  };

  const handleGeneratePrompt = async () => {
    setIsGenerating(true);
    try {
      // Simulate prompt generation (in real app, this would call an API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const prompt = generatePromptForCategory(selectedCategory, formData);
      setGeneratedPrompt(prompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <CategorySelector 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>
      
      <div className="lg:col-span-3 space-y-8">
        <PromptForm 
          category={selectedCategory}
          formData={formData}
          onChange={handleFormChange}
          onGenerate={handleGeneratePrompt}
          isGenerating={isGenerating}
        />
        
        {generatedPrompt && (
          <PromptOutput 
            prompt={generatedPrompt}
            category={selectedCategory}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Generates a prompt based on the selected category and form data
 * This is a simplified version - in production, this would use more sophisticated logic
 */
function generatePromptForCategory(category: PromptCategory, data: PromptFormData): string {
  const basePrompts = {
    'foundation-principles': `You are a ${data.role || 'expert'} specializing in ${data.context || 'the requested domain'}.

Context: ${data.context || 'For the specified application'}
Constraints: ${data.constraints || 'Use best practices and current standards'}
Format: ${data.format || 'Return a well-structured response'}

Requirements:
${data.requirements || 'Provide a comprehensive solution'}

Please deliver a complete response that addresses all aspects of the request.`,
    
    'meta-prompting': `Analyze this prompt and suggest improvements for better AI responses:

Original Prompt: ${data.originalPrompt || '[Insert your prompt here]'}

Suggested Improvements:
- Add specificity about ${data.specificity || 'key details'}
- Include constraint for ${data.constraint || 'format/technology'}
- Clarify the expected output format
- Add context about ${data.context || 'relevant background'}

Optimized Prompt:
[Generate an improved version of the original prompt]`,
    
    'advanced-strategies': `Task: ${data.task || 'Implementation Request'}

Step-by-Step Breakdown:
${data.steps || '1. Define requirements\n2. Design solution\n3. Implement code\n4. Test functionality'}

Key Requirements:
${data.requirements || 'Deliver a complete, production-ready solution'}

Expected Output:
${data.outputFormat || 'Well-documented code with examples'}`,
    
    'debugging-flow': `Debugging Session:

Error Encountered: ${data.error || '[Describe the error]'}

Context:
- File: ${data.file || '[File path]'}
- Component: ${data.component || '[Component name]'}
- Dependencies: ${data.dependencies || '[Relevant packages]'}

Debugging Steps:
1. Analyze the error context
2. Check recent changes
3. Validate dependencies
4. Implement solution

Provide a step-by-step fix with explanations.`,
    
    'quality-assurance': `Validate this implementation:

${data.implementation || '[Insert code or solution]'}

Check for:
- Type safety and error handling
- Performance optimization opportunities
- Accessibility compliance
- Security considerations
- Best practices adherence

Provide:
✅ What's working correctly
⚠️ Potential improvements
❌ Critical issues to fix`,
    
    'design-system': `Create a ${data.componentType || 'component'} that follows our design system:

Design Tokens:
- Colors: ${data.colors || 'primary, secondary, accent'}
- Typography: ${data.typography || 'h1-h6, body, caption'}
- Spacing: ${data.spacing || '4px grid system'}
- Breakpoints: ${data.breakpoints || 'mobile, tablet, desktop'}

Requirements:
- Responsive design
- Dark mode support
- Accessibility compliance
- Consistent with existing components`,
    
    'workflow-automation': `Create an automation workflow for ${data.process || '[process name]'}:

Trigger: ${data.trigger || '[Event that starts workflow]'}

Steps:
${data.steps || '1. [First action]\n2. [Data transformation]\n3. [API call]'}

Error Handling:
- Retry mechanism
- Alert system
- Fallback actions

Deliver workflow configuration and documentation.`,
    
    'template-library': `Quick Start Template: ${data.templateType || 'Component Creation'}

Create a ${data.componentType || 'component type'} with:
- Props: ${data.props || '[interface definition]'}
- Styling: ${data.styling || '[framework] with [design system]'}
- Functionality: ${data.functionality || '[key features]'}
- Export: Default export with proper typing

Include examples and usage documentation.`
  };

  return basePrompts[category] || 'Please select a category and fill in the form details.';
}
