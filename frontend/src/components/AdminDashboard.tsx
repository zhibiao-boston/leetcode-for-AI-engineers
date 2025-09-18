import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CreateProblemModal from './CreateProblemModal';
import EditProblemModal from './EditProblemModal';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  company: string;
  categories: string[];
  tags: string[];
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

interface AdminSolution {
  id: string;
  problem_id: string;
  code: string;
  explanation: string;
  time_complexity: string;
  space_complexity: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [adminSolutions, setAdminSolutions] = useState<AdminSolution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'problems' | 'solutions'>('problems');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);

  // Fetch problems on component mount
  useEffect(() => {
    fetchProblems();
  }, []);

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
        setProblems(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch problems:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminSolutions = async (problemId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5000/api/admin/problems/${problemId}/solutions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAdminSolutions(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch solutions:', error);
    }
  };

  const handleProblemSelect = (problem: Problem) => {
    setSelectedProblem(problem);
    fetchAdminSolutions(problem.id);
    setActiveTab('solutions');
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
        if (selectedProblem?.id === problemId) {
          setSelectedProblem(null);
          setAdminSolutions([]);
        }
      }
    } catch (error) {
      console.error('Failed to delete problem:', error);
    }
  };

  const handleToggleStatus = async (problemId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5000/api/admin/problems/${problemId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchProblems(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              Add New Problem
            </button>
            <button
              onClick={() => setActiveTab('problems')}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                activeTab === 'problems'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Problems ({problems.length})
            </button>
            {selectedProblem && (
              <button
                onClick={() => setActiveTab('solutions')}
                className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                  activeTab === 'solutions'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Solutions ({adminSolutions.length})
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Problems List */}
        <div className="w-1/3 bg-gray-800 border-r border-gray-700 min-h-screen">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-white mb-4">All Problems</h2>
            <div className="space-y-2">
              {problems.map((problem) => (
                <div
                  key={problem.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors duration-200 ${
                    selectedProblem?.id === problem.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => handleProblemSelect(problem)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{problem.title}</h3>
                      <p className="text-xs opacity-75 mt-1">
                        {problem.difficulty} • {problem.company}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            problem.status === 'published'
                              ? 'bg-green-600 text-white'
                              : 'bg-yellow-600 text-white'
                          }`}
                        >
                          {problem.status}
                        </span>
                        <span className="text-xs opacity-75">
                          {problem.categories.join(', ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProblem(problem);
                          setShowEditModal(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(problem.id, problem.status);
                        }}
                        className="text-green-400 hover:text-green-300 text-xs"
                      >
                        {problem.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProblem(problem.id);
                        }}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'problems' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Problem Management</h2>
              <p className="text-gray-400">
                Select a problem from the left to view details and manage solutions.
              </p>
            </div>
          )}

          {activeTab === 'solutions' && selectedProblem && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Solutions for: {selectedProblem.title}
                </h2>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
                  Add Solution
                </button>
              </div>
              
              <div className="space-y-4">
                {adminSolutions.map((solution) => (
                  <div key={solution.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-medium">Solution #{solution.id.slice(-8)}</h3>
                      <div className="flex space-x-2">
                        <button className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                        <button className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-gray-400 text-sm">Time Complexity:</span>
                        <span className="text-white ml-2">{solution.time_complexity || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Space Complexity:</span>
                        <span className="text-white ml-2">{solution.space_complexity || 'N/A'}</span>
                      </div>
                    </div>
                    {solution.explanation && (
                      <div className="mb-3">
                        <span className="text-gray-400 text-sm">Explanation:</span>
                        <p className="text-white text-sm mt-1">{solution.explanation}</p>
                      </div>
                    )}
                    <div className="bg-gray-900 rounded p-3">
                      <pre className="text-green-400 text-sm overflow-x-auto">
                        {solution.code}
                      </pre>
                    </div>
                  </div>
                ))}
                
                {adminSolutions.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No solutions added yet.</p>
                    <button className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
                      Add First Solution
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

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
