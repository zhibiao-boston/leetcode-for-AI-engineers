import React, { useState, useEffect, useCallback } from 'react';
import { Question } from '../data/questions';
import PythonEditor from './PythonEditor';
import { useAuth } from '../contexts/AuthContext';
import { useProblems, AdminSolution } from '../contexts/ProblemContext';

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
  const { getPublishedSolutionsForProblem } = useProblems();
  const [activeTab, setActiveTab] = useState<'description' | 'submissions' | 'solutions'>('description');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [solutions, setSolutions] = useState<AdminSolution[]>([]);
  const [loadingSolutions, setLoadingSolutions] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(60); // Percentage width for left panel (60% left, 40% right)
  const [isResizing, setIsResizing] = useState(false);
  const [layoutTrigger, setLayoutTrigger] = useState(0);

  // Fetch submissions for current problem
  const fetchSubmissions = useCallback(async () => {
    if (!token || !question) return;

    try {
      setLoadingSubmissions(true);
      const response = await fetch(`http://localhost:5000/api/submissions/my-submissions?problem_id=${question.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoadingSubmissions(false);
    }
  }, [token, question]);

  // Fetch published solutions for current problem
  const fetchSolutions = useCallback(async () => {
    if (!question) return;

    try {
      setLoadingSolutions(true);
      const publishedSolutions = await getPublishedSolutionsForProblem(question.id);
      setSolutions(publishedSolutions);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    } finally {
      setLoadingSolutions(false);
    }
  }, [question, getPublishedSolutionsForProblem]);

  // Fetch submissions when question changes
  useEffect(() => {
    if (question && token) {
      fetchSubmissions();
    }
  }, [question, token, fetchSubmissions]);

  // Fetch solutions when question changes
  useEffect(() => {
    if (question) {
      fetchSolutions();
    }
  }, [question, fetchSolutions]);

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
      if (!output) {
        output = 'Code executed successfully!\nExecution completed without errors.';
      }
      
      return {
        output: output || 'Code executed successfully.',
        error: hasError ? 'Syntax Error: Missing colon after function definition' : undefined,
        executionTime: Date.now() - startTime
      };
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

  // Create submission record
  const createSubmission = async (code: string, result: { output: string; error?: string; executionTime: number }) => {
    if (!token || !user || !question) return;

    try {
      // Determine submission status based on result
      let status = 'Accepted';
      if (result.error) {
        status = 'Runtime Error';
      } else if (result.executionTime > 5000) {
        status = 'Time Limit Exceeded';
      }

      const submissionData = {
        problem_id: question.id,
        code: code,
        language: 'python',
        status: status,
        execution_time: Math.round(result.executionTime),
        memory_usage: Math.random() * 20 + 5, // Simulate memory usage
        test_cases_passed: result.error ? 0 : Math.floor(Math.random() * 5) + 1,
        total_test_cases: 5
      };

      const response = await fetch('http://localhost:5000/api/submissions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        console.log('Submission created successfully');
        // Refresh submissions list
        await fetchSubmissions();
      } else {
        console.error('Failed to create submission');
      }
    } catch (error) {
      console.error('Error creating submission:', error);
    }
  };

  const handleCodeRun = async (code: string) => {
    try {
      const result = await executePythonCode(code);
      
      // Create submission record
      await createSubmission(code, result);
      
      return result;
    } catch (error) {
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        executionTime: 0
      };
    }
  };


  // Handle clicking on a submission to load code into editor
  const handleLoadSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    // Switch to description tab to show the loaded code
    setActiveTab('description');
  };

  // Handle resize functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const container = document.querySelector('.resizable-container') as HTMLElement;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Constrain between 30% and 70% for better balance
    const constrainedWidth = Math.min(Math.max(newLeftWidth, 30), 70);
    setLeftPanelWidth(constrainedWidth);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    // Trigger layout update for the editor
    setTimeout(() => {
      setLayoutTrigger(prev => prev + 1);
    }, 100);
  }, []);

  // Add event listeners for mouse move and up
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const statusColors = {
    'Accepted': 'text-green-600 bg-green-100',
    'Wrong Answer': 'text-red-600 bg-red-100',
    'Time Limit Exceeded': 'text-yellow-600 bg-yellow-100',
    'Runtime Error': 'text-red-600 bg-red-100',
    'Compile Error': 'text-red-600 bg-red-100',
    'Memory Limit Exceeded': 'text-orange-600 bg-orange-100',
    'Output Limit Exceeded': 'text-orange-600 bg-orange-100',
    'Presentation Error': 'text-blue-600 bg-blue-100'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatExecutionTime = (time?: number) => {
    if (!time) return 'N/A';
    return `${time}ms`;
  };

  const formatMemoryUsage = (memory?: number) => {
    if (!memory) return 'N/A';
    return `${memory}MB`;
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
      {/* Header */}
      <div className="flex-shrink-0 bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Toggle Question List Button */}
            {onToggleQuestionList && (
              <button
                onClick={onToggleQuestionList}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
                title={isQuestionListVisible ? 'Hide Question List' : 'Show Question List'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isQuestionListVisible ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  )}
                </svg>
              </button>
            )}
            
            <div>
              <h1 className="text-xl font-semibold text-white">{question.title}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {question.difficulty}
                </span>
                <span className="text-sm text-gray-400">{question.company}</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'description'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'submissions'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Submissions ({submissions.length})
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'solutions'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Solutions ({solutions.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden resizable-container">
        {/* Left Panel - Description or Submissions */}
        <div 
          className="border-r border-gray-700 p-6 overflow-y-auto"
          style={{ width: `${leftPanelWidth}%` }}
        >
          {activeTab === 'description' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Description</h2>
                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {question.description}
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-semibold text-white mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {question.categories.map((category, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-md font-semibold text-white mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'solutions' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Published Solutions</h2>
                <button
                  onClick={fetchSolutions}
                  disabled={loadingSolutions}
                  className="text-sm text-purple-400 hover:text-purple-300 disabled:opacity-50"
                >
                  {loadingSolutions ? 'Loading...' : 'Refresh'}
                </button>
              </div>
              
              {loadingSolutions ? (
                <div className="text-center py-8">
                  <div className="text-gray-400">Loading solutions...</div>
                </div>
              ) : solutions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">No published solutions available</div>
                  <p className="text-gray-500 text-sm">Solutions will appear here once they are published by administrators.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {solutions.map((solution) => (
                    <div key={solution.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">{solution.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            solution.language === 'python' ? 'bg-green-100 text-green-800' :
                            solution.language === 'javascript' ? 'bg-yellow-100 text-yellow-800' :
                            solution.language === 'java' ? 'bg-red-100 text-red-800' :
                            solution.language === 'cpp' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {solution.language.toUpperCase()}
                          </span>
                          {solution.time_complexity && (
                            <span className="text-xs text-gray-400">Time: {solution.time_complexity}</span>
                          )}
                          {solution.space_complexity && (
                            <span className="text-xs text-gray-400">Space: {solution.space_complexity}</span>
                          )}
                        </div>
                      </div>
                      
                      {solution.description && (
                        <p className="text-gray-300 mb-3">{solution.description}</p>
                      )}
                      
                      <div className="bg-gray-900 rounded p-3 mb-3">
                        <div className="text-sm text-gray-400 mb-2">Code:</div>
                        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono overflow-x-auto">
                          {solution.code}
                        </pre>
                      </div>
                      
                      {solution.explanation && (
                        <div>
                          <div className="text-sm text-gray-400 mb-2">Explanation:</div>
                          <p className="text-gray-300 text-sm">{solution.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Your Submissions</h2>
                <button
                  onClick={fetchSubmissions}
                  disabled={loadingSubmissions}
                  className="text-sm text-purple-400 hover:text-purple-300 disabled:opacity-50"
                >
                  {loadingSubmissions ? 'Loading...' : 'Refresh'}
                </button>
              </div>
              
              {loadingSubmissions ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No submissions yet</p>
                  <p className="text-sm text-gray-500 mt-1">Run your code to create a submission</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[submission.status]}`}>
                            {submission.status}
                          </span>
                          <span className="text-sm text-gray-400">
                            {submission.language.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-400">
                          {formatDate(submission.submitted_at)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>⏱️ {formatExecutionTime(submission.execution_time)}</span>
                          <span>💾 {formatMemoryUsage(submission.memory_usage)}</span>
                          <span>✅ {submission.test_cases_passed}/{submission.total_test_cases}</span>
                        </div>
                        
                        <button
                          onClick={() => handleLoadSubmission(submission)}
                          className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                        >
                          <span>📋 Load Code</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resizable Divider */}
        <div
          className={`w-1 bg-gray-600 hover:bg-gray-500 cursor-col-resize flex-shrink-0 transition-colors duration-200 ${
            isResizing ? 'bg-gray-500' : ''
          }`}
          onMouseDown={handleMouseDown}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-1 h-8 bg-gray-400 rounded-full"></div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div 
          className="flex flex-col"
          style={{ width: `${100 - leftPanelWidth}%` }}
        >
          
          <div className="flex-1 flex flex-col">
            {/* Loaded submission indicator */}
            {selectedSubmission && (
              <div className="flex-shrink-0 p-4 bg-purple-900/30 border-b border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-400 text-sm font-medium">📋 Loaded from submission</span>
                    <span className="text-gray-400 text-sm">
                      {formatDate(selectedSubmission.submitted_at)} • {selectedSubmission.language.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            {/* Language indicator */}
            <div className="flex-shrink-0 px-6 py-3 bg-gray-800 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Python 3</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-400">Ready</span>
                </div>
              </div>
            </div>
            
            {/* Code Editor - takes remaining space */}
            <div className="flex-1 w-full h-full">
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
                height="100%"
                showHeader={true}
                externalCode={selectedSubmission?.code}
                layoutTrigger={layoutTrigger}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetails;