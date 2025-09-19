import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  company: string;
  categories: string[];
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  solution_count?: number;
}

interface ProblemsManagementTabProps {
  problems: Problem[];
  onEditProblem: (problem: Problem) => void;
  onDeleteProblem: (problemId: string) => void;
  onUpdateStatus: (problemId: string, status: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: 'all' | 'published' | 'draft' | 'archived';
  setFilterStatus: (status: 'all' | 'published' | 'draft' | 'archived') => void;
  onCreateProblem: () => void;
}

const ProblemsManagementTab: React.FC<ProblemsManagementTabProps> = ({
  problems,
  onEditProblem,
  onDeleteProblem,
  onUpdateStatus,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  onCreateProblem
}) => {
  const { theme } = useTheme();
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || problem.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-600 text-white';
      case 'draft': return 'bg-yellow-600 text-white';
      case 'archived': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="p-6">
      {/* Search and filter controls */}
      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="Search problems..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200 ${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200 ${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <button 
          onClick={onCreateProblem}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors duration-200"
        >
          Add New Problem
        </button>
      </div>

      {/* Problems table */}
      <div className={`rounded-lg overflow-hidden transition-colors duration-200 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
      }`}>
        <table className="w-full">
          <thead className={`transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <tr>
              <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>ID</th>
              <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Title</th>
              <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Difficulty</th>
              <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Company</th>
              <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Categories</th>
              <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Status</th>
              <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Solutions</th>
              <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.map((problem) => (
              <tr key={problem.id} className={`border-b transition-colors duration-200 hover:bg-opacity-50 ${
                theme === 'dark' 
                  ? 'border-gray-700 hover:bg-gray-750' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <td className={`px-4 py-3 text-sm transition-colors duration-200 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>{problem.id.slice(-8)}</td>
                <td className="px-4 py-3">
                  <div className={`font-medium transition-colors duration-200 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{problem.title}</div>
                  <div className={`text-sm truncate max-w-xs transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {problem.description.substring(0, 100)}...
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                  </span>
                </td>
                <td className={`px-4 py-3 text-sm transition-colors duration-200 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>{problem.company || 'N/A'}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {problem.categories.slice(0, 2).map((category) => (
                      <span key={category} className={`px-2 py-1 rounded text-xs transition-colors duration-200 ${
                        theme === 'dark' 
                          ? 'bg-gray-600 text-gray-300' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {category}
                      </span>
                    ))}
                    {problem.categories.length > 2 && (
                      <span className={`px-2 py-1 rounded text-xs transition-colors duration-200 ${
                        theme === 'dark' 
                          ? 'bg-gray-600 text-gray-300' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        +{problem.categories.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={problem.status}
                    onChange={(e) => onUpdateStatus(problem.id, e.target.value)}
                    className={`px-2 py-1 rounded text-sm border-0 ${getStatusColor(problem.status)} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </td>
                <td className={`px-4 py-3 text-sm transition-colors duration-200 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {problem.solution_count || 0}
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditProblem(problem)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteProblem(problem.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredProblems.length === 0 && (
          <div className="text-center py-8">
            <p className={`transition-colors duration-200 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>No problems found matching your criteria.</p>
            <button 
              onClick={onCreateProblem}
              className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors duration-200"
            >
              Create First Problem
            </button>
          </div>
        )}
      </div>

      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className={`rounded-lg p-4 transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <div className={`text-2xl font-bold transition-colors duration-200 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{problems.length}</div>
          <div className={`text-sm transition-colors duration-200 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>Total Problems</div>
        </div>
        <div className={`rounded-lg p-4 transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <div className="text-2xl font-bold text-green-400">
            {problems.filter(p => p.status === 'published').length}
          </div>
          <div className={`text-sm transition-colors duration-200 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>Published</div>
        </div>
        <div className={`rounded-lg p-4 transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <div className="text-2xl font-bold text-yellow-400">
            {problems.filter(p => p.status === 'draft').length}
          </div>
          <div className={`text-sm transition-colors duration-200 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>Draft</div>
        </div>
        <div className={`rounded-lg p-4 transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <div className="text-2xl font-bold text-gray-400">
            {problems.filter(p => p.status === 'archived').length}
          </div>
          <div className={`text-sm transition-colors duration-200 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>Archived</div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsManagementTab;
