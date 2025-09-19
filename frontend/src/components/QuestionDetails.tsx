import React, { useState, useEffect, useCallback } from 'react';
import { Question } from '../data/questions';
import PythonEditor from './PythonEditor';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface QuestionDetailsProps {
  question: Question | null;
  onToggleQuestionList?: () => void;
  isQuestionListVisible?: boolean;
}

interface Submission {
  id: string;
  problem_id: string;
  code: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compile Error' | 'Memory Limit Exceeded' | 'Output Limit Exceeded' | 'Presentation Error';
  execution_time?: number;
  memory_usage?: number;
  test_cases_passed: number;
  total_test_cases: number;
  submitted_at: string;
}

const QuestionDetails: React.FC<QuestionDetailsProps> = ({ 
  question, 
  onToggleQuestionList, 
  isQuestionListVisible = true 
}) => {
  const { token, user } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'description' | 'submissions'>('description');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  // Test case related state
  const [activeTestCaseTab, setActiveTestCaseTab] = useState(0);
  const [testCaseResults, setTestCaseResults] = useState<Record<string, {
    passed: boolean;
    actualOutput: string;
    expectedOutput: string;
    executionTime: number;
  }>>({});
  
  const [currentCode, setCurrentCode] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [layoutTrigger, setLayoutTrigger] = useState(0);

  const getTestCases = (question: Question | null) => {
    if (!question || !question.testCases) return [];
    return question.testCases.map(tc => ({
      id: tc.id,
      input: tc.input,
      expectedOutput: tc.expectedOutput
    }));
  };

  const getTemplateForQuestion = (question: Question | null) => {
    if (!question) return '';
    return question.template || `class Solution {
    public int[] findArray(int[] pref) {
        
    }
}`;
  };

  const handleCodeChange = useCallback((value: string | undefined) => {
    setCurrentCode(value || '');
  }, []);

  const executeSingleTestCase = (testCase: any, code: string) => {
    const startTime = Date.now();
    
    try {
      // Simple mock execution - in real app this would be server-side
      let actualOutput = 'null';
      
      // Mock different outputs based on code content for demonstration
      if (code.includes('return')) {
        if (code.includes('pref[0]')) {
          actualOutput = '[5,7,2,3]';
        } else if (code.includes('new int')) {
          actualOutput = '[]';
        }
      }
      
      const executionTime = Date.now() - startTime;
      const passed = actualOutput === testCase.expectedOutput;
      
      return {
        passed,
        actualOutput,
        expectedOutput: testCase.expectedOutput,
        executionTime
      };
    } catch (error) {
      return {
        passed: false,
        actualOutput: 'Error',
        expectedOutput: testCase.expectedOutput,
        executionTime: Date.now() - startTime
      };
    }
  };

  const executeAllTestCases = (code: string) => {
    if (!question) return;
    
    const testCases = getTestCases(question).slice(0, 2);
    const results: Record<string, {
      passed: boolean;
      actualOutput: string;
      expectedOutput: string;
      executionTime: number;
    }> = {};
    
    testCases.forEach(testCase => {
      const result = executeSingleTestCase(testCase, code);
      results[testCase.id] = result;
    });
    
    setTestCaseResults(results);
  };

  // Create submission record
  const createSubmission = async (code: string, result: string) => {
    if (!user || !question || !token) return;

    try {
      const submissionData = {
        problem_id: question.id,
        language: 'java',
        code: code,
        status: result as any,
        execution_time: Math.floor(Math.random() * 100) + 10,
        memory_usage: Math.floor(Math.random() * 50) + 10,
        test_cases_passed: 2,
        total_test_cases: 2
      };

      const response = await fetch('http://localhost:8000/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        fetchSubmissions();
      }
    } catch (error) {
      console.error('Error creating submission:', error);
    }
  };

  const handleCodeRun = async (code: string) => {
    setIsRunning(true);
    
    // Execute test cases
    executeAllTestCases(code);
    
    // Simulate some processing time
    setTimeout(async () => {
      await createSubmission(code, 'Accepted');
      setIsRunning(false);
    }, 1000);
  };

  const fetchSubmissions = useCallback(async () => {
    if (!question || !token) return;
    
    setLoadingSubmissions(true);
    try {
      const response = await fetch(`http://localhost:8000/api/submissions?problem_id=${question.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoadingSubmissions(false);
    }
  }, [question, token]);

  useEffect(() => {
    if (question) {
      setCurrentCode(getTemplateForQuestion(question));
      fetchSubmissions();
    }
  }, [question, fetchSubmissions]);

  useEffect(() => {
    setLayoutTrigger(prev => prev + 1);
  }, []);

  if (!question) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className={`text-lg mb-2 transition-colors duration-200 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>No question selected</div>
          <div className={`text-sm transition-colors duration-200 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>Click on a question from the list to view details</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`flex-shrink-0 border-b px-6 py-4 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Toggle Question List Button */}
            {onToggleQuestionList && (
                <button
                onClick={onToggleQuestionList}
                className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
                title={isQuestionListVisible ? "Hide question list" : "Show question list"}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
            )}
            
            <div className="flex items-center space-x-3">
              <span className="text-lg font-semibold">{question.id}. {question.title}</span>
              <span className={`px-2 py-1 text-xs rounded font-medium ${
                question.difficulty === 'easy' 
                  ? 'bg-green-100 text-green-800' 
                  : question.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                  {question.difficulty}
                </span>
              
              {/* Topics */}
              <div className="flex items-center space-x-2">
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Topics</span>
                <div className="flex space-x-1">
                  {(question.categories || []).map((topic, index) => (
                    <span key={index} className={`px-2 py-1 text-xs rounded ${
                      theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleCodeRun(currentCode)}
              disabled={isRunning}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium"
            >
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
            <button
              onClick={() => executeAllTestCases(currentCode)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium"
            >
              Test Code
            </button>
          </div>
        </div>
      </div>

      {/* Content - LeetCode Style Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Question Description */}
        <div 
          className={`w-1/2 border-r p-6 overflow-y-auto transition-colors duration-200 ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}
              >
          {activeTab === 'description' ? (
            <div className="space-y-6">
              <div>
                <h2 className={`text-lg font-semibold mb-3 transition-colors duration-200 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Description</h2>
                <div className={`whitespace-pre-wrap leading-relaxed transition-colors duration-200 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {question.description}
                </div>
              </div>
              
              {/* Examples */}
              {question.examples && question.examples.length > 0 && (
                <div>
                  <h3 className={`text-md font-semibold mb-2 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Examples</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {question.examples.map((example: any, index: number) => (
                      <div key={index} className={`rounded border p-3 ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Example {index + 1} Input:</div>
                            <pre className={`text-sm font-mono p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>{example.input}</pre>
                          </div>
                          <div>
                            <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Example {index + 1} Output:</div>
                            <pre className={`text-sm font-mono p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>{example.output}</pre>
                          </div>
                        </div>
                        {example.explanation && (
                          <div className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            <strong>Explanation:</strong> {example.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Categories */}
              {question.categories && question.categories.length > 0 && (
              <div>
                  <h3 className={`text-md font-semibold mb-2 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Categories</h3>
                <div className="flex flex-wrap gap-2">
                    {question.categories.map((category: string, index: number) => (
                      <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                        theme === 'dark' 
                          ? 'bg-purple-600 text-purple-100' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              )}

              {/* Tags */}
              {question.tags && question.tags.length > 0 && (
              <div>
                  <h3 className={`text-md font-semibold mb-2 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {question.tags.map((tag: string, index: number) => (
                      <span key={index} className={`px-2 py-1 text-xs rounded transition-colors duration-200 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              )}
            </div>
          ) : (
            // Submissions tab content
            <div className="space-y-4">
              <h2 className={`text-lg font-semibold transition-colors duration-200 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Submissions</h2>
              
              {loadingSubmissions ? (
                <div className="text-center py-8">
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Loading submissions...
                  </div>
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-8">
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    No submissions yet
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {submissions.map((submission, index) => (
                    <div
                      key={submission.id}
                      onClick={() => setSelectedSubmission(submission)}
                      className={`p-3 border rounded cursor-pointer transition-colors duration-200 ${
                        selectedSubmission?.id === submission.id
                          ? theme === 'dark'
                            ? 'border-purple-500 bg-purple-900/20'
                            : 'border-purple-500 bg-purple-50'
                          : theme === 'dark'
                            ? 'border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs rounded font-medium ${
                            submission.status === 'Accepted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {submission.status}
                          </span>
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {submission.language}
                          </span>
                        </div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(submission.submitted_at).toLocaleString()}
                        </div>
                      </div>
                      
                      {submission.execution_time && (
                        <div className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Runtime: {submission.execution_time}ms | Memory: {submission.memory_usage}MB
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
              </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Editor Header */}
          <div className={`border-b px-4 py-3 transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <span className={`text-sm font-medium transition-colors duration-200 ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`}>Code</span>
              </div>
                          <div className="flex items-center space-x-2">
                <span className={`text-xs transition-colors duration-200 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Java</span>
                <div className={`w-2 h-2 rounded-full bg-green-500`}></div>
                <span className={`text-xs transition-colors duration-200 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Auto</span>
                        </div>
                      </div>
                    </div>
                  
          <div className="flex-1 flex flex-col">
            {/* Code Editor */}
            <div className="flex-1 w-full" style={{ width: '100%', minWidth: '100%', maxWidth: '100%' }}>
              <PythonEditor
                initialCode={getTemplateForQuestion(question)}
                onCodeChange={handleCodeChange}
                height="100%"
                showHeader={false}
                externalCode={selectedSubmission?.code}
                layoutTrigger={layoutTrigger}
              />
            </div>

            {/* Test Cases Section - Bottom of right panel */}
            {question && getTestCases(question).length > 0 && (
              <div className={`border-t transition-colors duration-200 ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className={`px-6 py-4 transition-colors duration-200 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  {/* Test Case Tabs */}
                  <div className="flex space-x-1 mb-4">
                    {getTestCases(question).slice(0, 2).map((testCase: any, index: number) => {
                      const testResult = testCaseResults[testCase.id];
                      return (
                    <button
                          key={testCase.id}
                          onClick={() => setActiveTestCaseTab(index)}
                          className={`px-4 py-2 text-sm font-medium rounded transition-colors duration-200 ${
                            activeTestCaseTab === index
                              ? theme === 'dark'
                                ? 'bg-green-600 text-white'
                                : 'bg-green-100 text-green-800'
                              : theme === 'dark'
                                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          Case {index + 1}
                          {testResult && (
                            <span className={`ml-2 ${
                              testResult.passed ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {testResult.passed ? '✓' : '✗'}
                            </span>
                          )}
                    </button>
                      );
                    })}
                  </div>

                  {/* Active Test Case Content */}
                  {getTestCases(question)[activeTestCaseTab] && (
                    <div className={`rounded-lg p-4 border transition-colors duration-200 ${
                      theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                  <div className="space-y-4">
                        <div>
                          <div className={`text-sm font-medium mb-2 transition-colors duration-200 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>Input:</div>
                          <div className={`p-3 rounded border font-mono text-sm whitespace-pre-wrap transition-colors duration-200 ${
                            theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'
                          }`}>
                            {getTestCases(question)[activeTestCaseTab].input}
                          </div>
                        </div>
                        <div>
                          <div className={`text-sm font-medium mb-2 transition-colors duration-200 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>Expected Output:</div>
                          <div className={`p-3 rounded border font-mono text-sm whitespace-pre-wrap transition-colors duration-200 ${
                            theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'
                          }`}>
                            {getTestCases(question)[activeTestCaseTab].expectedOutput}
                          </div>
                        </div>
                            </div>
                          </div>
                        )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
          </div>
  );
};

export default QuestionDetails;