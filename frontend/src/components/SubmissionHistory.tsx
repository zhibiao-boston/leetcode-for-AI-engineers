import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Submission {
  id: string;
  problem_id: string;
  problem_title: string;
  problem_difficulty: string;
  code: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compile Error' | 'Memory Limit Exceeded' | 'Output Limit Exceeded' | 'Presentation Error';
  execution_time?: number;
  memory_usage?: number;
  test_cases_passed: number;
  total_test_cases: number;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

interface SubmissionStats {
  total_submissions: number;
  accepted_submissions: number;
  success_rate: number;
  problems_solved: number;
  language_distribution: Record<string, number>;
  recent_submissions: Submission[];
}

const SubmissionHistory: React.FC = () => {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<SubmissionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    language: '',
    limit: 20,
    offset: 0
  });

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

  const difficultyColors = {
    'easy': 'text-green-600 bg-green-100',
    'medium': 'text-yellow-600 bg-yellow-100',
    'hard': 'text-red-600 bg-red-100'
  };

  const languageColors = {
    'python': 'text-blue-600 bg-blue-100',
    'javascript': 'text-yellow-600 bg-yellow-100',
    'java': 'text-red-600 bg-red-100',
    'cpp': 'text-purple-600 bg-purple-100',
    'c': 'text-gray-600 bg-gray-100',
    'go': 'text-cyan-600 bg-cyan-100',
    'rust': 'text-orange-600 bg-orange-100',
    'typescript': 'text-blue-600 bg-blue-100'
  };

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.language) queryParams.append('language', filters.language);
      queryParams.append('limit', filters.limit.toString());
      queryParams.append('offset', filters.offset.toString());

      const response = await fetch(`http://localhost:5000/api/submissions/my-submissions?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }

      const data = await response.json();
      setSubmissions(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters, token]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/submissions/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchSubmissions();
    fetchStats();
  }, [fetchSubmissions, fetchStats]);

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

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      offset: 0 // Reset offset when filters change
    }));
  };

  const handleLoadMore = () => {
    setFilters(prev => ({
      ...prev,
      offset: prev.offset + prev.limit
    }));
  };

  const handleSubmissionClick = (submission: Submission) => {
    setSelectedSubmission(submission);
  };

  const closeModal = () => {
    setSelectedSubmission(null);
  };

  if (loading && submissions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
        <button 
          onClick={() => {
            setError(null);
            fetchSubmissions();
          }}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      {stats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Submission Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.total_submissions}</div>
              <div className="text-sm text-gray-600">Total Submissions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.accepted_submissions}</div>
              <div className="text-sm text-gray-600">Accepted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.success_rate}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.problems_solved}</div>
              <div className="text-sm text-gray-600">Problems Solved</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="Accepted">Accepted</option>
            <option value="Wrong Answer">Wrong Answer</option>
            <option value="Time Limit Exceeded">Time Limit Exceeded</option>
            <option value="Runtime Error">Runtime Error</option>
            <option value="Compile Error">Compile Error</option>
            <option value="Memory Limit Exceeded">Memory Limit Exceeded</option>
            <option value="Output Limit Exceeded">Output Limit Exceeded</option>
            <option value="Presentation Error">Presentation Error</option>
          </select>

          <select
            value={filters.language}
            onChange={(e) => handleFilterChange('language', e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Languages</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="typescript">TypeScript</option>
          </select>
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Submission History</h2>
        </div>
        
        {submissions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No submissions found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {submissions.map((submission) => (
              <div 
                key={submission.id} 
                className="p-6 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSubmissionClick(submission)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {submission.problem_title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyColors[submission.problem_difficulty as keyof typeof difficultyColors]}`}>
                        {submission.problem_difficulty}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${languageColors[submission.language as keyof typeof languageColors]}`}>
                        {submission.language}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Submitted: {formatDate(submission.submitted_at)}</span>
                      <span>Time: {formatExecutionTime(submission.execution_time)}</span>
                      <span>Memory: {formatMemoryUsage(submission.memory_usage)}</span>
                      <span>Tests: {submission.test_cases_passed}/{submission.total_test_cases}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[submission.status]}`}>
                      {submission.status}
                    </span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {submissions.length > 0 && submissions.length % filters.limit === 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedSubmission.problem_title} - {selectedSubmission.language}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="mb-4 flex items-center space-x-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[selectedSubmission.status]}`}>
                  {selectedSubmission.status}
                </span>
                <span className="text-sm text-gray-600">
                  Submitted: {formatDate(selectedSubmission.submitted_at)}
                </span>
                <span className="text-sm text-gray-600">
                  Time: {formatExecutionTime(selectedSubmission.execution_time)}
                </span>
                <span className="text-sm text-gray-600">
                  Memory: {formatMemoryUsage(selectedSubmission.memory_usage)}
                </span>
                <span className="text-sm text-gray-600">
                  Tests: {selectedSubmission.test_cases_passed}/{selectedSubmission.total_test_cases}
                </span>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
                  <code className="language-python">{selectedSubmission.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;
