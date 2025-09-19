import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Question } from '../data/questions';

interface ProblemContextType {
  problems: Question[];
  isLoading: boolean;
  error: string | null;
  refreshProblems: () => Promise<void>;
  addProblem: (problem: Question) => void;
  updateProblem: (problem: Question) => void;
  removeProblem: (problemId: string) => void;
}

const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

interface ProblemProviderProps {
  children: ReactNode;
}

export const ProblemProvider: React.FC<ProblemProviderProps> = ({ children }) => {
  const [problems, setProblems] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProblems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/problems');
      
      if (response.ok) {
        const data = await response.json();
        const apiProblems = data.data.map((problem: any) => ({
          id: problem.id,
          title: problem.title,
          description: problem.description,
          difficulty: problem.difficulty,
          company: problem.company || '',
          categories: problem.categories || [],
          tags: problem.tags || [],
          lastReported: problem.lastReported || 'Unknown',
          examples: problem.examples || [],
          testCases: problem.testCases || [],
          template: problem.template || '',
          status: problem.status
        }));
        
        setProblems(apiProblems);
      } else {
        throw new Error('Failed to fetch problems');
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
      setError('Failed to load problems');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProblems = async () => {
    await fetchProblems();
  };

  const addProblem = (problem: Question) => {
    setProblems(prev => [problem, ...prev]);
  };

  const updateProblem = (updatedProblem: Question) => {
    setProblems(prev => prev.map(p => p.id === updatedProblem.id ? updatedProblem : p));
  };

  const removeProblem = (problemId: string) => {
    setProblems(prev => prev.filter(p => p.id !== problemId));
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const value: ProblemContextType = {
    problems,
    isLoading,
    error,
    refreshProblems,
    addProblem,
    updateProblem,
    removeProblem
  };

  return (
    <ProblemContext.Provider value={value}>
      {children}
    </ProblemContext.Provider>
  );
};

export const useProblems = () => {
  const context = useContext(ProblemContext);
  if (context === undefined) {
    throw new Error('useProblems must be used within a ProblemProvider');
  }
  return context;
};
