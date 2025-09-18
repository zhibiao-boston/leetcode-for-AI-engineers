import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
      >
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-white">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-medium">{user.name}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-20 border border-gray-700">
            <div className="py-1">
              <div className="px-4 py-2 border-b border-gray-700">
                <p className="text-sm text-white font-medium">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
                {user.role === 'admin' && (
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-purple-600 text-white rounded">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  logout();
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
