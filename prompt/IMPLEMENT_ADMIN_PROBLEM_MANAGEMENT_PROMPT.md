# Implement Admin Problem Management Prompt

## 🎯 **Objective**
Implement comprehensive admin functionality for managing problems, descriptions, and solutions in the LeetCode for AI Engineers application. When logged in as admin (`ai_coding@gmail.com`), users should be able to:

1. **Add new problems** with full details (title, description, difficulty, company, categories, tags)
2. **Edit existing problems** (modify any field including description)
3. **Delete problems** (with confirmation)
4. **Manage problem solutions** (add/edit/delete official solutions)
5. **Publish/unpublish problems** (change status between draft and published)
6. **View admin dashboard** with problem management interface

## 🔍 **Current State Analysis**

### **✅ Existing Infrastructure**
- **Admin Authentication**: ✅ Working (`ai_coding@gmail.com` / `123456`)
- **Role-Based Access**: ✅ `requireAdmin` middleware exists
- **Database Schema**: ✅ Complete tables for problems, admin_solutions
- **Models**: ✅ Problem and Solution models implemented
- **Basic API**: ✅ GET endpoints for problems exist

### **❌ Missing Components**
- **Admin Problem CRUD API**: No POST/PUT/DELETE endpoints for problems
- **Admin Solution Management**: No endpoints for managing official solutions
- **Frontend Admin Interface**: No admin panel or management UI
- **Admin Dashboard**: No admin-specific views or components

## 🛠️ **Required Implementation**

### **Phase 1: Backend API Implementation**

#### **1.1 Create Problem Management Controller**

**File**: `backend/src/controllers/problem.controller.ts`

```typescript
import { Request, Response } from 'express';
import { ProblemModel } from '../models/Problem';
import { AdminSolutionModel } from '../models/AdminSolution';
import { body, param, validationResult } from 'express-validator';

export class ProblemController {
  // Get all problems (admin can see draft and published)
  static async getAllProblems(req: Request, res: Response): Promise<void> {
    try {
      const { status, difficulty, company } = req.query;
      const filters: any = {};
      
      if (status) filters.status = status;
      if (difficulty) filters.difficulty = difficulty;
      if (company) filters.company = company;
      
      const problems = await ProblemModel.findAll(filters);
      res.json({
        message: 'Problems retrieved successfully',
        data: problems
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve problems' });
    }
  }

  // Get single problem with admin solutions
  static async getProblemById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const problem = await ProblemModel.findById(id);
      
      if (!problem) {
        res.status(404).json({ error: 'Problem not found' });
        return;
      }
      
      // Get admin solutions for this problem
      const adminSolutions = await AdminSolutionModel.findByProblemId(id);
      
      res.json({
        message: 'Problem retrieved successfully',
        data: {
          ...problem,
          adminSolutions
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve problem' });
    }
  }

  // Create new problem (admin only)
  static async createProblem(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const problemData = {
        ...req.body,
        created_by: req.user?.id,
        status: req.body.status || 'draft'
      };

      const problem = await ProblemModel.create(problemData);
      
      res.status(201).json({
        message: 'Problem created successfully',
        data: problem
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create problem' });
    }
  }

  // Update problem (admin only)
  static async updateProblem(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const updateData = req.body;

      const problem = await ProblemModel.update(id, updateData);
      
      if (!problem) {
        res.status(404).json({ error: 'Problem not found' });
        return;
      }

      res.json({
        message: 'Problem updated successfully',
        data: problem
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update problem' });
    }
  }

  // Delete problem (admin only)
  static async deleteProblem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const deleted = await ProblemModel.delete(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Problem not found' });
        return;
      }

      res.json({
        message: 'Problem deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete problem' });
    }
  }

  // Publish/Unpublish problem
  static async toggleProblemStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['draft', 'published'].includes(status)) {
        res.status(400).json({ error: 'Invalid status. Must be draft or published' });
        return;
      }

      const updateData = { 
        status,
        published_at: status === 'published' ? new Date() : null
      };

      const problem = await ProblemModel.update(id, updateData);
      
      if (!problem) {
        res.status(404).json({ error: 'Problem not found' });
        return;
      }

      res.json({
        message: `Problem ${status} successfully`,
        data: problem
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update problem status' });
    }
  }
}
```

#### **1.2 Create Admin Solution Management Controller**

**File**: `backend/src/controllers/admin-solution.controller.ts`

```typescript
import { Request, Response } from 'express';
import { AdminSolutionModel } from '../models/AdminSolution';
import { body, param, validationResult } from 'express-validator';

export class AdminSolutionController {
  // Get all solutions for a problem
  static async getSolutionsByProblem(req: Request, res: Response): Promise<void> {
    try {
      const { problemId } = req.params;
      const solutions = await AdminSolutionModel.findByProblemId(problemId);
      
      res.json({
        message: 'Solutions retrieved successfully',
        data: solutions
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve solutions' });
    }
  }

  // Create new admin solution
  static async createSolution(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const solutionData = {
        ...req.body,
        created_by: req.user?.id
      };

      const solution = await AdminSolutionModel.create(solutionData);
      
      res.status(201).json({
        message: 'Solution created successfully',
        data: solution
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create solution' });
    }
  }

  // Update admin solution
  static async updateSolution(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const updateData = req.body;

      const solution = await AdminSolutionModel.update(id, updateData);
      
      if (!solution) {
        res.status(404).json({ error: 'Solution not found' });
        return;
      }

      res.json({
        message: 'Solution updated successfully',
        data: solution
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update solution' });
    }
  }

  // Delete admin solution
  static async deleteSolution(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const deleted = await AdminSolutionModel.delete(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Solution not found' });
        return;
      }

      res.json({
        message: 'Solution deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete solution' });
    }
  }
}
```

#### **1.3 Create Admin Routes**

**File**: `backend/src/routes/admin.routes.ts`

```typescript
import { Router } from 'express';
import { ProblemController } from '../controllers/problem.controller';
import { AdminSolutionController } from '../controllers/admin-solution.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import { body, param } from 'express-validator';

const router = Router();

// Apply authentication and admin middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Problem Management Routes
router.get('/problems', ProblemController.getAllProblems);
router.get('/problems/:id', ProblemController.getProblemById);
router.post('/problems', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
  body('company').optional().isString(),
  body('categories').optional().isArray(),
  body('tags').optional().isArray(),
  body('status').optional().isIn(['draft', 'published'])
], ProblemController.createProblem);

router.put('/problems/:id', [
  param('id').isUUID().withMessage('Invalid problem ID'),
  body('title').optional().notEmpty(),
  body('description').optional().notEmpty(),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
  body('company').optional().isString(),
  body('categories').optional().isArray(),
  body('tags').optional().isArray(),
  body('status').optional().isIn(['draft', 'published'])
], ProblemController.updateProblem);

router.delete('/problems/:id', [
  param('id').isUUID().withMessage('Invalid problem ID')
], ProblemController.deleteProblem);

router.patch('/problems/:id/status', [
  param('id').isUUID().withMessage('Invalid problem ID'),
  body('status').isIn(['draft', 'published']).withMessage('Invalid status')
], ProblemController.toggleProblemStatus);

// Admin Solution Management Routes
router.get('/problems/:problemId/solutions', AdminSolutionController.getSolutionsByProblem);
router.post('/problems/:problemId/solutions', [
  param('problemId').isUUID().withMessage('Invalid problem ID'),
  body('code').notEmpty().withMessage('Code is required'),
  body('explanation').optional().isString(),
  body('time_complexity').optional().isString(),
  body('space_complexity').optional().isString()
], AdminSolutionController.createSolution);

router.put('/solutions/:id', [
  param('id').isUUID().withMessage('Invalid solution ID'),
  body('code').optional().notEmpty(),
  body('explanation').optional().isString(),
  body('time_complexity').optional().isString(),
  body('space_complexity').optional().isString()
], AdminSolutionController.updateSolution);

router.delete('/solutions/:id', [
  param('id').isUUID().withMessage('Invalid solution ID')
], AdminSolutionController.deleteSolution);

export default router;
```

#### **1.4 Update Main Server**

**File**: `backend/src/index.ts`

```typescript
// Add admin routes
import adminRoutes from './routes/admin.routes';

// Add after auth routes
app.use('/api/admin', adminRoutes);
```

### **Phase 2: Frontend Admin Interface**

#### **2.1 Create Admin Dashboard Component**

**File**: `frontend/src/components/AdminDashboard.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
    if (!confirm('Are you sure you want to delete this problem?')) return;

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
```

#### **2.2 Create Problem Management Modals**

**File**: `frontend/src/components/CreateProblemModal.tsx`

```typescript
import React, { useState } from 'react';

interface CreateProblemModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateProblemModal: React.FC<CreateProblemModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    company: '',
    categories: [] as string[],
    tags: [] as string[],
    status: 'draft' as 'draft' | 'published'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryInput, setCategoryInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5000/api/admin/problems', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to create problem:', error);
      alert('Failed to create problem');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCategory = () => {
    if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
      setFormData({
        ...formData,
        categories: [...formData.categories, categoryInput.trim()]
      });
      setCategoryInput('');
    }
  };

  const removeCategory = (category: string) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(c => c !== category)
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Create New Problem</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Difficulty *
              </label>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categories
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                placeholder="Add category"
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={addCategory}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.categories.map((category) => (
                <span
                  key={category}
                  className="px-2 py-1 bg-purple-600 text-white rounded-full text-sm flex items-center space-x-1"
                >
                  <span>{category}</span>
                  <button
                    type="button"
                    onClick={() => removeCategory(category)}
                    className="text-purple-200 hover:text-white"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag"
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-600 text-white rounded-full text-sm flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-gray-300 hover:text-white"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-md transition-colors duration-200"
            >
              {isSubmitting ? 'Creating...' : 'Create Problem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProblemModal;
```

#### **2.3 Update Header Component**

**File**: `frontend/src/components/Header.tsx`

```typescript
// Add admin dashboard link for admin users
{user && user.role === 'admin' && (
  <Link
    to="/admin"
    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
  >
    Admin Dashboard
  </Link>
)}
```

#### **2.4 Update App Router**

**File**: `frontend/src/App.tsx`

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';

// Add admin route
<Route path="/admin" element={<AdminDashboard />} />
```

### **Phase 3: Update Demo Server**

#### **3.1 Update api-demo.js**

**File**: `backend/api-demo.js`

```javascript
// Add admin problem management endpoints
app.post('/api/admin/problems', authenticateAdmin, async (req, res) => {
  try {
    const problemData = {
      id: (problems.length + 1).toString(),
      ...req.body,
      created_by: req.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    problems.push(problemData);
    res.status(201).json({
      message: 'Problem created successfully',
      data: problemData
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create problem' });
  }
});

app.put('/api/admin/problems/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const problemIndex = problems.findIndex(p => p.id === id);
    
    if (problemIndex === -1) {
      res.status(404).json({ error: 'Problem not found' });
      return;
    }
    
    problems[problemIndex] = {
      ...problems[problemIndex],
      ...req.body,
      updated_at: new Date().toISOString()
    };
    
    res.json({
      message: 'Problem updated successfully',
      data: problems[problemIndex]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update problem' });
  }
});

app.delete('/api/admin/problems/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const problemIndex = problems.findIndex(p => p.id === id);
    
    if (problemIndex === -1) {
      res.status(404).json({ error: 'Problem not found' });
      return;
    }
    
    problems.splice(problemIndex, 1);
    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete problem' });
  }
});

// Add admin authentication middleware
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}
```

## 🧪 **Testing Steps**

### **1. Backend API Testing**
```bash
# Test admin problem creation
curl -X POST http://localhost:5000/api/admin/problems \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Problem",
    "description": "This is a test problem",
    "difficulty": "medium",
    "company": "Test Company",
    "categories": ["coding"],
    "tags": ["test"],
    "status": "draft"
  }'

# Test problem update
curl -X PUT http://localhost:5000/api/admin/problems/1 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Problem Title",
    "status": "published"
  }'

# Test problem deletion
curl -X DELETE http://localhost:5000/api/admin/problems/1 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### **2. Frontend Testing**
1. Login as admin (`ai_coding@gmail.com` / `123456`)
2. Navigate to Admin Dashboard
3. Test problem creation, editing, deletion
4. Test solution management
5. Test publish/unpublish functionality

## 🎯 **Expected Results**

After implementation:

1. **Admin Login**: Admin can access special admin dashboard
2. **Problem Management**: Full CRUD operations for problems
3. **Solution Management**: Add/edit/delete official solutions
4. **Status Management**: Publish/unpublish problems
5. **User Experience**: Intuitive admin interface with proper validation
6. **Security**: All admin endpoints protected with authentication and authorization

## 📝 **Implementation Priority**

1. **HIGH**: Backend API endpoints for problem management
2. **HIGH**: Admin authentication middleware
3. **MEDIUM**: Frontend admin dashboard
4. **MEDIUM**: Problem creation/editing modals
5. **LOW**: Solution management interface
6. **LOW**: Advanced admin features (bulk operations, analytics)

---

**This prompt will create a complete admin problem management system with full CRUD operations, solution management, and an intuitive admin interface.**
