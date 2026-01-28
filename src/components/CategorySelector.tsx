
import { CategoryInfo, PromptCategory } from '../types/promptTypes';
import { Button } from '../components/ui/button';

/**
 * Category selector component that allows users to choose a prompt engineering category
 * Displays categories in a grid with icons and descriptions
 */
const categories: CategoryInfo[] = [
  {
    id: 'foundation-principles',
    name: 'Foundation Principles',
    description: 'Basic prompt structure with role, context, and constraints',
    icon: '🏗️',
    color: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
  },
  {
    id: 'meta-prompting',
    name: 'Meta Prompting',
    description: 'Improve existing prompts with structured analysis',
    icon: '🔍',
    color: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
  },
  {
    id: 'advanced-strategies',
    name: 'Advanced Strategies',
    description: 'Step-by-step task breakdown and refactoring',
    icon: '🚀',
    color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
  },
  {
    id: 'debugging-flow',
    description: 'Systematic error isolation and debugging prompts',
    icon: '🐛',
    color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  },
  {
    id: 'quality-assurance',
    name: 'Quality Assurance',
    description: 'Comprehensive testing and validation prompts',
    icon: '✅',
    color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
  },
  {
    id: 'design-system',
    name: 'Design System',
    description: 'Component consistency and design token prompts',
    icon: '🎨',
    color: 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200'
  },
  {
    id: 'workflow-automation',
    name: 'Workflow Automation',
    description: 'API integration and webhook configuration prompts',
    icon: '⚙️',
    color: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
  },
  {
    id: 'template-library',
    name: 'Template Library',
    description: 'Quick start templates for common tasks',
    icon: '📚',
    color: 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200'
  }
];

interface CategorySelectorProps {
  selectedCategory: PromptCategory;
  onCategoryChange: (category: PromptCategory) => void;
}

export default function CategorySelector({ selectedCategory, onCategoryChange }: CategorySelectorProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
        Prompt Categories
      </h2>
      <p className="text-slate-600 dark:text-slate-300">
        Select a category to generate specialized prompts for different AI engineering tasks
      </p>
      
      <div className="grid grid-cols-1 gap-4">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={`h-auto p-4 flex items-start space-x-3 text-left ${
              selectedCategory === category.id 
                ? 'border-2 border-blue-500' 
                : 'bg-transparent'
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg ${category.color}`}>
              {category.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-slate-800 dark:text-slate-100">
                {category.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                {category.description}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
