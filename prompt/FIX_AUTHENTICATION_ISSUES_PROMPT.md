# Fix Authentication Issues Prompt

## 🎯 **Objective**
Fix authentication issues in the LeetCode for AI Engineers application, specifically:
1. Sign-up then sign-in not working properly
2. Provide admin login credentials and guidance
3. Explain where to maintain admin and user logins

## 🔍 **Issues Identified**

### **Issue 1: Sign-up then Sign-in Not Working**
**Root Cause**: The frontend AuthContext has a syntax error in the `register` function - missing opening brace `{` after the arrow function.

**Location**: `frontend/src/contexts/AuthContext.tsx` line 84-85

**Current Code**:
```typescript
const register = async (email: string, password: string, name: string) =>
  try {
    // ... rest of function
  } catch (error) {
    // ... error handling
  }
;
```

**Problem**: Missing opening brace `{` after the arrow function, causing syntax error.

### **Issue 2: Admin Login Credentials**
**Current Admin Credentials** (from `backend/api-demo.js`):
- **Email**: `admin@leetcode.com`
- **Password**: The hash `$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K` appears to be a placeholder hash, not a real password.

**Problem**: The admin password hash is not a real bcrypt hash for a known password.

## 🛠️ **Required Fixes**

### **Fix 1: Correct AuthContext Syntax Error**

**File**: `frontend/src/contexts/AuthContext.tsx`

**Change**:
```typescript
// BEFORE (line 84-85)
const register = async (email: string, password: string, name: string) =>
  try {

// AFTER
const register = async (email: string, password: string, name: string) => {
  try {
```

**Also fix the closing**:
```typescript
// BEFORE (line 112)
;

// AFTER
};
```

### **Fix 2: Create Proper Admin Credentials**

**File**: `backend/api-demo.js`

**Replace the admin user object** (lines 18-26):
```javascript
// BEFORE
{
  id: '1',
  email: 'admin@leetcode.com',
  password_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K',
  name: 'Admin User',
  role: 'admin',
  created_at: new Date().toISOString()
}

// AFTER
{
  id: '1',
  email: 'admin@leetcode.com',
  password_hash: '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
  name: 'Admin User',
  role: 'admin',
  created_at: new Date().toISOString()
}
```

**Alternative**: Generate a new hash for a custom password:
```javascript
// Generate hash for password "admin123"
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('admin123', 12);
console.log('Hash for admin123:', hash);
```

### **Fix 3: Add Admin User to Mock Database**

**File**: `backend/src/config/database-mock.ts`

**Update the mockUsers array** (lines 13-34):
```typescript
export const mockUsers = [
  {
    id: '1',
    email: 'admin@leetcode.com',
    password_hash: '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
    name: 'Admin User',
    role: 'admin',
    created_at: new Date(),
    updated_at: new Date(),
    last_login_at: new Date()
  },
  {
    id: '2',
    email: 'user@example.com',
    password_hash: '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
    name: 'Test User',
    role: 'user',
    created_at: new Date(),
    updated_at: new Date(),
    last_login_at: new Date()
  }
];
```

## 📋 **Admin Login Credentials**

### **Demo Server (api-demo.js)**
- **Email**: `ai_coding@gmail.com`
- **Password**: `123456`

### **Mock Database Server**
- **Email**: `ai_coding@gmail.com`
- **Password**: `123456`

### **Production Database (when using PostgreSQL)**
- **Email**: `ai_coding@gmail.com`
- **Password**: `123456` (as defined in schema.sql)

## 🔧 **Where to Maintain Admin/User Logins**

### **1. Demo Server (`backend/api-demo.js`)**
- **Purpose**: Quick testing and development
- **Location**: Lines 18-26 in the `users` array
- **How to modify**: Edit the `users` array directly
- **Restart required**: Yes, restart the server

### **2. Mock Database (`backend/src/config/database-mock.ts`)**
- **Purpose**: TypeScript development server
- **Location**: Lines 13-34 in the `mockUsers` array
- **How to modify**: Edit the `mockUsers` array
- **Restart required**: Yes, restart the server

### **3. Production Database (`backend/database/schema.sql`)**
- **Purpose**: Real PostgreSQL database
- **Location**: Lines 107-109 (INSERT statement)
- **How to modify**: Update the INSERT statement or use SQL commands
- **Restart required**: No, changes take effect immediately

### **4. Environment Variables (`.env`)**
- **Purpose**: Configuration for different environments
- **Location**: Create `.env` file in backend directory
- **Example**:
```env
ADMIN_EMAIL=admin@leetcode.com
ADMIN_PASSWORD=admin123
```

## 🧪 **Testing Steps**

### **1. Test User Registration and Login**
1. Start backend: `cd backend && node api-demo.js`
2. Start frontend: `cd frontend && npm start`
3. Open http://localhost:3000
4. Click "Sign Up"
5. Register with: `test@example.com` / `Test123!` / `Test User`
6. Click "Sign In"
7. Login with the same credentials
8. Verify user appears in header

### **2. Test Admin Login**
1. Click "Sign In" in the header
2. Use admin credentials:
   - **Email**: `ai_coding@gmail.com`
   - **Password**: `123456`
3. Verify admin user appears in header
4. Check if admin has different permissions/UI

## 🎯 **Expected Results**

After applying these fixes:

1. **User Registration**: Users can successfully register
2. **User Login**: Users can login after registration
3. **Admin Login**: Admin can login with provided credentials
4. **Persistent Sessions**: Users stay logged in after page refresh
5. **Proper Error Handling**: Clear error messages for invalid credentials

## 📝 **Additional Improvements**

### **1. Add Password Validation**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### **2. Add Admin Panel**
- Different UI for admin users
- Admin-only features (manage problems, users, etc.)
- Role-based access control

### **3. Add User Management**
- Admin can view all users
- Admin can promote/demote users
- Admin can delete users

### **4. Add Password Reset**
- Forgot password functionality
- Email-based password reset
- Secure token-based reset

## 🚀 **Implementation Priority**

1. **HIGH**: Fix AuthContext syntax error (breaks registration)
2. **HIGH**: Fix admin password hash (breaks admin login)
3. **MEDIUM**: Add proper password validation
4. **LOW**: Add admin panel features
5. **LOW**: Add user management features

---

**This prompt will resolve all authentication issues and provide clear guidance for maintaining admin and user credentials across different environments.**
