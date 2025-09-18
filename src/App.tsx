import React, { useState } from 'react';
import { sampleQuestions, Question } from './data/questions';
import Header from './components/Header';
import QuestionList from './components/QuestionList';
import QuestionDetails from './components/QuestionDetails';

function App() {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(sampleQuestions[0]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
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
    </div>
  );
}

export default App;
