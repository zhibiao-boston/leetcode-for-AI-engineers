import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { sampleQuestions, Question } from './data/questions';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import QuestionList from './components/QuestionList';
import QuestionDetails from './components/QuestionDetails';
import AdminDashboard from './components/AdminDashboard';
import UserProfilePage from './components/UserProfilePage';

function App() {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(sampleQuestions[0]);
  const [isQuestionListVisible, setIsQuestionListVisible] = useState(true);

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
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <Header />
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/" element={
              <div className="flex h-screen pt-16">
                {/* Question List - Collapsible */}
                <div className={`transition-all duration-300 ease-in-out ${
                  isQuestionListVisible 
                    ? 'w-2/5 border-r border-gray-700' 
                    : 'w-0 overflow-hidden'
                }`}>
                  <QuestionList 
                    questions={sampleQuestions}
                    selectedQuestion={selectedQuestion}
                    onSelectQuestion={handleSelectQuestion}
                  />
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
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
