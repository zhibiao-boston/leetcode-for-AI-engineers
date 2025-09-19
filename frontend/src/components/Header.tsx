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
