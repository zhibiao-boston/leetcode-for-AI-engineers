import React from 'react';

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
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Difficulty</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Company</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Categories</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Solutions</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.map((problem) => (
              <tr key={problem.id} className="border-b border-gray-700 hover:bg-gray-750">
                <td className="px-4 py-3 text-sm text-gray-400">{problem.id.slice(-8)}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{problem.title}</div>
                  <div className="text-sm text-gray-400 truncate max-w-xs">
                    {problem.description.substring(0, 100)}...
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{problem.company || 'N/A'}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {problem.categories.slice(0, 2).map((category) => (
                      <span key={category} className="px-2 py-1 bg-gray-600 rounded text-xs text-gray-300">
                        {category}
                      </span>
                    ))}
                    {problem.categories.length > 2 && (
                      <span className="px-2 py-1 bg-gray-600 rounded text-xs text-gray-300">
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
                <td className="px-4 py-3 text-sm text-gray-300">
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
            <p className="text-gray-400">No problems found matching your criteria.</p>
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
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{problems.length}</div>
          <div className="text-sm text-gray-400">Total Problems</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">
            {problems.filter(p => p.status === 'published').length}
          </div>
          <div className="text-sm text-gray-400">Published</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">
            {problems.filter(p => p.status === 'draft').length}
          </div>
          <div className="text-sm text-gray-400">Draft</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-400">
            {problems.filter(p => p.status === 'archived').length}
          </div>
          <div className="text-sm text-gray-400">Archived</div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsManagementTab;
