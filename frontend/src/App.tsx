import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { sampleQuestions, Question } from './data/questions';
import { AuthProvider } from './contexts/AuthContext';
import { ProblemProvider, useProblems } from './contexts/ProblemContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/Header';
import QuestionList from './components/QuestionList';
import QuestionDetails from './components/QuestionDetails';
import AdminDashboard from './components/AdminDashboard';
import UserProfilePage from './components/UserProfilePage';

// Home Page Component that uses ProblemContext
const HomePage: React.FC = () => {
  const { problems, isLoading, error, refreshProblems } = useProblems();
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isQuestionListVisible, setIsQuestionListVisible] = useState(true);

  // Set first question as selected when problems load
  useEffect(() => {
    if (!selectedQuestion && problems.length > 0) {
      setSelectedQuestion(problems[0]);
    }
  }, [problems, selectedQuestion]);

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

  // Handle question selection and auto-hide list
  const handleSelectQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setIsQuestionListVisible(false); // Auto-hide list when question is selected
  };

  // Toggle question list visibility
  const toggleQuestionList = () => {
    setIsQuestionListVisible(!isQuestionListVisible);
  };

  return (
    <div className="flex h-screen pt-16">
      {/* Question List - Collapsible */}
      <div className={`transition-all duration-300 ease-in-out ${
        isQuestionListVisible 
          ? 'w-2/5 border-r border-gray-700' 
          : 'w-0 overflow-hidden'
      }`}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Loading problems...</div>
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
      
      {/* Question Details - Full width when list is hidden */}
      <div className={`transition-all duration-300 ease-in-out ${
        isQuestionListVisible ? 'w-3/5' : 'w-full'
      }`}>
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
    <AuthProvider>
      <ProblemProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-gray-900 text-white">
              <Header />
              <Routes>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/" element={<HomePage />} />
              </Routes>
            </div>
          </Router>
        </NotificationProvider>
      </ProblemProvider>
    </AuthProvider>
  );
}

export default App;
