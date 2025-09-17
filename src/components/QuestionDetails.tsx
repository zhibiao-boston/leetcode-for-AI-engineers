import React, { useState } from 'react';
import { Question } from '../data/questions';
import EditableTag from './EditableTag';
import PythonEditor from './PythonEditor';

interface QuestionDetailsProps {
  question: Question | null;
}

const QuestionDetails: React.FC<QuestionDetailsProps> = ({ question }) => {
  const [customTag, setCustomTag] = useState('');
  const [pythonCode, setPythonCode] = useState('');

  // Python execution function
  const executePythonCode = async (code: string): Promise<{ output: string; error?: string; executionTime: number }> => {
    const startTime = Date.now();
    
    try {
      // For now, we'll simulate Python execution
      // In a real implementation, you would use Pyodide or send to a backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate execution time
      
      // Simple validation - check if code contains basic Python syntax
      if (code.includes('print(')) {
        const output = 'Hello from Python!\nCode executed successfully.';
        return {
          output,
          executionTime: Date.now() - startTime
        };
      } else {
        return {
          output: 'Code executed successfully.',
          executionTime: Date.now() - startTime
        };
      }
    } catch (error) {
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        executionTime: Date.now() - startTime
      };
    }
  };

  const handleCodeChange = (code: string) => {
    setPythonCode(code);
  };

  const handleCodeRun = async (code: string) => {
    return await executePythonCode(code);
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetails;
