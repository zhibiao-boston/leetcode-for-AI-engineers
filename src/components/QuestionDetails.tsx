import React, { useState } from 'react';
import { Question } from '../data/questions';
import PythonEditor from './PythonEditor';

interface QuestionDetailsProps {
  question: Question | null;
}

const QuestionDetails: React.FC<QuestionDetailsProps> = ({ question }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [triggerRun, setTriggerRun] = useState(0);
  const [triggerClear, setTriggerClear] = useState(0);

  // Python execution function
  const executePythonCode = async (code: string): Promise<{ output: string; error?: string; executionTime: number }> => {
    const startTime = Date.now();
    
    try {
      // Simulate realistic Python execution
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      // Enhanced code analysis and execution simulation
      let output = '';
      let hasError = false;
      
      // Check for syntax errors
      if (code.includes('def ') && !code.includes(':')) {
        hasError = true;
        output = '';
      }
      
      // Check for common Python patterns and simulate output
      if (code.includes('print(')) {
        // Extract print statements and simulate output
        const printMatches = code.match(/print\([^)]+\)/g);
        if (printMatches) {
          output = printMatches.map(print => {
            // Simulate print output - extract content between quotes
            const content = print.replace(/print\(|\)/g, '').replace(/['"]/g, '');
            return content;
          }).join('\n');
        }
      }
      
      // Check for mathematical operations
      if (code.includes('sum(') || code.includes('len(') || code.includes('max(')) {
        output += '\nFunction executed successfully.';
      }
      
      // Check for variable assignments
      if (code.includes('=') && !code.includes('==')) {
        output += '\nVariable assigned successfully.';
      }
      
      // Check for loops
      if (code.includes('for ') || code.includes('while ')) {
        output += '\nLoop executed successfully.';
      }
      
      // Default success message
      if (!output && !hasError) {
        output = 'Code executed successfully.\nNo output generated.';
      }
      
      return {
        output: output || 'Code executed successfully.',
        error: hasError ? 'Syntax Error: Missing colon after function definition' : undefined,
        executionTime: Date.now() - startTime
      };
>>>>>>> af13b53ed316492e25b2f85feb32354844a3adbd
    } catch (error) {
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        executionTime: Date.now() - startTime
      };
    }
  };

  const handleCodeChange = (code: string) => {
    // Code change handler - can be extended for auto-save functionality
    console.log('Code changed:', code.length, 'characters');
  };

  const handleCodeRun = async (code: string) => {
<<<<<<< HEAD
    return await executePythonCode(code);
=======
    setIsRunning(true);
    try {
      const result = await executePythonCode(code);
      return result;
    } finally {
      setIsRunning(false);
    }
  };

  const handleRun = () => {
    setTriggerRun(prev => prev + 1);
  };

  const handleClear = () => {
    setTriggerClear(prev => prev + 1);
>>>>>>> af13b53ed316492e25b2f85feb32354844a3adbd
  };

  if (!question) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">No question selected</div>
          <div className="text-gray-500 text-sm">Click on a question from the list to view details</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8 px-6">
          <button className="py-4 px-1 border-b-2 border-primary-600 text-primary-600 font-medium text-sm">
            DESCRIPTION
          </button>
        </nav>
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl">
          {/* Question Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">{question.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span>{question.difficulty}</span>
              </span>
              {question.company && (
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                  <span>{question.company}</span>
                </span>
              )}
              <span>{question.lastReported}</span>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {question.categories.map((category, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed whitespace-pre-line">
              {question.description}
            </div>
          </div>

<<<<<<< HEAD
          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-800 text-gray-400"
                >
                  {tag}
                </span>
              ))}
              <EditableTag
                value={customTag}
                onChange={setCustomTag}
                placeholder="Add custom tag..."
                maxLength={50}
              />
            </div>
          </div>

          {/* Python Editor */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Python Editor</h3>
=======

          {/* Python Editor */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            {/* Header row with title and buttons */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-400">Python Editor</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm"
                >
                  {isRunning ? 'Running...' : 'Run'}
                </button>
                <button
                  onClick={handleClear}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-md transition-colors duration-200 text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
            
>>>>>>> af13b53ed316492e25b2f85feb32354844a3adbd
            <PythonEditor
              initialCode={`class Solution:
    def solve(self, input_data):
        """
        Implement your solution here
        
        Args:
            input_data: The input data for the problem
            
        Returns:
            The solution result
        """
        # Your code here
        pass

# Example usage
if __name__ == "__main__":
    solution = Solution()
    # Test your solution here
    print("Solution ready!")
`}
              onCodeChange={handleCodeChange}
              onRun={handleCodeRun}
              height="400px"
<<<<<<< HEAD
=======
              showHeader={false}
              triggerRun={triggerRun}
              triggerClear={triggerClear}
>>>>>>> af13b53ed316492e25b2f85feb32354844a3adbd
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetails;
