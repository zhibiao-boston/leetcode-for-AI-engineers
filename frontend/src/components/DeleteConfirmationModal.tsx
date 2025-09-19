import React, { useState } from 'react';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  company?: string;
  categories: string[];
  tags: string[];
  status: string;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  problem: Problem | null;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  problem
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error deleting problem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !problem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-white">
              Delete Problem
            </h3>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-300 mb-3">
            Are you sure you want to delete this problem? This action cannot be undone.
          </p>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">{problem.title}</h4>
            <p className="text-gray-300 text-sm mb-2">
              {problem.description.length > 100 
                ? `${problem.description.substring(0, 100)}...` 
                : problem.description
              }
            </p>
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                problem.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {problem.difficulty}
              </span>
              {problem.company && (
                <span className="px-2 py-1 text-xs bg-gray-600 text-gray-300 rounded-full">
                  {problem.company}
                </span>
              )}
              {problem.categories.map(category => (
                <span key={category} className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors duration-200"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Problem'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
