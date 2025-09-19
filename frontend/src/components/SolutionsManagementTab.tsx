import React, { useState, useEffect } from 'react';

interface AdminSolution {
  id: string;
  problem_id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  complexity?: string;
  explanation?: string;
  time_complexity?: string;
  space_complexity?: string;
  created_by?: string;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

interface Problem {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
}

interface SolutionsManagementTabProps {
  solutions: AdminSolution[];
  onEditSolution: (solution: AdminSolution) => void;
  onSaveSolution: (solution: AdminSolution) => void;
  onClearSolution: (solutionId: string) => void;
}

const SolutionsManagementTab: React.FC<SolutionsManagementTabProps> = ({
  solutions,
  onEditSolution,
  onSaveSolution,
  onClearSolution
}) => {
  const [allSolutions, setAllSolutions] = useState<AdminSolution[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllSolutions();
    fetchProblems();
  }, []);

  const fetchAllSolutions = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      // This would be a new endpoint to get all solutions across all problems
      const response = await fetch('http://localhost:5000/api/admin/solutions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAllSolutions(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch solutions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProblems = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5000/api/admin/problems', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProblems(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch problems:', error);
    }
  };

  const filteredSolutions = allSolutions.filter(solution => {
    const matchesSearch = solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.language.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProblem = selectedProblem === 'all' || solution.problem_id === selectedProblem;
    return matchesSearch && matchesProblem;
  });

  const getLanguageColor = (language: string) => {
    switch (language.toLowerCase()) {
      case 'python': return 'text-green-400';
      case 'javascript': return 'text-yellow-400';
      case 'java': return 'text-red-400';
      case 'cpp': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getProblemTitle = (problemId: string) => {
    const problem = problems.find(p => p.id === problemId);
    return problem ? problem.title : 'Unknown Problem';
  };

  const handleDeleteSolution = async (solutionId: string) => {
    if (!window.confirm('Are you sure you want to delete this solution?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5000/api/admin/solutions/${solutionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setAllSolutions(allSolutions.filter(s => s.id !== solutionId));
      }
    } catch (error) {
      console.error('Failed to delete solution:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="text-gray-400">Loading solutions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header and controls */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Solutions Management</h2>
        
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search solutions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={selectedProblem}
            onChange={(e) => setSelectedProblem(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Problems</option>
            {problems.map(problem => (
              <option key={problem.id} value={problem.id}>
                {problem.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Solutions grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSolutions.map((solution) => (
          <div key={solution.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{solution.title}</h3>
                <p className="text-sm text-gray-400">{getProblemTitle(solution.problem_id)}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditSolution(solution)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSolution(solution.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>

            {solution.description && (
              <p className="text-gray-300 text-sm mb-4">{solution.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-gray-400 text-sm">Language:</span>
                <span className={`ml-2 text-sm font-medium ${getLanguageColor(solution.language)}`}>
                  {solution.language}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Complexity:</span>
                <span className="ml-2 text-sm text-gray-300">
                  {solution.complexity || solution.time_complexity || 'N/A'}
                </span>
              </div>
            </div>

            {solution.explanation && (
              <div className="mb-4">
                <span className="text-gray-400 text-sm">Explanation:</span>
                <p className="text-gray-300 text-sm mt-1">{solution.explanation}</p>
              </div>
            )}

            <div className="bg-gray-900 rounded p-3 mb-4">
              <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
                {solution.code.substring(0, 200)}
                {solution.code.length > 200 && '...'}
              </pre>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>Created: {new Date(solution.created_at).toLocaleDateString()}</span>
              <span>By: {solution.created_by_name || 'Unknown'}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredSolutions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No solutions found matching your criteria.</p>
        </div>
      )}

      {/* Summary stats */}
      <div className="mt-8 grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{allSolutions.length}</div>
          <div className="text-sm text-gray-400">Total Solutions</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">
            {allSolutions.filter(s => s.language === 'python').length}
          </div>
          <div className="text-sm text-gray-400">Python</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">
            {allSolutions.filter(s => s.language === 'javascript').length}
          </div>
          <div className="text-sm text-gray-400">JavaScript</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">
            {problems.length}
          </div>
          <div className="text-sm text-gray-400">Problems</div>
        </div>
      </div>
    </div>
  );
};

export default SolutionsManagementTab;
