import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Question } from '../data/questions';

export interface AdminSolution {
  id: string;
  problem_id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  complexity?: string;
  explanation?: string;
  time_complexity?: string;
  space_complexity?: string;
  is_published: boolean;
  created_by?: string;
  created_by_name?: string;
  created_at: string | Date;
  updated_at: string | Date;
}

interface ProblemContextType {
  problems: Question[];
  isLoading: boolean;
  error: string | null;
  refreshProblems: () => Promise<void>;
  addProblem: (problem: Question) => void;
  updateProblem: (problem: Question) => void;
  removeProblem: (problemId: string) => void;
  addSolutionToProblem: (problemId: string, solution: AdminSolution) => void;
  updateSolutionInProblem: (problemId: string, solution: AdminSolution) => void;
  removeSolutionFromProblem: (problemId: string, solutionId: string) => void;
  getPublishedSolutionsForProblem: (problemId: string) => Promise<AdminSolution[]>;
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

  // Solution management methods
  const addSolutionToProblem = (problemId: string, solution: AdminSolution) => {
    // This would update the problem's solutions array in a real implementation
    // For now, we'll just refresh the problems to get updated data
    refreshProblems();
  };

  const updateSolutionInProblem = (problemId: string, solution: AdminSolution) => {
    // This would update the specific solution in the problem's solutions array
    // For now, we'll just refresh the problems to get updated data
    refreshProblems();
  };

  const removeSolutionFromProblem = (problemId: string, solutionId: string) => {
    // This would remove the specific solution from the problem's solutions array
    // For now, we'll just refresh the problems to get updated data
    refreshProblems();
  };

  const getPublishedSolutionsForProblem = async (problemId: string): Promise<AdminSolution[]> => {
    try {
      const response = await fetch(`http://localhost:5000/api/problems/${problemId}/solutions/published`);
      if (response.ok) {
        const data = await response.json();
        return data.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching published solutions:', error);
      return [];
    }
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
    removeProblem,
    addSolutionToProblem,
    updateSolutionInProblem,
    removeSolutionFromProblem,
    getPublishedSolutionsForProblem
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
