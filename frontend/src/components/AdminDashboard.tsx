import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CreateProblemModal from './CreateProblemModal';
import EditProblemModal from './EditProblemModal';
import ProblemsManagementTab from './ProblemsManagementTab';
import SolutionsManagementTab from './SolutionsManagementTab';
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
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solutions] = useState<AdminSolution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'problems' | 'solutions' | 'analytics'>('problems');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
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

  const handleDeleteProblem = async (problemId: string) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5000/api/admin/problems/${problemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setProblems(problems.filter(p => p.id !== problemId));
      }
    } catch (error) {
      console.error('Failed to delete problem:', error);
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Enhanced header with tabs */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('problems')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'problems' ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          >
            Problems Management
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'solutions' ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          >
            Solutions Management
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'analytics' ? 'bg-purple-600' : 'bg-gray-700'
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
          onCreateProblem={() => setShowCreateModal(true)}
        />
      )}

      {activeTab === 'solutions' && (
        <SolutionsManagementTab
          solutions={solutions}
          onEditSolution={handleEditSolution}
          onSaveSolution={handleSaveSolution}
          onClearSolution={handleClearSolution}
        />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsTab problems={problems} solutions={solutions} />
      )}

      {/* Create Problem Modal */}
      {showCreateModal && (
        <CreateProblemModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchProblems();
          }}
        />
      )}

      {/* Edit Problem Modal */}
      {showEditModal && editingProblem && (
        <EditProblemModal
          problem={editingProblem}
          onClose={() => {
            setShowEditModal(false);
            setEditingProblem(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setEditingProblem(null);
            fetchProblems();
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
