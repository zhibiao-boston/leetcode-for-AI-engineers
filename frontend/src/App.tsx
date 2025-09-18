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
