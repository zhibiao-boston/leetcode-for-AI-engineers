import React from 'react';
import { Question } from '../data/questions';

interface QuestionListProps {
  questions: Question[];
  selectedQuestion: Question | null;
  onSelectQuestion: (question: Question) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ 
  questions, 
  selectedQuestion, 
  onSelectQuestion 
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Removed filter section - showing only generated ML/AI problems */}

      {/* Question Table */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full">
          <thead className="dark:bg-gray-800 bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                Categories
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                Last Reported
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700 divide-gray-200">
            {questions.map((question) => (
              <tr
                key={question.id}
                onClick={() => onSelectQuestion(question)}
                className={`cursor-pointer transition-colors duration-200 ${
                  selectedQuestion?.id === question.id
                    ? 'bg-blue-900/30 hover:bg-blue-900/40'
                    : 'hover:dark:bg-gray-800 hover:bg-gray-100'
                }`}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium dark:text-white text-gray-900">{question.title}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {question.categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium dark:bg-gray-700 dark:text-gray-300 bg-gray-200 text-gray-700"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm dark:text-gray-400 text-gray-500">{question.lastReported}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionList;
