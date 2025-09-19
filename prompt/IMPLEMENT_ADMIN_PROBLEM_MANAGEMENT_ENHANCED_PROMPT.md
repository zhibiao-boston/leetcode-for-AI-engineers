# IMPLEMENT_ADMIN_PROBLEM_MANAGEMENT_ENHANCED_PROMPT.md

## 🎯 **Objective**
Enhance the Admin Dashboard to provide comprehensive problem management capabilities for admin users, including viewing, editing, deleting problems, and managing their descriptions, categories, and solutions.

## 📋 **Requirements**

### **1. Problem List Management**
- **View All Problems**: Display all problems in a comprehensive table/list format
- **Delete Problems**: Add delete buttons for each problem with confirmation
- **Edit Problems**: Add edit buttons for each problem
- **Problem Status**: Show problem status (published/draft/archived)
- **Search/Filter**: Add search and filter capabilities for problems

### **2. Problem Details Management**
- **Edit Description**: Allow admin to modify problem descriptions
- **Edit Categories**: Allow admin to modify problem categories and tags
- **Edit Metadata**: Allow admin to modify difficulty, company, etc.

### **3. Solution Management**
- **View Solutions**: Display existing solutions for each problem
- **Edit Solutions**: Allow admin to modify existing solutions
- **Save Solutions**: Save solution changes
- **Clear Solutions**: Clear/reset solutions
- **Add New Solutions**: Add new solutions to problems

## 🏗️ **Implementation Plan**

### **Phase 1: Backend API Enhancements**

#### **1.1 Update Problem Management Endpoints**
```typescript
// Enhanced problem endpoints
GET    /api/admin/problems           // Get all problems with full details
GET    /api/admin/problems/:id       // Get specific problem with solutions
PUT    /api/admin/problems/:id       // Update problem details
DELETE /api/admin/problems/:id       // Delete problem
PATCH  /api/admin/problems/:id/status // Update problem status
```

#### **1.2 Solution Management Endpoints**
```typescript
// Solution management endpoints
GET    /api/admin/problems/:id/solutions     // Get all solutions for a problem
POST   /api/admin/problems/:id/solutions     // Add new solution
PUT    /api/admin/solutions/:id              // Update solution
DELETE /api/admin/solutions/:id             // Delete solution
```

#### **1.3 Enhanced Data Models**
```typescript
interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  company: string;
  categories: string[];
  tags: string[];
  status: 'published' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
  created_by: string;
  solutions?: Solution[];
}

interface Solution {
  id: string;
  problem_id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  complexity: string;
  explanation: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}
```

### **Phase 2: Frontend Components**

#### **2.1 Enhanced AdminDashboard Component**
```typescript
// Main admin dashboard with tabs
- Problems Tab: List all problems with actions
- Solutions Tab: Manage solutions across problems
- Analytics Tab: Problem statistics and insights
```

#### **2.2 Problem Management Components**
```typescript
// ProblemList component
- Table view of all problems
- Search and filter functionality
- Action buttons (Edit, Delete, View)
- Status indicators
- Bulk actions

// ProblemEditor component
- Form for editing problem details
- Rich text editor for description
- Category/tag management
- Metadata editing
- Save/Cancel actions

// SolutionManager component
- List of solutions for a problem
- Code editor for solutions
- Solution metadata editing
- Save/Clear/Delete actions
```

#### **2.3 Enhanced Modals**
```typescript
// EditProblemModal (enhanced)
- Full problem editing form
- Description editor
- Category management
- Status management
- Solution management integration

// SolutionEditorModal
- Code editor for solutions
- Solution metadata form
- Save/Clear/Delete actions
- Preview functionality
```

### **Phase 3: UI/UX Enhancements**

#### **3.1 Admin Dashboard Layout**
```
┌─────────────────────────────────────────────────────────────┐
│ Admin Dashboard                                              │
├─────────────────────────────────────────────────────────────┤
│ [Problems] [Solutions] [Analytics]                          │
├─────────────────────────────────────────────────────────────┤
│ Search: [________] Filter: [All ▼] [Add Problem] [+]       │
├─────────────────────────────────────────────────────────────┤
│ Problems Table:                                              │
│ ┌─────┬─────────────┬─────────────┬─────────────┬──────────┐ │
│ │ ID  │ Title       │ Categories  │ Status      │ Actions  │ │
│ ├─────┼─────────────┼─────────────┼─────────────┼──────────┤ │
│ │ 1   │ Design DB   │ coding,db  │ Published   │ [Edit][Del] │ │
│ │ 2   │ Array Comp  │ coding     │ Draft       │ [Edit][Del] │ │
│ └─────┴─────────────┴─────────────┴─────────────┴──────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### **3.2 Problem Editor Layout**
```
┌─────────────────────────────────────────────────────────────┐
│ Edit Problem: Design Database                               │
├─────────────────────────────────────────────────────────────┤
│ Title: [Design Database________________]                    │
│ Difficulty: [Medium ▼] Company: [Google________]            │
│ Categories: [coding] [database] [+]                          │
│ Status: [Published ▼]                                        │
├─────────────────────────────────────────────────────────────┤
│ Description:                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Rich text editor for problem description]              │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Solutions: [View Solutions] [Add Solution]                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Solution 1: Basic Implementation                        │ │
│ │ Solution 2: Optimized Implementation                    │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ [Save Changes] [Cancel] [Delete Problem]                   │
└─────────────────────────────────────────────────────────────┘
```

#### **3.3 Solution Editor Layout**
```
┌─────────────────────────────────────────────────────────────┐
│ Edit Solution: Basic Implementation                         │
├─────────────────────────────────────────────────────────────┤
│ Title: [Basic Implementation______________]                 │
│ Language: [Python ▼] Complexity: [O(n)______]               │
│ Description: [Solution description...]                      │
├─────────────────────────────────────────────────────────────┤
│ Code:                                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ class Solution:                                          │ │
│ │     def solve(self, input_data):                         │ │
│ │         # Implementation here                           │ │
│ │         pass                                            │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Explanation: [Detailed explanation...]                      │
├─────────────────────────────────────────────────────────────┤
│ [Save Solution] [Clear Code] [Delete Solution] [Preview]    │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 **Technical Implementation**

### **Backend Changes**

#### **1. Update Controllers**
```typescript
// problem.controller.ts - Enhanced CRUD operations
export class ProblemController {
  async getAllProblems(req: Request, res: Response) {
    // Return all problems with solutions
  }
  
  async getProblemById(req: Request, res: Response) {
    // Return specific problem with all solutions
  }
  
  async updateProblem(req: Request, res: Response) {
    // Update problem details, categories, description
  }
  
  async deleteProblem(req: Request, res: Response) {
    // Delete problem and associated solutions
  }
  
  async updateProblemStatus(req: Request, res: Response) {
    // Update problem status (published/draft/archived)
  }
}

// solution.controller.ts - Solution management
export class SolutionController {
  async getSolutionsByProblem(req: Request, res: Response) {
    // Get all solutions for a problem
  }
  
  async createSolution(req: Request, res: Response) {
    // Create new solution
  }
  
  async updateSolution(req: Request, res: Response) {
    // Update existing solution
  }
  
  async deleteSolution(req: Request, res: Response) {
    // Delete solution
  }
}
```

#### **2. Update Routes**
```typescript
// admin.routes.ts - Enhanced admin routes
router.get('/problems', authenticateToken, requireAdmin, ProblemController.getAllProblems);
router.get('/problems/:id', authenticateToken, requireAdmin, ProblemController.getProblemById);
router.put('/problems/:id', authenticateToken, requireAdmin, ProblemController.updateProblem);
router.delete('/problems/:id', authenticateToken, requireAdmin, ProblemController.deleteProblem);
router.patch('/problems/:id/status', authenticateToken, requireAdmin, ProblemController.updateProblemStatus);

router.get('/problems/:id/solutions', authenticateToken, requireAdmin, SolutionController.getSolutionsByProblem);
router.post('/problems/:id/solutions', authenticateToken, requireAdmin, SolutionController.createSolution);
router.put('/solutions/:id', authenticateToken, requireAdmin, SolutionController.updateSolution);
router.delete('/solutions/:id', authenticateToken, requireAdmin, SolutionController.deleteSolution);
```

### **Frontend Changes**

#### **1. Enhanced AdminDashboard Component**
```typescript
// AdminDashboard.tsx - Enhanced with tabs and comprehensive management
const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'problems' | 'solutions' | 'analytics'>('problems');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  // Enhanced problem management functions
  const handleEditProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    // Open enhanced edit modal
  };

  const handleDeleteProblem = async (problemId: string) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      // Delete problem and refresh list
    }
  };

  const handleUpdateProblemStatus = async (problemId: string, status: string) => {
    // Update problem status
  };

  // Solution management functions
  const handleEditSolution = (solution: Solution) => {
    // Open solution editor
  };

  const handleSaveSolution = async (solution: Solution) => {
    // Save solution changes
  };

  const handleClearSolution = (solutionId: string) => {
    // Clear solution code
  };

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
    </div>
  );
};
```

#### **2. ProblemsManagementTab Component**
```typescript
// ProblemsManagementTab.tsx - Comprehensive problem management
const ProblemsManagementTab: React.FC<ProblemsManagementTabProps> = ({
  problems,
  onEditProblem,
  onDeleteProblem,
  onUpdateStatus,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus
}) => {
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || problem.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      {/* Search and filter controls */}
      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="Search problems..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md">
          Add New Problem
        </button>
      </div>

      {/* Problems table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Categories</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Solutions</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.map((problem) => (
              <tr key={problem.id} className="border-b border-gray-700">
                <td className="px-4 py-3">{problem.id}</td>
                <td className="px-4 py-3 font-medium">{problem.title}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {problem.categories.map((category) => (
                      <span key={category} className="px-2 py-1 bg-gray-600 rounded text-xs">
                        {category}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={problem.status}
                    onChange={(e) => onUpdateStatus(problem.id, e.target.value)}
                    className="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-sm"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </td>
                <td className="px-4 py-3">{problem.solutions?.length || 0}</td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditProblem(problem)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteProblem(problem.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

#### **3. Enhanced EditProblemModal**
```typescript
// EditProblemModal.tsx - Comprehensive problem editing
const EditProblemModal: React.FC<EditProblemModalProps> = ({
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
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [newCategory, setNewCategory] = useState('');

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

  const handleSaveProblem = async () => {
    await onSave(formData);
    onClose();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Problem: {problem?.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
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
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md"
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
                      ✕
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
                rows={8}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="Enter problem description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Solutions</label>
              <div className="space-y-2">
                {solutions.map((solution) => (
                  <div key={solution.id} className="p-3 bg-gray-700 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{solution.title}</span>
                      <div className="flex space-x-2">
                        <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                          Edit
                        </button>
                        <button className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-sm">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full p-3 border-2 border-dashed border-gray-600 rounded-md hover:border-purple-500">
                  Add New Solution
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveProblem}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
```

#### **4. SolutionEditorModal Component**
```typescript
// SolutionEditorModal.tsx - Solution editing and management
const SolutionEditorModal: React.FC<SolutionEditorModalProps> = ({
  solution,
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
    explanation: solution?.explanation || ''
  });

  const handleSaveSolution = async () => {
    await onSave(formData);
    onClose();
  };

  const handleClearCode = () => {
    setFormData({ ...formData, code: '' });
  };

  const handleDeleteSolution = async () => {
    if (window.confirm('Are you sure you want to delete this solution?')) {
      await onDelete(solution?.id);
      onClose();
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Solution: {solution?.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Complexity</label>
              <input
                type="text"
                value={formData.complexity}
                onChange={(e) => setFormData({ ...formData, complexity: e.target.value })}
                placeholder="e.g., O(n), O(n log n)"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="Brief description of the solution approach..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Explanation</label>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
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
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white font-mono text-sm"
                placeholder="Enter your solution code here..."
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleClearCode}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md"
              >
                Clear Code
              </button>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md">
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between mt-6 pt-6 border-t border-gray-700">
          <button
            onClick={handleDeleteSolution}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
          >
            Delete Solution
          </button>
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSolution}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md"
            >
              Save Solution
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## 🎯 **Expected Outcomes**

### **1. Enhanced Admin Dashboard**
- ✅ Comprehensive problem management interface
- ✅ Tabbed navigation for different management areas
- ✅ Search and filter capabilities
- ✅ Bulk operations support

### **2. Problem Management**
- ✅ View all problems in organized table format
- ✅ Edit problem details (title, description, categories, metadata)
- ✅ Delete problems with confirmation
- ✅ Update problem status (published/draft/archived)
- ✅ Real-time search and filtering

### **3. Solution Management**
- ✅ View all solutions for each problem
- ✅ Edit solution details (title, description, code, explanation)
- ✅ Save solution changes
- ✅ Clear solution code
- ✅ Delete solutions
- ✅ Add new solutions to problems

### **4. User Experience**
- ✅ Intuitive interface with clear navigation
- ✅ Responsive design for different screen sizes
- ✅ Confirmation dialogs for destructive actions
- ✅ Real-time updates and feedback
- ✅ Comprehensive error handling

## 🚀 **Implementation Steps**

1. **Backend API Enhancement**
   - Update problem and solution controllers
   - Add new endpoints for comprehensive management
   - Enhance data models with additional fields

2. **Frontend Component Development**
   - Create enhanced AdminDashboard with tabs
   - Build ProblemsManagementTab component
   - Develop comprehensive EditProblemModal
   - Implement SolutionEditorModal

3. **Integration and Testing**
   - Connect frontend components to backend APIs
   - Test all CRUD operations
   - Verify error handling and edge cases
   - Ensure responsive design

4. **UI/UX Polish**
   - Add loading states and animations
   - Implement proper error messages
   - Add confirmation dialogs
   - Optimize for different screen sizes

This comprehensive implementation will provide admin users with full control over problem and solution management, creating a powerful content management system for the coding platform.
