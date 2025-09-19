import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-700">
      <div className="flex items-center justify-between px-6 h-16">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">ID</span>
          </div>
          <span className="text-xl font-bold text-white">Code LLM from Scratch</span>
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-8">
          <div className="relative">
            <button className="text-gray-300 hover:text-white transition-colors duration-200">
              Interview Resources
            </button>
          </div>
        </div>

        {/* Right side - empty for now */}
        <div className="w-32"></div>
      </div>
    </header>
  );
};

export default Header;
