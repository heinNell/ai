
import { PromptCategory, PromptFormData } from '../types/promptTypes';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

/**
 * Dynamic form component that changes based on the selected prompt category
 * Collects user input to generate specialized prompts
 */
interface PromptFormProps {
  category: PromptCategory;
  formData: PromptFormData;
  onChange: (data: PromptFormData) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function PromptForm({ category, formData, onChange, onGenerate, isGenerating }: PromptFormProps) {
  const handleInputChange = (field: keyof PromptFormData, value: string) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  const renderFormFields = () => {
    switch (category) {
      case 'foundation-principles':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="role">AI Role/Expertise</Label>
              <Input
                id="role"
                placeholder="e.g., Senior React Developer, UX Designer, Data Scientist"
                value={formData.role || ''}
                onChange={(e) => handleInputChange('role', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="context">Project Context</Label>
              <Textarea
                id="context"
                placeholder="Describe the project, application, or use case"
                value={formData.context || ''}
                onChange={(e) => handleInputChange('context', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="constraints">Constraints & Requirements</Label>
              <Textarea
                id="constraints"
                placeholder="Technologies, frameworks, limitations, or specific requirements"
                value={formData.constraints || ''}
                onChange={(e) => handleInputChange('constraints', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="format">Output Format</Label>
              <Input
                id="format"
                placeholder="e.g., JSON response, code file, markdown documentation"
                value={formData.format || ''}
                onChange={(e) => handleInputChange('format', e.target.value)}
              />
            </div>
          </>
        );

      case 'meta-prompting':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="originalPrompt">Original Prompt to Improve</Label>
              <Textarea
                id="originalPrompt"
                placeholder="Paste the prompt you want to optimize"
                value={formData.originalPrompt || ''}
                onChange={(e) => handleInputChange('originalPrompt', e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specificity">Specificity to Add</Label>
              <Input
                id="specificity"
                placeholder="What specific details should be included?"
                value={formData.specificity || ''}
                onChange={(e) => handleInputChange('specificity', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="constraint">Format/Technology Constraints</Label>
              <Input
                id="constraint"
                placeholder="What constraints should be applied?"
                value={formData.constraint || ''}
                onChange={(e) => handleInputChange('constraint', e.target.value)}
              />
            </div>
          </>
        );

      case 'advanced-strategies':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="task">Complex Task Description</Label>
              <Textarea
                id="task"
                placeholder="Describe the complex task you want to break down"
                value={formData.task || ''}
                onChange={(e) => handleInputChange('task', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="steps">Step-by-Step Breakdown</Label>
              <Textarea
                id="steps"
                placeholder="List the steps required to complete the task"
                value={formData.steps || ''}
                onChange={(e) => handleInputChange('steps', e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="outputFormat">Expected Output Format</Label>
              <Textarea
                id="outputFormat"
                placeholder="Describe how the output should be structured"
                value={formData.outputFormat || ''}
                onChange={(e) => handleInputChange('outputFormat', e.target.value)}
                rows={3}
              />
            </div>
          </>
        );

      case 'debugging-flow':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="error">Error Description</Label>
              <Textarea
                id="error"
                placeholder="Describe the error you're encountering"
                value={formData.error || ''}
                onChange={(e) => handleInputChange('error', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file">File/Component Location</Label>
              <Input
                id="file"
                placeholder="File path and component name"
                value={formData.file || ''}
                onChange={(e) => handleInputChange('file', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dependencies">Relevant Dependencies</Label>
              <Textarea
                id="dependencies"
                placeholder="List relevant packages, libraries, or dependencies"
                value={formData.dependencies || ''}
                onChange={(e) => handleInputChange('dependencies', e.target.value)}
                rows={2}
              />
            </div>
          </>
        );

      case 'quality-assurance':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="implementation">Code/Implementation to Validate</Label>
              <Textarea
                id="implementation"
                placeholder="Paste the code or implementation you want to validate"
                value={formData.implementation || ''}
                onChange={(e) => handleInputChange('implementation', e.target.value)}
                rows={6}
              />
            </div>
          </>
        );

      case 'design-system':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="componentType">Component Type</Label>
              <Input
                id="componentType"
                placeholder="e.g., Button, Card, Modal, Form"
                value={formData.componentType || ''}
                onChange={(e) => handleInputChange('componentType', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="colors">Color Tokens</Label>
              <Input
                id="colors"
                placeholder="e.g., primary: #4f46e5, secondary: #e5e7eb"
                value={formData.colors || ''}
                onChange={(e) => handleInputChange('colors', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="typography">Typography Scale</Label>
              <Input
                id="typography"
                placeholder="e.g., h1: 2.5rem, body: 1rem"
                value={formData.typography || ''}
                onChange={(e) => handleInputChange('typography', e.target.value)}
              />
            </div>
          </>
        );

      case 'workflow-automation':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="process">Process to Automate</Label>
              <Input
                id="process"
                placeholder="e.g., User onboarding, Data processing, Notification system"
                value={formData.process || ''}
                onChange={(e) => handleInputChange('process', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="trigger">Trigger Event</Label>
              <Textarea
                id="trigger"
                placeholder="What event starts the workflow?"
                value={formData.trigger || ''}
                onChange={(e) => handleInputChange('trigger', e.target.value)}
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="steps">Workflow Steps</Label>
              <Textarea
                id="steps"
                placeholder="List the steps in the workflow"
                value={formData.steps || ''}
                onChange={(e) => handleInputChange('steps', e.target.value)}
                rows={4}
              />
            </div>
          </>
        );

      case 'template-library':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="templateType">Template Type</Label>
              <Input
                id="templateType"
                placeholder="e.g., Component Creation, API Integration, Testing"
                value={formData.templateType || ''}
                onChange={(e) => handleInputChange('templateType', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="componentType">Component/Resource Type</Label>
              <Input
                id="componentType"
                placeholder="e.g., React component, API service, Test suite"
                value={formData.componentType || ''}
                onChange={(e) => handleInputChange('componentType', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="props">Props/Interface Definition</Label>
              <Textarea
                id="props"
                placeholder="Define the props or interface structure"
                value={formData.props || ''}
                onChange={(e) => handleInputChange('props', e.target.value)}
                rows={3}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
        Generate {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Prompt
      </h2>
      
      <div className="space-y-6">
        {renderFormFields()}
        
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? 'Generating Prompt...' : 'Generate Optimized Prompt'}
        </Button>
      </div>
    </div>
  );
}
