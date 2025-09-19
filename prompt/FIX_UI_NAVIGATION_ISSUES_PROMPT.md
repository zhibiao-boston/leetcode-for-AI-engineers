# Fix UI Navigation and Authentication Issues Prompt

## 🎯 **Objective**
Fix multiple UI and authentication issues in the LeetCode for AI Engineers application:

1. **Sign-up/Sign-in Confusion**: Sign-up button actually performs sign-in
2. **Authentication Flow Issue**: User can't sign-in after signing up
3. **Navigation Issue**: Can't navigate back from Admin Dashboard to Interview Resources
4. **Home Link Missing**: "LLM Coding" should be a hyperlink to home
5. **Font Size**: Make navigation elements larger and more prominent

## 🔍 **Current Issues Analysis**

### **Issue 1: Sign-up Button Behavior**
- **Problem**: Sign-up button opens sign-in modal instead of registration
- **Expected**: Sign-up should open registration form, sign-in should open login form
- **Location**: `frontend/src/components/Header.tsx`

### **Issue 2: Authentication Flow**
- **Problem**: After successful registration, subsequent sign-in attempts fail
- **Expected**: User should be able to sign-in after registration
- **Location**: `frontend/src/contexts/AuthContext.tsx`

### **Issue 3: Navigation Between Pages**
- **Problem**: No way to navigate back from Admin Dashboard to Interview Resources
- **Expected**: Clear navigation between different sections
- **Location**: `frontend/src/components/Header.tsx`, `frontend/src/App.tsx`

### **Issue 4: Home Link Missing**
- **Problem**: "LLM Coding" title is not clickable
- **Expected**: "LLM Coding" should be a clickable link to home page
- **Location**: `frontend/src/components/Header.tsx`

### **Issue 5: Font Size**
- **Problem**: Navigation elements are too small
- **Expected**: Larger, more prominent navigation text
- **Location**: `frontend/src/components/Header.tsx`

## 🛠️ **Required Implementation**

### **Phase 1: Fix Authentication Flow**

#### **1.1 Update Header Component**

**File**: `frontend/src/components/Header.tsx`

```typescript
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const location = useLocation();

  const handleSignInClick = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleSignUpClick = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const isAdminDashboard = location.pathname === '/admin';
  const isHomePage = location.pathname === '/';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center justify-between px-6 h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ID</span>
            </div>
            <Link 
              to="/" 
              className="text-2xl font-bold text-white hover:text-purple-300 transition-colors duration-200"
            >
              LLM Coding
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`text-lg font-medium transition-colors duration-200 ${
                isHomePage 
                  ? 'text-purple-400' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Interview Resources
            </Link>
            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className={`text-lg font-medium transition-colors duration-200 ${
                  isAdminDashboard 
                    ? 'text-purple-400' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Right side - Authentication */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSignInClick}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-base font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={handleSignUpClick}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200 text-base font-medium"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
};

export default Header;
```

#### **1.2 Update AuthModal Component**

**File**: `frontend/src/components/AuthModal.tsx`

```typescript
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onModeChange }) => {
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.name);
      }
      onClose();
      // Clear form after successful authentication
      setFormData({ email: '', password: '', name: '' });
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    const newMode = mode === 'login' ? 'register' : 'login';
    onModeChange(newMode);
    setError('');
    setFormData({ email: '', password: '', name: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {mode === 'login' ? 'Sign In' : 'Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required={mode === 'register'}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-2 rounded-md transition-colors duration-200"
          >
            {isLoading ? 'Loading...' : (mode === 'login' ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={switchMode}
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            {mode === 'login' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>

        {mode === 'login' && (
          <div className="mt-4 text-center text-sm text-gray-400">
            Demo credentials: ai_coding@gmail.com / 123456
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
```

#### **1.3 Update AuthContext**

**File**: `frontend/src/contexts/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored authentication data on mount
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      const { user: userData, accessToken, refreshToken } = data.data;

      // Store authentication data
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const data = await response.json();
      const { user: userData, accessToken, refreshToken } = data.data;

      // Store authentication data
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### **Phase 2: Update App Component**

#### **2.1 Update App.tsx**

**File**: `frontend/src/App.tsx`

```typescript
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { sampleQuestions, Question } from './data/questions';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import QuestionList from './components/QuestionList';
import QuestionDetails from './components/QuestionDetails';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(sampleQuestions[0]);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <Header />
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/" element={
              <div className="flex h-screen pt-16">
                <div className="w-2/5 border-r border-gray-700">
                  <QuestionList 
                    questions={sampleQuestions}
                    selectedQuestion={selectedQuestion}
                    onSelectQuestion={setSelectedQuestion}
                  />
                </div>
                <div className="w-3/5">
                  <QuestionDetails question={selectedQuestion} />
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

## 🧪 **Testing Steps**

### **1. Authentication Flow Testing**
```bash
# Test registration
1. Click "Sign Up" button
2. Fill in name, email, password
3. Submit registration
4. Verify user is logged in automatically

# Test subsequent login
1. Logout
2. Click "Sign In" button
3. Use same credentials
4. Verify successful login
```

### **2. Navigation Testing**
```bash
# Test home link
1. Click "LLM Coding" title
2. Verify navigation to home page

# Test navigation between sections
1. From home, click "Admin Dashboard" (as admin)
2. From admin dashboard, click "Interview Resources"
3. Verify smooth navigation between pages
```

### **3. UI Testing**
```bash
# Test font sizes
1. Verify "LLM Coding" is larger and clickable
2. Verify "Interview Resources" is larger
3. Verify "Admin Dashboard" is larger
4. Verify active page highlighting
```

## 🎯 **Expected Results**

After implementation:

1. **Authentication Flow**: ✅ Separate sign-up and sign-in modals
2. **Registration Success**: ✅ Users can sign-in after registration
3. **Navigation**: ✅ Smooth navigation between all pages
4. **Home Link**: ✅ "LLM Coding" is clickable and navigates home
5. **Font Size**: ✅ All navigation elements are larger and more prominent
6. **Active States**: ✅ Current page is highlighted in navigation

## 📝 **Implementation Priority**

1. **HIGH**: Fix authentication flow (sign-up vs sign-in)
2. **HIGH**: Fix registration/login sequence
3. **MEDIUM**: Add navigation between pages
4. **MEDIUM**: Make "LLM Coding" clickable
5. **LOW**: Increase font sizes for better visibility

---

**This prompt will fix all the identified UI and authentication issues, providing a smooth user experience with proper navigation and authentication flow.**
