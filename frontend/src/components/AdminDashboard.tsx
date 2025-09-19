import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProblems } from '../contexts/ProblemContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import AddProblemModal from './AddProblemModal';
import EditProblemModal from './EditProblemModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ProblemsManagementTab from './ProblemsManagementTab';
import SolutionManagementTab from './SolutionManagementTab.tsx';
import AnalyticsTab from './AnalyticsTab';

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

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addProblem, updateProblem, removeProblem } = useProblems();
  const { addNotification } = useNotifications();
  const { theme } = useTheme();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solutions] = useState<AdminSolution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'problems' | 'solutions' | 'analytics'>('problems');
  const [selectedProblemForSolutions, setSelectedProblemForSolutions] = useState<Problem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [deletingProblem, setDeletingProblem] = useState<Problem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  const fetchProblems = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const queryParams = new URLSearchParams();
      if (filterStatus !== 'all') queryParams.append('status', filterStatus);
      
      const response = await fetch(`http://localhost:5000/api/admin/problems?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProblems(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch problems:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus]);

  // Fetch problems on component mount and when filter changes
  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  // Enhanced problem management functions
  const handleEditProblem = (problem: Problem) => {
    setEditingProblem(problem);
    setShowEditModal(true);
  };

  const handleDeleteProblem = (problemId: string) => {
    const problem = problems.find(p => p.id === problemId);
    if (problem) {
      setDeletingProblem(problem);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProblem) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5000/api/admin/problems/${deletingProblem.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setProblems(problems.filter(p => p.id !== deletingProblem.id));
        
        // Update context for real-time sync
        removeProblem(deletingProblem.id);
        
        addNotification({
          type: 'success',
          title: 'Problem Deleted',
          message: `"${deletingProblem.title}" has been permanently deleted.`
        });
        
        setShowDeleteModal(false);
        setDeletingProblem(null);
      }
    } catch (error) {
      console.error('Failed to delete problem:', error);
      addNotification({
        type: 'error',
        title: 'Failed to Delete Problem',
        message: error instanceof Error ? error.message : 'An unexpected error occurred.'
      });
    }
  };

  const handleUpdateProblemStatus = async (problemId: string, status: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5000/api/admin/problems/${problemId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchProblems(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to update problem status:', error);
    }
  };

  // Create new problem
  const handleCreateProblem = () => {
    setShowCreateModal(true);
  };

  // Save new problem
  const handleSaveProblem = async (problemData: any) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5000/api/admin/problems', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(problemData)
      });

      if (response.ok) {
        const data = await response.json();
        const newProblem = data.data;
        setProblems(prev => [newProblem, ...prev]);
        
        // Update context for real-time sync
        if (newProblem.status === 'published') {
          addProblem(newProblem);
          addNotification({
            type: 'success',
            title: 'Problem Published',
            message: `"${newProblem.title}" has been published and is now visible on the home page.`
          });
        } else {
          addNotification({
            type: 'success',
            title: 'Problem Created',
            message: `"${newProblem.title}" has been saved as a draft.`
          });
        }
        
        setShowCreateModal(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create problem');
      }
    } catch (error) {
      console.error('Failed to create problem:', error);
      addNotification({
        type: 'error',
        title: 'Failed to Create Problem',
        message: error instanceof Error ? error.message : 'An unexpected error occurred.'
      });
      throw error;
    }
  };

  // Save edited problem
  const handleSaveEditedProblem = async (problemData: any) => {
    if (!editingProblem) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5000/api/admin/problems/${editingProblem.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(problemData)
      });

      if (response.ok) {
        const data = await response.json();
        const updatedProblem = data.data;
        setProblems(prev => prev.map(p => p.id === editingProblem.id ? updatedProblem : p));
        
        // Update context for real-time sync
        if (updatedProblem.status === 'published') {
          updateProblem(updatedProblem);
        } else {
          // Remove from context if status changed from published
          const originalProblem = problems.find(p => p.id === editingProblem.id);
          if (originalProblem?.status === 'published') {
            removeProblem(updatedProblem.id);
          }
        }
        
        addNotification({
          type: 'success',
          title: 'Problem Updated',
          message: `"${updatedProblem.title}" has been updated successfully.`
        });
        
        setShowEditModal(false);
        setEditingProblem(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update problem');
      }
    } catch (error) {
      console.error('Failed to update problem:', error);
      addNotification({
        type: 'error',
        title: 'Failed to Update Problem',
        message: error instanceof Error ? error.message : 'An unexpected error occurred.'
      });
      throw error;
    }
  };

  // Solution management functions
  const handleEditSolution = (solution: AdminSolution) => {
    // This will be handled by the SolutionsManagementTab component
    console.log('Edit solution:', solution);
  };

  const handleSaveSolution = async (solution: AdminSolution) => {
    // This will be handled by the SolutionsManagementTab component
    console.log('Save solution:', solution);
  };

  const handleClearSolution = (solutionId: string) => {
    // This will be handled by the SolutionsManagementTab component
    console.log('Clear solution:', solutionId);
  };


  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className={`transition-colors duration-200 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Enhanced header with tabs */}
      <div className={`border-b p-6 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('problems')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              activeTab === 'problems' 
                ? 'bg-purple-600 text-white' 
                : theme === 'dark' 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Problems Management
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              activeTab === 'solutions' 
                ? 'bg-purple-600 text-white' 
                : theme === 'dark' 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Solutions Management
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              activeTab === 'analytics' 
                ? 'bg-purple-600 text-white' 
                : theme === 'dark' 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'problems' && (
        <ProblemsManagementTab
          problems={problems}
          onEditProblem={handleEditProblem}
          onDeleteProblem={handleDeleteProblem}
          onUpdateStatus={handleUpdateProblemStatus}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          onCreateProblem={handleCreateProblem}
        />
      )}

      {activeTab === 'solutions' && (
        <div className="p-6">
          {!selectedProblemForSolutions ? (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Select a Problem to Manage Solutions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {problems.map((problem) => (
                  <div
                    key={problem.id}
                    onClick={() => setSelectedProblemForSolutions(problem)}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">{problem.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{problem.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        problem.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {problem.difficulty}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        problem.status === 'published' ? 'bg-green-100 text-green-800' :
                        problem.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {problem.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setSelectedProblemForSolutions(null)}
                  className="mr-4 text-purple-400 hover:text-purple-300"
                >
                  ← Back to Problem Selection
                </button>
                <h2 className="text-2xl font-bold text-white">
                  Solutions for "{selectedProblemForSolutions.title}"
                </h2>
              </div>
              <SolutionManagementTab
                problemId={selectedProblemForSolutions.id}
                problemTitle={selectedProblemForSolutions.title}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <AnalyticsTab problems={problems} solutions={solutions} />
      )}

      {/* Add Problem Modal */}
      {showCreateModal && (
        <AddProblemModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveProblem}
        />
      )}

      {/* Edit Problem Modal */}
      {showEditModal && editingProblem && (
        <EditProblemModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingProblem(null);
          }}
          onSave={handleSaveEditedProblem}
          problem={editingProblem}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingProblem && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingProblem(null);
          }}
          onConfirm={handleConfirmDelete}
          problem={deletingProblem}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
