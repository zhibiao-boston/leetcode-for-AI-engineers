import React, { useState } from 'react';

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

interface SolutionEditorModalProps {
  solution: AdminSolution | null;
  problemId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (solution: AdminSolution) => void;
  onClear?: (solutionId: string) => void;
  onDelete?: (solutionId: string) => void;
}

const SolutionEditorModal: React.FC<SolutionEditorModalProps> = ({
  solution,
  problemId,
  isOpen,
  onClose,
  onSave,
  onClear,
  onDelete
}) => {
  const [formData, setFormData] = useState({
    title: solution?.title || '',
    description: solution?.description || '',
    code: solution?.code || '',
    language: solution?.language || 'python',
    complexity: solution?.complexity || '',
    explanation: solution?.explanation || '',
    time_complexity: solution?.time_complexity || '',
    space_complexity: solution?.space_complexity || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSolution = async () => {
    setIsLoading(true);
    try {
      const solutionData: AdminSolution = {
        ...formData,
        id: solution?.id || '',
        problem_id: problemId || solution?.problem_id || '',
        created_by: solution?.created_by || '',
        created_by_name: solution?.created_by_name || '',
        created_at: solution?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await onSave(solutionData);
      onClose();
    } catch (error) {
      console.error('Failed to save solution:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCode = () => {
    setFormData({ ...formData, code: '' });
  };

  const handleDeleteSolution = async () => {
    if (!solution?.id || !onDelete) return;
    
    if (window.confirm('Are you sure you want to delete this solution?')) {
      await onDelete(solution.id);
      onClose();
    }
  };

  const handleClearSolution = () => {
    if (!solution?.id || !onClear) return;
    
    if (window.confirm('Are you sure you want to clear this solution?')) {
      onClear(solution.id);
      setFormData({
        ...formData,
        code: '',
        explanation: '',
        complexity: '',
        time_complexity: '',
        space_complexity: ''
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {solution ? `Edit Solution: ${solution.title}` : 'Create New Solution'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column - Solution metadata */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Solution title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Complexity</label>
              <input
                type="text"
                value={formData.complexity}
                onChange={(e) => setFormData({ ...formData, complexity: e.target.value })}
                placeholder="e.g., O(n), O(n log n)"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Time Complexity</label>
              <input
                type="text"
                value={formData.time_complexity}
                onChange={(e) => setFormData({ ...formData, time_complexity: e.target.value })}
                placeholder="e.g., O(n)"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Space Complexity</label>
              <input
                type="text"
                value={formData.space_complexity}
                onChange={(e) => setFormData({ ...formData, space_complexity: e.target.value })}
                placeholder="e.g., O(1)"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Brief description of the solution approach..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Explanation</label>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Detailed explanation of the solution..."
              />
            </div>
          </div>

          {/* Right column - Code editor */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Code</label>
              <textarea
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                rows={20}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your solution code here..."
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleClearCode}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors duration-200"
              >
                Clear Code
              </button>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors duration-200">
                Preview
              </button>
            </div>

            {/* Code statistics */}
            <div className="bg-gray-700 rounded p-3">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Code Statistics</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                <div>Lines: {formData.code.split('\n').length}</div>
                <div>Characters: {formData.code.length}</div>
                <div>Words: {formData.code.split(/\s+/).filter(w => w.length > 0).length}</div>
                <div>Language: {formData.language}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between mt-6 pt-6 border-t border-gray-700">
          <div className="flex space-x-2">
            {solution && onClear && (
              <button
                onClick={handleClearSolution}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md transition-colors duration-200"
              >
                Clear Solution
              </button>
            )}
            {solution && onDelete && (
              <button
                onClick={handleDeleteSolution}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
              >
                Delete Solution
              </button>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSolution}
              disabled={isLoading || !formData.title || !formData.code}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Solution'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionEditorModal;
