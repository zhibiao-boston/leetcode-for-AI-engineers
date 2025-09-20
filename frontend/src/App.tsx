// Import error suppression utility first to ensure it's active before any components load
import './utils/errorSuppression';

import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Question } from './data/questions';
import { AuthProvider } from './contexts/AuthContext';
import { ProblemProvider, useProblems } from './contexts/ProblemContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import QuestionList from './components/QuestionList';
import QuestionDetails from './components/QuestionDetails';
import AdminDashboard from './components/AdminDashboard';
import UserProfilePage from './components/UserProfilePage';
import ErrorBoundary from './components/ErrorBoundary';

// Home Page Component that uses ProblemContext
const HomePage: React.FC = () => {
  const { problems, isLoading, error, refreshProblems } = useProblems();
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isQuestionListVisible, setIsQuestionListVisible] = useState(true);
  
  // Resizable main layout state
  const [mainLeftWidth, setMainLeftWidth] = useState(40); // Default 40% for question list
  const [isMainDragging, setIsMainDragging] = useState(false);

  // Set question from URL only, don't auto-select when navigating to home
  useEffect(() => {
    if (problems.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const questionId = urlParams.get('question');
      
      if (questionId) {
        const question = problems.find(p => p.id === questionId);
        if (question) {
          setSelectedQuestion(question);
          // When selecting a question, keep current list visibility
        } else {
          // If invalid question ID, clear selection and show problem list
          setSelectedQuestion(null);
          setIsQuestionListVisible(true);
        }
      } else {
        // No question ID in URL means we want to show the problem list
        setSelectedQuestion(null);
        setIsQuestionListVisible(true); // Ensure question list is visible
        
        // Clean up URL to remove any question parameters
        const currentUrl = new URL(window.location.href);
        if (currentUrl.searchParams.has('question')) {
          currentUrl.searchParams.delete('question');
          window.history.replaceState({}, '', currentUrl.toString());
        }
      }
    }
  }, [problems]);

  // Refresh problems when returning to home page (for real-time sync)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshProblems();
      }
    };

    const handleFocus = () => {
      refreshProblems();
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshProblems]);

  const handleSelectQuestion = (question: Question) => {
    setSelectedQuestion(question);
    // Update URL with question ID
    const url = new URL(window.location.href);
    url.searchParams.set('question', question.id);
    window.history.pushState({}, '', url.toString());
  };

  // Toggle question list visibility
  const toggleQuestionList = () => {
    setIsQuestionListVisible(!isQuestionListVisible);
  };

  // Drag handler for main layout resizable divider
  const handleMainMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isQuestionListVisible) return; // Only allow resize when list is visible
    
    setIsMainDragging(true);
    const startX = e.clientX;
    const startWidth = mainLeftWidth;
    
    const handleMouseMove = (e: MouseEvent) => {
      const container = document.querySelector('.main-layout-container');
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const deltaX = e.clientX - startX;
      const deltaPercent = (deltaX / containerRect.width) * 100;
      const newLeftWidth = Math.min(Math.max(startWidth + deltaPercent, 20), 70); // Limit between 20% and 70%
      
      setMainLeftWidth(newLeftWidth);
    };
    
    const handleMouseUp = () => {
      setIsMainDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [mainLeftWidth, isQuestionListVisible]);

  return (
    <div className="flex min-h-screen pt-16 dark:bg-gray-900 bg-white dark:text-white text-gray-900 transition-colors duration-200 main-layout-container">
      {/* Question List - Collapsible */}
      <div 
        className={`transition-all duration-300 ease-in-out section-with-guides ${
          isQuestionListVisible 
            ? 'border-r dark:border-gray-700 border-gray-200' 
            : 'w-0 overflow-hidden'
        }`}
        style={{ 
          width: isQuestionListVisible ? `${mainLeftWidth}%` : '0%' 
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="dark:text-gray-400 text-gray-600">Loading problems...</div>
          </div>
        ) : error ? (
          <div className="p-4">
            <div className="text-yellow-400 mb-2">{error}</div>
            <button 
              onClick={refreshProblems}
              className="text-purple-400 hover:text-purple-300"
            >
              Retry
            </button>
          </div>
        ) : (
          <QuestionList 
            questions={problems}
            selectedQuestion={selectedQuestion}
            onSelectQuestion={handleSelectQuestion}
          />
        )}
      </div>
      
      {/* Resizable Divider for Main Layout */}
      {isQuestionListVisible && (
        <div 
          className={`cursor-col-resize flex-shrink-0 resizable-divider ${
            isMainDragging ? 'dragging' : ''
          }`}
          onMouseDown={handleMainMouseDown}
          title="Drag to resize question list and details panels"
          style={{ width: '2px' }}
        />
      )}
      
      {/* Question Details - Full width when list is hidden */}
      <div 
        className={`transition-all duration-300 ease-in-out section-with-guides ${
          isQuestionListVisible ? '' : 'w-full'
        }`}
        style={{ 
          width: isQuestionListVisible ? `${100 - mainLeftWidth}%` : '100%' 
        }}
      >
        <QuestionDetails 
          question={selectedQuestion}
          onToggleQuestionList={toggleQuestionList}
          isQuestionListVisible={isQuestionListVisible}
        />
      </div>
    </div>
  );
};

function App() {
  // Suppress ResizeObserver errors globally
  useEffect(() => {
    const handleResizeObserverError = (e: ErrorEvent) => {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
      }
    };

    const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
      if (e.reason && e.reason.message && e.reason.message.includes('ResizeObserver')) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleResizeObserverError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleResizeObserverError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ProblemProvider>
            <NotificationProvider>
              <Router>
                <div className="min-h-screen flex flex-col transition-colors duration-200 page-structure-guides">
                  <Header />
                  <div className="flex-1 overflow-y-auto custom-scrollbar content-indent-guides">
                    <Routes>
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/profile" element={<UserProfilePage />} />
                      <Route path="/" element={<HomePage />} />
                    </Routes>
                  </div>
                </div>
              </Router>
            </NotificationProvider>
          </ProblemProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
