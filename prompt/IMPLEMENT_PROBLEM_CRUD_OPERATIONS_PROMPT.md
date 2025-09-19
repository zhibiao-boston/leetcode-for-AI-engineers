# IMPLEMENT_PROBLEM_CRUD_OPERATIONS_PROMPT.md

## **PROMPT: Implement Complete Problem CRUD Operations with Real-time Sync**

### **Objective**
Implement a complete Create, Read, Update, Delete (CRUD) system for problem management that ensures real-time synchronization between the admin dashboard and the home page. When admins create, edit, or delete problems, these changes should immediately reflect on the main problem list visible to all users.

### **Requirements**

#### **1. Add New Problem Functionality**
- **Location**: Admin Dashboard → Problems Management Tab
- **Trigger**: "Add New Problem" button
- **Modal Form Fields**:
  - Title (required, text input)
  - Description (required, textarea)
  - Difficulty (dropdown: Easy, Medium, Hard)
  - Company (text input, optional)
  - Categories (multi-select: coding, phone, onsite)
  - Tags (comma-separated text input)
  - Status (dropdown: Draft, Published, Archived)
- **Validation**: All required fields must be filled
- **Actions**: 
  - "Save as Draft" - saves with status "draft"
  - "Publish" - saves with status "published" and immediately appears on home page
  - "Cancel" - closes modal without saving

#### **2. Delete Problem Functionality**
- **Location**: Admin Dashboard → Problems Management Tab → Actions column
- **Trigger**: "Delete" button (red)
- **Confirmation**: Show confirmation dialog with:
  - Problem title
  - Warning message about permanent deletion
  - "Cancel" and "Confirm Delete" buttons
- **Behavior**: 
  - On confirmation, permanently remove from database
  - Immediately remove from both admin dashboard and home page
  - Show success notification

#### **3. Edit Problem Functionality**
- **Location**: Admin Dashboard → Problems Management Tab → Actions column
- **Trigger**: "Edit" button (blue)
- **Modal**: Pre-populated form with current problem data
- **Fields**: Same as Add New Problem form
- **Actions**:
  - "Save Changes" - updates problem and syncs to home page
  - "Cancel" - closes modal without saving
- **Real-time Update**: Changes immediately reflect on home page

#### **4. Real-time Synchronization**
- **Home Page Integration**: Main problem list should automatically reflect changes
- **Data Source**: Use backend API instead of static frontend data
- **Auto-refresh**: Home page should fetch latest data when:
  - User navigates to home page
  - Admin publishes new problem
  - Admin updates existing problem
  - Admin deletes problem

### **Technical Implementation**

#### **Backend Requirements**
1. **API Endpoints**:
   - `POST /api/admin/problems` - Create new problem
   - `PUT /api/admin/problems/:id` - Update existing problem
   - `DELETE /api/admin/problems/:id` - Delete problem
   - `GET /api/problems` - Get all published problems (for home page)

2. **Database Schema Updates**:
   - Ensure `mockProblems` supports all required fields
   - Add proper validation for required fields
   - Handle status transitions (draft → published)

3. **Response Format**:
   - Return updated problem list after CRUD operations
   - Include success/error messages
   - Provide proper HTTP status codes

#### **Frontend Requirements**
1. **Admin Dashboard Components**:
   - `AddProblemModal` - Form for creating new problems
   - `EditProblemModal` - Form for editing existing problems
   - `DeleteConfirmationModal` - Confirmation dialog for deletions
   - Enhanced `ProblemsManagementTab` with CRUD actions

2. **Home Page Integration**:
   - Replace static `questions.ts` data with API calls
   - Implement data fetching from `/api/problems`
   - Add loading states and error handling
   - Ensure real-time updates

3. **State Management**:
   - Update problem lists after CRUD operations
   - Handle loading and error states
   - Maintain data consistency between admin and home views

#### **User Experience Requirements**
1. **Visual Feedback**:
   - Loading spinners during API calls
   - Success/error notifications
   - Form validation messages
   - Confirmation dialogs for destructive actions

2. **Navigation Flow**:
   - Admin creates problem → immediately visible on home page
   - Admin edits problem → changes reflected on home page
   - Admin deletes problem → removed from home page
   - Users see updated problem list without manual refresh

3. **Error Handling**:
   - Network error handling
   - Validation error display
   - Graceful fallbacks for failed operations

### **Expected Outcomes**
1. **Complete CRUD Operations**: Admins can create, read, update, and delete problems
2. **Real-time Sync**: Changes in admin dashboard immediately appear on home page
3. **User-friendly Interface**: Intuitive forms and confirmation dialogs
4. **Data Consistency**: Single source of truth (backend API) for all problem data
5. **Robust Error Handling**: Proper validation and error messages

### **Success Criteria**
- ✅ Admin can add new problems that appear on home page
- ✅ Admin can edit problems with changes syncing to home page
- ✅ Admin can delete problems with removal from home page
- ✅ All operations show appropriate feedback to users
- ✅ Home page always shows current, up-to-date problem list
- ✅ No data inconsistencies between admin dashboard and home page

### **Implementation Priority**
1. **Phase 1**: Backend API endpoints for CRUD operations
2. **Phase 2**: Admin dashboard CRUD interface
3. **Phase 3**: Home page API integration and real-time sync
4. **Phase 4**: Error handling and user experience polish

### **Detailed Implementation Steps**

#### **Backend Implementation**
1. **Create Problem Endpoint**:
   ```typescript
   POST /api/admin/problems
   Body: {
     title: string,
     description: string,
     difficulty: 'easy' | 'medium' | 'hard',
     company?: string,
     categories: string[],
     tags: string[],
     status: 'draft' | 'published' | 'archived'
   }
   ```

2. **Update Problem Endpoint**:
   ```typescript
   PUT /api/admin/problems/:id
   Body: Same as create
   ```

3. **Delete Problem Endpoint**:
   ```typescript
   DELETE /api/admin/problems/:id
   Response: { success: boolean, message: string }
   ```

4. **Public Problems Endpoint**:
   ```typescript
   GET /api/problems
   Response: Array of published problems
   ```

#### **Frontend Implementation**
1. **AddProblemModal Component**:
   - Form validation
   - Status selection (Draft/Published)
   - Category multi-select
   - Tag input handling
   - API integration

2. **EditProblemModal Component**:
   - Pre-populate form with existing data
   - Handle updates
   - Maintain data consistency

3. **DeleteConfirmationModal Component**:
   - Show problem details
   - Confirmation flow
   - Error handling

4. **Home Page Integration**:
   - Replace static data with API calls
   - Implement data fetching
   - Handle loading states
   - Real-time updates

### **Testing Checklist**
- [ ] Create new problem appears on home page
- [ ] Edit problem updates home page
- [ ] Delete problem removes from home page
- [ ] Form validation works correctly
- [ ] Error handling displays appropriate messages
- [ ] Loading states show during API calls
- [ ] Confirmation dialogs work properly
- [ ] Data consistency maintained across views

This prompt provides a comprehensive roadmap for implementing a fully functional problem management system with real-time synchronization between the admin dashboard and home page.
