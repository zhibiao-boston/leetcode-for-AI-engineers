import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';

const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center justify-between px-6 h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ID</span>
            </div>
            <span className="text-xl font-bold text-white">LLM Coding</span>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-8">
            <div className="relative">
              <button className="text-gray-300 hover:text-white transition-colors duration-200">
                Interview Resources
              </button>
            </div>
          </div>

          {/* Right side - Authentication */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium"
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
      />
    </>
  );
};

export default Header;
