import React, { useState, useEffect } from 'react';

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
  solutions?: AdminSolution[];
}

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

interface EnhancedEditProblemModalProps {
  problem: Problem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (problemData: any) => void;
}

const EnhancedEditProblemModal: React.FC<EnhancedEditProblemModalProps> = ({
  problem,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    title: problem?.title || '',
    description: problem?.description || '',
    difficulty: problem?.difficulty || 'medium',
    company: problem?.company || '',
    categories: problem?.categories || [],
    tags: problem?.tags || [],
    status: problem?.status || 'draft'
  });
  const [solutions, setSolutions] = useState<AdminSolution[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (problem) {
      setFormData({
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        company: problem.company,
        categories: problem.categories,
        tags: problem.tags,
        status: problem.status
      });
      fetchSolutions();
    }
  }, [problem]);

  const fetchSolutions = async () => {
    if (!problem?.id) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5000/api/admin/problems/${problem.id}/solutions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSolutions(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch solutions:', error);
    }
  };

  const handleAddCategory = () => {
    if (newCategory && !formData.categories.includes(newCategory)) {
      setFormData({
        ...formData,
        categories: [...formData.categories, newCategory]
      });
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(c => c !== category)
    });
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleSaveProblem = async () => {
    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save problem:', error);
    } finally {
      setIsLoading(false);
    }
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
        setSolutions(solutions.filter(s => s.id !== solutionId));
      }
    } catch (error) {
      console.error('Failed to delete solution:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Problem: {problem?.title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column - Problem details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Categories</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Add category"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors duration-200"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.categories.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-gray-600 rounded-full text-sm flex items-center space-x-2"
                  >
                    <span>{category}</span>
                    <button
                      onClick={() => handleRemoveCategory(category)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors duration-200"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-600 rounded-full text-sm flex items-center space-x-2"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Description and solutions */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={12}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter problem description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Solutions ({solutions.length})</label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {solutions.map((solution) => (
                  <div key={solution.id} className="p-3 bg-gray-700 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-white">{solution.title}</span>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-gray-600 rounded text-xs text-gray-300">
                          {solution.language}
                        </span>
                        <button 
                          onClick={() => handleDeleteSolution(solution.id)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {solution.description && (
                      <p className="text-sm text-gray-400 mb-2">{solution.description}</p>
                    )}
                    <div className="bg-gray-900 rounded p-2">
                      <pre className="text-green-400 text-xs overflow-x-auto">
                        {solution.code.substring(0, 100)}...
                      </pre>
                    </div>
                  </div>
                ))}
                {solutions.length === 0 && (
                  <div className="text-center py-4 text-gray-400">
                    No solutions added yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveProblem}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedEditProblemModal;
