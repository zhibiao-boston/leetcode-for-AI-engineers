import React, { useState, useEffect, useCallback } from 'react';
import { Question } from '../data/questions';
import PythonEditor from './PythonEditor';
import { useTheme } from '../contexts/ThemeContext';

interface QuestionDetailsProps {
  question: Question | null;
  onToggleQuestionList: () => void;
  isQuestionListVisible: boolean;
}

interface TestCaseResult {
  passed: boolean;
  actualOutput: string;
  executionTime: number;
}

const QuestionDetails: React.FC<QuestionDetailsProps> = ({ 
  question, 
  onToggleQuestionList, 
  isQuestionListVisible 
}) => {
  const { theme } = useTheme();
  const [currentCode, setCurrentCode] = useState('');
  const [testCaseResults, setTestCaseResults] = useState<Record<string, TestCaseResult>>({});
  const [activeTestCaseTab, setActiveTestCaseTab] = useState(0);
  const [leftPanelWidth, setLeftPanelWidth] = useState(45);
  const [isResizing, setIsResizing] = useState(false);

  // Handle code change from editor
  const handleCodeChange = useCallback((code: string) => {
    setCurrentCode(code);
  }, []);

  // Execute single test case
  const executeSingleTestCase = useCallback((testCase: any, code: string): TestCaseResult => {
    const startTime = Date.now();
    
    try {
      // Parse the test case input
      const input = testCase.input;
      
      // Simple simulation of method execution based on the code
      let actualOutput = '';
      
      // Look for the solve method in the code
      const solveMethodMatch = code.match(/def\s+solve\s*\([^)]*\)\s*:([\s\S]*?)(?=def|\Z)/);
      if (solveMethodMatch) {
        const methodBody = solveMethodMatch[1];
        
        // Check if method returns something
        if (methodBody.includes('return []')) {
          actualOutput = '[]';
        } else if (methodBody.includes('return')) {
          // Try to extract return value
          const returnMatch = methodBody.match(/return\s+([^#\n]+)/);
          if (returnMatch) {
            actualOutput = returnMatch[1].trim();
          } else {
            actualOutput = 'None';
          }
        } else {
          actualOutput = 'None';
        }
      } else {
        actualOutput = 'None';
      }
      
      const passed = actualOutput === testCase.expectedOutput;
      const executionTime = Date.now() - startTime;
      
      return {
        passed,
        actualOutput,
        executionTime
      };
    } catch (error) {
      return {
        passed: false,
        actualOutput: 'Error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        executionTime: Date.now() - startTime
      };
    }
  }, []);

  // Execute all test cases
  const executeAllTestCases = useCallback(() => {
    if (!question || !question.testCases) return;
    
    const results: Record<string, TestCaseResult> = {};
    
    question.testCases.slice(0, 2).forEach(testCase => {
      results[testCase.id] = executeSingleTestCase(testCase, currentCode);
    });
    
    setTestCaseResults(results);
  }, [question, currentCode, executeSingleTestCase]);

  // Handle resize
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const containerWidth = window.innerWidth;
    const newLeftWidth = (e.clientX / containerWidth) * 100;
    const clampedWidth = Math.max(20, Math.min(80, newLeftWidth));
    setLeftPanelWidth(clampedWidth);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Load question template when question changes
  useEffect(() => {
    if (question?.template) {
      setCurrentCode(question.template);
    }
  }, [question]);

  if (!question) {
    return (
      <div className="h-full flex items-center justify-center dark:bg-gray-900 bg-white">
        <div className="text-center">
          <div className="dark:text-gray-400 text-gray-600 text-lg mb-2">No question selected</div>
          <div className="dark:text-gray-500 text-gray-500 text-sm">Click on a question from the list to view details</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex dark:bg-gray-900 bg-white transition-colors duration-200">
      {/* Left Panel - Question Description */}
      <div 
        className="border-r dark:border-gray-700 border-gray-200 overflow-y-auto transition-colors duration-200"
        style={{ width: `${leftPanelWidth}%` }}
      >
        <div className="p-6">
          {/* Header with toggle button */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold dark:text-white text-gray-900">{question.title}</h1>
            <button
              onClick={onToggleQuestionList}
              className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors duration-200"
            >
              {isQuestionListVisible ? 'Hide List' : 'Show List'}
          </button>
      </div>

          {/* Question Info */}
          <div className="flex items-center space-x-4 text-sm dark:text-gray-400 text-gray-600 mb-6">
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

          {/* Categories */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {question.categories.map((category, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium dark:bg-gray-700 dark:text-gray-300 bg-gray-200 text-gray-700"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-invert max-w-none">
            <div className="dark:text-gray-300 text-gray-700 leading-relaxed whitespace-pre-line">
              {question.description}
            </div>
          </div>

          {/* Examples */}
          {question.examples && question.examples.length > 0 && (
            <div className="mt-8 pt-6 border-t dark:border-gray-700 border-gray-200">
              <h3 className="text-lg font-semibold dark:text-white text-gray-900 mb-4">Examples</h3>
              {question.examples.map((example, index) => (
                <div key={index} className="mb-4 p-4 dark:bg-gray-800 bg-gray-100 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium dark:text-gray-400 text-gray-600 mb-2">Input:</div>
                      <div className="dark:bg-gray-900 bg-white p-3 rounded border dark:border-gray-600 border-gray-300 font-mono text-sm dark:text-gray-100 text-gray-800 whitespace-pre-wrap">
                        {example.input}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium dark:text-gray-400 text-gray-600 mb-2">Output:</div>
                      <div className="dark:bg-gray-900 bg-white p-3 rounded border dark:border-gray-600 border-gray-300 font-mono text-sm dark:text-gray-100 text-gray-800 whitespace-pre-wrap">
                        {example.output}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          <div className="mt-8 pt-6 border-t dark:border-gray-700 border-gray-200">
            <h3 className="text-sm font-medium dark:text-gray-400 text-gray-600 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium dark:bg-gray-800 dark:text-gray-400 bg-gray-200 text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Submissions */}
          <div className="mt-8 pt-6 border-t dark:border-gray-700 border-gray-200">
            <h3 className="text-sm font-medium dark:text-gray-400 text-gray-600 mb-3">Recent Submissions</h3>
            <div className="space-y-2">
              {question.submissions?.map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-3 dark:bg-gray-800 bg-gray-100 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      submission.status === 'Accepted' ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <span className="text-sm dark:text-gray-300 text-gray-700">{submission.language}</span>
                  </div>
                  <div className="text-sm dark:text-gray-400 text-gray-600">{submission.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resizable Divider */}
      <div
        className="w-1 dark:bg-gray-600 bg-gray-300 cursor-col-resize hover:dark:bg-gray-500 hover:bg-gray-400 transition-colors duration-200 flex items-center justify-center"
        onMouseDown={handleMouseDown}
      >
        <div className="w-1 h-8 dark:bg-gray-400 bg-gray-500 rounded"></div>
      </div>

      {/* Right Panel - Code Editor and Test Cases */}
      <div 
        className="flex-1 flex flex-col min-h-0"
        style={{ width: isQuestionListVisible ? `${100 - leftPanelWidth}%` : '100%' }}
      >
        {/* Code Editor Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b dark:border-gray-700 border-gray-200 dark:bg-gray-800 bg-gray-50">
          <h3 className="text-lg font-semibold dark:text-white text-gray-900">Code Editor</h3>
              <div className="flex space-x-2">
                <button
              onClick={executeAllTestCases}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium"
            >
              Test Code
                </button>
              </div>
            </div>
            
        {/* Code Editor */}
        <div className="flex-1 p-0 min-h-0">
            <PythonEditor
            initialCode={question.template || `class Solution:
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
            height="100%"
              showHeader={false}
          />
        </div>

        {/* Test Cases */}
        {question && question.testCases && question.testCases.length > 0 && (
          <div className="border-t dark:border-gray-700 border-gray-200 dark:bg-gray-800 bg-gray-50">
            <div className="px-6 py-4">
              <h3 className="text-lg font-semibold dark:text-white text-gray-900 mb-4">Test Cases</h3>
              
              {/* Test Case Tabs */}
              <div className="flex space-x-1 mb-4">
                {question.testCases.slice(0, 2).map((testCase, index) => {
                  const testResult = testCaseResults[testCase.id];
                  return (
                    <button
                      key={testCase.id}
                      onClick={() => setActiveTestCaseTab(index)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 flex items-center space-x-2 ${
                        activeTestCaseTab === index
                          ? 'bg-purple-600 text-white'
                          : 'dark:bg-gray-700 bg-gray-200 dark:text-gray-300 text-gray-700 hover:dark:bg-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      <span>Test Case {index + 1}</span>
                      {testResult && (
                        <span className={`w-2 h-2 rounded-full ${
                          testResult.passed ? 'bg-green-400' : 'bg-red-400'
                        }`}></span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Active Test Case Content */}
              {question.testCases[activeTestCaseTab] && (
                <div className="rounded-lg p-4 border transition-colors duration-200 dark:bg-gray-900 dark:border-gray-700 bg-white border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium dark:text-gray-400 text-gray-600 mb-2">Input:</div>
                      <div className="dark:bg-gray-800 bg-gray-100 p-3 rounded border dark:border-gray-600 border-gray-300 font-mono text-sm dark:text-gray-100 text-gray-800 whitespace-pre-wrap">
                        {question.testCases[activeTestCaseTab].input}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium dark:text-gray-400 text-gray-600 mb-2">Expected Output:</div>
                      <div className="dark:bg-gray-800 bg-gray-100 p-3 rounded border dark:border-gray-600 border-gray-300 font-mono text-sm dark:text-gray-100 text-gray-800 whitespace-pre-wrap">
                        {question.testCases[activeTestCaseTab].expectedOutput}
                      </div>
                    </div>
                  </div>
                  
                  {/* Test Result */}
                  {testCaseResults[question.testCases[activeTestCaseTab].id] && (
                    <div className="mt-4 p-3 rounded border transition-colors duration-200 dark:bg-gray-800 dark:border-gray-600 bg-gray-100 border-gray-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium dark:text-gray-400 text-gray-600">Test Result:</div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          testCaseResults[question.testCases[activeTestCaseTab].id].passed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {testCaseResults[question.testCases[activeTestCaseTab].id].passed ? 'PASS' : 'FAIL'}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium dark:text-gray-400 text-gray-600 mb-1">Actual Output:</div>
                          <div className={`p-2 rounded font-mono text-sm whitespace-pre-wrap transition-colors duration-200 ${
                            testCaseResults[question.testCases[activeTestCaseTab].id].passed
                              ? 'dark:bg-green-900 dark:text-green-100 bg-green-100 text-green-800'
                              : 'dark:bg-red-900 dark:text-red-100 bg-red-100 text-red-800'
                          }`}>
                            {testCaseResults[question.testCases[activeTestCaseTab].id].actualOutput}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium dark:text-gray-400 text-gray-600 mb-1">Execution Time:</div>
                          <div className="text-sm dark:text-gray-300 text-gray-700">
                            {testCaseResults[question.testCases[activeTestCaseTab].id].executionTime}ms
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetails;
