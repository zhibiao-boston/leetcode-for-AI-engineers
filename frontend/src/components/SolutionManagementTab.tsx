import React, { useState, useEffect } from 'react';
import { AdminSolution } from '../contexts/ProblemContext';
import SolutionEditorModal from './SolutionEditorModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

// Local interface to handle the type conversion
interface LocalAdminSolution extends Omit<AdminSolution, 'created_at' | 'updated_at'> {
  created_at: Date;
  updated_at: Date;
}

interface SolutionManagementTabProps {
  problemId: string;
  problemTitle: string;
}

const SolutionManagementTab: React.FC<SolutionManagementTabProps> = ({
  problemId,
  problemTitle
}) => {
  const [solutions, setSolutions] = useState<LocalAdminSolution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSolutionEditorModal, setShowSolutionEditorModal] = useState(false);
  const [editingSolution, setEditingSolution] = useState<LocalAdminSolution | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingSolution, setDeletingSolution] = useState<LocalAdminSolution | null>(null);

  const fetchSolutions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5000/api/admin/problems/${problemId}/solutions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const solutionsWithDates = (data.data || []).map((solution: AdminSolution) => ({
          ...solution,
          created_at: new Date(solution.created_at),
          updated_at: new Date(solution.updated_at)
        }));
        setSolutions(solutionsWithDates);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch solutions');
      }
    } catch (err) {
      setError('Failed to fetch solutions');
      console.error('Error fetching solutions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (problemId) {
      fetchSolutions();
    }
  }, [problemId]);

  const handleAddSolution = () => {
    setEditingSolution(null);
    setShowSolutionEditorModal(true);
  };

  const handleEditSolution = (solution: LocalAdminSolution) => {
    setEditingSolution(solution);
    setShowSolutionEditorModal(true);
  };

  const handleDeleteSolution = (solution: LocalAdminSolution) => {
    setDeletingSolution(solution);
    setShowDeleteModal(true);
  };

  const handleSaveSolution = async (solutionData: any) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5000/api/admin/problems/${problemId}/solutions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(solutionData)
      });

      if (response.ok) {
        const data = await response.json();
        const solutionWithDates = {
          ...data.data,
          created_at: new Date(data.data.created_at),
          updated_at: new Date(data.data.updated_at)
        };
        setSolutions(prev => [solutionWithDates, ...prev]);
        setShowSolutionEditorModal(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create solution');
      }
    } catch (error) {
      console.error('Failed to create solution:', error);
      throw error;
    }
  };

  const handleSaveEditedSolution = async (solutionData: any) => {
    if (!editingSolution) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5000/api/admin/problems/${problemId}/solutions/${editingSolution.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(solutionData)
      });

      if (response.ok) {
        const data = await response.json();
        const solutionWithDates = {
          ...data.data,
          created_at: new Date(data.data.created_at),
          updated_at: new Date(data.data.updated_at)
        };
        setSolutions(prev => prev.map(s => s.id === editingSolution.id ? solutionWithDates : s));
        setShowSolutionEditorModal(false);
        setEditingSolution(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update solution');
      }
    } catch (error) {
      console.error('Failed to update solution:', error);
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingSolution) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5000/api/admin/problems/${problemId}/solutions/${deletingSolution.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setSolutions(prev => prev.filter(s => s.id !== deletingSolution.id));
        setShowDeleteModal(false);
        setDeletingSolution(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete solution');
      }
    } catch (error) {
      console.error('Failed to delete solution:', error);
      throw error;
    }
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      python: 'bg-green-100 text-green-800',
      javascript: 'bg-yellow-100 text-yellow-800',
      java: 'bg-red-100 text-red-800',
      cpp: 'bg-blue-100 text-blue-800',
      c: 'bg-gray-100 text-gray-800',
      csharp: 'bg-purple-100 text-purple-800',
      go: 'bg-cyan-100 text-cyan-800',
      rust: 'bg-orange-100 text-orange-800'
    };
    return colors[language.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const truncateCode = (code: string, maxLength: number = 100) => {
    if (code.length <= maxLength) return code;
    return code.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading solutions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-400 mb-2">{error}</div>
        <button 
          onClick={fetchSolutions}
          className="text-purple-400 hover:text-purple-300"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Solutions for "{problemTitle}"
          </h2>
          <p className="text-gray-400">
            Manage solutions for this problem. Published solutions will be visible to users.
          </p>
        </div>
        <button
          onClick={handleAddSolution}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Add New Solution
        </button>
      </div>

      {solutions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">No solutions found</div>
          <p className="text-gray-500 mb-6">Create the first solution for this problem</p>
          <button
            onClick={handleAddSolution}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Add Solution
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {solutions.map((solution) => (
            <div key={solution.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {solution.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLanguageColor(solution.language)}`}>
                      {solution.language.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      solution.is_published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {solution.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  
                  {solution.description && (
                    <p className="text-gray-300 mb-3">{solution.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                    {solution.time_complexity && (
                      <span>Time: {solution.time_complexity}</span>
                    )}
                    {solution.space_complexity && (
                      <span>Space: {solution.space_complexity}</span>
                    )}
                    <span>Updated: {new Date(solution.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditSolution(solution)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSolution(solution)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded p-4">
                <div className="text-sm text-gray-400 mb-2">Code Preview:</div>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                  {truncateCode(solution.code)}
                </pre>
              </div>
              
              {solution.explanation && (
                <div className="mt-4">
                  <div className="text-sm text-gray-400 mb-2">Explanation:</div>
                  <p className="text-gray-300 text-sm">{solution.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Solution Editor Modal */}
      {showSolutionEditorModal && (
        <SolutionEditorModal
          isOpen={showSolutionEditorModal}
          onClose={() => {
            setShowSolutionEditorModal(false);
            setEditingSolution(null);
          }}
          onSave={editingSolution ? handleSaveEditedSolution : handleSaveSolution}
          solution={editingSolution}
          problemId={problemId}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingSolution && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingSolution(null);
          }}
          onConfirm={handleConfirmDelete}
          problem={{
            id: deletingSolution.id,
            title: deletingSolution.title,
            description: deletingSolution.description || '',
            difficulty: 'medium',
            company: '',
            categories: [],
            tags: [],
            status: 'published'
          }}
        />
      )}
    </div>
  );
};

export default SolutionManagementTab;
