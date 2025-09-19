# IMPLEMENT_PROBLEM_SOLUTION_CRUD_OPERATIONS_PROMPT.md

## Goal
Implement full CRUD (Create, Read, Update, Delete) operations for solutions associated with each problem, accessible by Admin users. This includes backend API enhancements, new frontend components, and real-time synchronization.

## Current State
- Full CRUD operations for problems are implemented and synchronized between the Admin Dashboard and the Home Page.
- Admin users can log in and manage problems (add, edit, delete, change status).
- The `Problem` interface in the backend already has a `solutions?: AdminSolution[];` field.
- The `AdminSolution` interface exists in `backend/src/models/AdminSolution.ts`.

## Detailed Requirements

### 1. Backend API Enhancements

#### 1.1. `backend/src/controllers/solution.controller.ts` (New File)
- Create a new controller `SolutionController` to handle solution-specific logic.
- **`createSolution(req: Request, res: Response)`**:
    - Endpoint: `POST /api/admin/problems/:problemId/solutions`
    - Requires `problemId` from `req.params`.
    - Requires `language`, `code`, `description`, `is_published` from `req.body`.
    - Validates input.
    - Creates a new solution associated with the given `problemId`.
    - Returns the created solution.
- **`getAllSolutionsForProblem(req: Request, res: Response)`**:
    - Endpoint: `GET /api/admin/problems/:problemId/solutions`
    - Requires `problemId` from `req.params`.
    - Fetches all solutions for the specified problem (admin view, so all statuses).
    - Returns an array of solutions.
- **`getSolutionById(req: Request, res: Response)`**:
    - Endpoint: `GET /api/admin/problems/:problemId/solutions/:solutionId`
    - Requires `problemId` and `solutionId` from `req.params`.
    - Fetches a specific solution.
    - Returns the solution.
- **`updateSolution(req: Request, res: Response)`**:
    - Endpoint: `PUT /api/admin/problems/:problemId/solutions/:solutionId`
    - Requires `problemId` and `solutionId` from `req.params`.
    - Requires `language`, `code`, `description`, `is_published` (all optional) from `req.body`.
    - Validates input.
    - Updates the specified solution.
    - Returns the updated solution.
- **`deleteSolution(req: Request, res: Response)`**:
    - Endpoint: `DELETE /api/admin/problems/:problemId/solutions/:solutionId`
    - Requires `problemId` and `solutionId` from `req.params`.
    - Deletes the specified solution.
    - Returns a success message.

#### 1.2. `backend/src/routes/admin.routes.ts`
- Import `SolutionController`.
- Add new routes for solution management:
    ```typescript
    // Solution Routes for Admin
    router.post('/problems/:problemId/solutions', [
      param('problemId').notEmpty().withMessage('Invalid problem ID'),
      body('language').notEmpty().withMessage('Language is required'),
      body('code').notEmpty().withMessage('Code is required'),
      body('description').optional().isString(),
      body('is_published').optional().isBoolean()
    ], SolutionController.createSolution);

    router.get('/problems/:problemId/solutions', [
      param('problemId').notEmpty().withMessage('Invalid problem ID')
    ], SolutionController.getAllSolutionsForProblem);

    router.get('/problems/:problemId/solutions/:solutionId', [
      param('problemId').notEmpty().withMessage('Invalid problem ID'),
      param('solutionId').notEmpty().withMessage('Invalid solution ID')
    ], SolutionController.getSolutionById);

    router.put('/problems/:problemId/solutions/:solutionId', [
      param('problemId').notEmpty().withMessage('Invalid problem ID'),
      param('solutionId').notEmpty().withMessage('Invalid solution ID'),
      body('language').optional().notEmpty().withMessage('Language cannot be empty'),
      body('code').optional().notEmpty().withMessage('Code cannot be empty'),
      body('description').optional().isString(),
      body('is_published').optional().isBoolean()
    ], SolutionController.updateSolution);

    router.delete('/problems/:problemId/solutions/:solutionId', [
      param('problemId').notEmpty().withMessage('Invalid problem ID'),
      param('solutionId').notEmpty().withMessage('Invalid solution ID')
    ], SolutionController.deleteSolution);
    ```

#### 1.3. `backend/src/models/AdminSolution.ts`
- Ensure the `AdminSolution` interface and mock data methods are correctly implemented to support CRUD operations.
- Add `created_at` and `updated_at` fields to the `AdminSolution` interface.
- Implement `create`, `update`, `delete`, `findByProblemId`, `findById` methods using the `mockSolutions` array.
- Ensure `mockSolutions` is initialized with some sample data.

#### 1.4. `backend/src/routes/public.routes.ts`
- Add a public endpoint to fetch *published* solutions for a given problem.
    ```typescript
    // Public Solution Routes
    router.get('/problems/:problemId/solutions/published', [
      param('problemId').notEmpty().withMessage('Invalid problem ID')
    ], ProblemController.getPublishedSolutionsForProblem); // Assuming ProblemController handles this, or create a new PublicSolutionController
    ```
- If `ProblemController` is used, add `getPublishedSolutionsForProblem` method to it. This method should filter solutions by `is_published: true`.

### 2. Frontend Components

#### 2.1. `frontend/src/components/SolutionEditorModal.tsx` (New File)
- A modal component for adding and editing solutions.
- Props: `isOpen`, `onClose`, `onSave`, `solution` (optional, for editing).
- Form fields: `language` (dropdown/select, e.g., Python, Java, JavaScript), `code` (Monaco Editor), `description` (textarea), `is_published` (checkbox).
- Includes validation for required fields.
- `onSave` prop should be called with the solution data.

#### 2.2. `frontend/src/components/SolutionManagementTab.tsx` (New File)
- A new tab component for `AdminDashboard` to list and manage solutions for a *selected* problem.
- Props: `problemId` (the ID of the problem whose solutions are being managed).
- Displays a list of solutions for the `problemId`. Each solution entry should show:
    - Language, a snippet of code, description, and published status.
    - "Edit" button (opens `SolutionEditorModal`).
    - "Delete" button (opens `DeleteConfirmationModal`).
- "Add New Solution" button (opens `SolutionEditorModal` in add mode).
- Fetches solutions using the `getAllSolutionsForProblem` API.
- Manages state for `showSolutionEditorModal`, `editingSolution`, `showDeleteSolutionModal`, `deletingSolution`.

#### 2.3. `frontend/src/components/AdminDashboard.tsx`
- Add a new tab for "Solutions Management" (or integrate solution management directly into the "Problems Management" tab).
- If a new tab, update `activeTab` state and rendering logic.
- If integrated into "Problems Management", when a problem is selected/expanded, display its solutions.
- Integrate `SolutionEditorModal` and `DeleteConfirmationModal` for solutions.
- Implement handlers for `handleAddSolution`, `handleEditSolution`, `handleDeleteSolution`, `handleSaveSolution`, `handleSaveEditedSolution`, `handleConfirmDeleteSolution`.
- These handlers will interact with the backend solution APIs and update the local state and `ProblemContext`.
- Use `useNotifications` for success/error messages.

#### 2.4. `frontend/src/components/ProblemsManagementTab.tsx`
- If solution management is integrated here, modify the problem list items to include an "Manage Solutions" button or an expandable section that reveals the `SolutionManagementTab` (or similar UI).
- Pass the `problemId` to the solution management component.

#### 2.5. `frontend/src/contexts/ProblemContext.tsx`
- Update the `Problem` interface to include `solutions?: AdminSolution[];`.
- Add methods to `ProblemContext` to `addSolutionToProblem`, `updateSolutionInProblem`, `removeSolutionFromProblem` to ensure real-time synchronization. These methods will update the `problems` state within the context.

### 3. Real-time Synchronization
- When a solution is added, edited, or deleted via the Admin Dashboard, the `ProblemContext` should be updated.
- The `HomePage` (or `QuestionDetails` component) should fetch published solutions for the `selectedQuestion` using the public API endpoint.
- Ensure that changes made in the Admin Dashboard (e.g., publishing a solution) are immediately reflected on the Home Page when the user navigates to the problem's details or refreshes.

### 4. UI/UX Enhancements
- Ensure the Monaco Editor is correctly integrated into `SolutionEditorModal` for code editing.
- Provide clear feedback (toast notifications) for all solution CRUD operations.
- Ensure modals are responsive and user-friendly.

## Testing
1.  **Backend API Testing (using `curl` or Postman):**
    -   Verify `POST /api/admin/problems/:problemId/solutions` (create solution).
    -   Verify `GET /api/admin/problems/:problemId/solutions` (get all solutions for a problem).
    -   Verify `GET /api/admin/problems/:problemId/solutions/:solutionId` (get specific solution).
    -   Verify `PUT /api/admin/problems/:problemId/solutions/:solutionId` (update solution).
    -   Verify `DELETE /api/admin/problems/:problemId/solutions/:solutionId` (delete solution).
    -   Verify `GET /api/problems/:problemId/solutions/published` (public endpoint for published solutions).
    -   Test with valid and invalid `problemId` and `solutionId`.
    -   Test with different `is_published` statuses.
2.  **Frontend Integration Testing:**
    -   Log in as an admin.
    -   Navigate to the Admin Dashboard.
    -   Select a problem.
    -   Add a new solution (draft and published).
    -   Edit an existing solution.
    -   Delete a solution.
    -   Verify that changes are immediately reflected in the Admin Dashboard.
    -   Log out or open the Home Page in another tab.
    -   Navigate to the problem on the Home Page.
    -   Verify that only *published* solutions appear and reflect the latest changes.
    -   Test changing a solution's status from draft to published and vice-versa, observing real-time sync on the Home Page.

## Acceptance Criteria
- Admin users can add, edit, and delete solutions for any problem through the Admin Dashboard.
- Solutions can be marked as `is_published` or `draft`.
- Only `is_published` solutions are visible on the public-facing Home Page.
- All solution CRUD operations are synchronized in real-time between the Admin Dashboard and the Home Page.
- Appropriate notifications are displayed for all solution management actions.
- The code editor (Monaco) is functional within the solution editor.
