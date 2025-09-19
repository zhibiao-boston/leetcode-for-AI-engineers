import { pool } from '../config/database';
import { mockSubmissions } from '../config/database-mock';

export interface Submission {
  id: string;
  user_id: string;
  problem_id: string;
  code: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compile Error' | 'Memory Limit Exceeded' | 'Output Limit Exceeded' | 'Presentation Error';
  execution_time?: number;
  memory_usage?: number;
  test_cases_passed: number;
  total_test_cases: number;
  submitted_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateSubmissionData {
  user_id: string;
  problem_id: string;
  code: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compile Error' | 'Memory Limit Exceeded' | 'Output Limit Exceeded' | 'Presentation Error';
  execution_time?: number;
  memory_usage?: number;
  test_cases_passed?: number;
  total_test_cases?: number;
}

export interface UpdateSubmissionData {
  status?: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compile Error' | 'Memory Limit Exceeded' | 'Output Limit Exceeded' | 'Presentation Error';
  execution_time?: number;
  memory_usage?: number;
  test_cases_passed?: number;
  total_test_cases?: number;
}

export interface SubmissionWithProblem extends Submission {
  problem_title: string;
  problem_difficulty: string;
}

export class SubmissionModel {
  // Create a new submission
  static async create(submissionData: CreateSubmissionData): Promise<Submission> {
    const { 
      user_id, 
      problem_id, 
      code, 
      language, 
      status, 
      execution_time, 
      memory_usage, 
      test_cases_passed = 0, 
      total_test_cases = 0 
    } = submissionData;
    
    // Use mock data instead of database
    const newSubmission = {
      id: (mockSubmissions.length + 1).toString(),
      user_id,
      problem_id,
      code,
      language,
      status,
      execution_time,
      memory_usage,
      test_cases_passed,
      total_test_cases,
      submitted_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    };
    
    mockSubmissions.push(newSubmission as any);
    return newSubmission as Submission;
  }

  // Find submission by ID
  static async findById(id: string): Promise<Submission | null> {
    // Use mock data instead of database
    const submission = mockSubmissions.find(s => s.id === id);
    return submission as Submission || null;
  }

  // Get submissions by user ID with pagination
  static async findByUserId(
    userId: string, 
    limit = 20, 
    offset = 0,
    status?: string,
    problemId?: string
  ): Promise<SubmissionWithProblem[]> {
    // Use mock data instead of database
    let filteredSubmissions = mockSubmissions.filter(s => s.user_id === userId);
    
    if (status) {
      filteredSubmissions = filteredSubmissions.filter(s => s.status === status);
    }
    
    if (problemId) {
      filteredSubmissions = filteredSubmissions.filter(s => s.problem_id === problemId);
    }
    
    // Sort by submitted_at descending
    filteredSubmissions.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
    
    // Apply pagination
    const paginatedSubmissions = filteredSubmissions.slice(offset, offset + limit);
    
    // Add problem information (mock data)
    return paginatedSubmissions.map(submission => ({
      ...submission,
      problem_title: `Problem ${submission.problem_id}`,
      problem_difficulty: 'medium'
    })) as SubmissionWithProblem[];
  }

  // Get all submissions (admin only) with pagination
  static async findAll(
    limit = 50, 
    offset = 0,
    status?: string,
    userId?: string,
    problemId?: string
  ): Promise<SubmissionWithProblem[]> {
    // Use mock data instead of database
    let filteredSubmissions = [...mockSubmissions];
    
    if (status) {
      filteredSubmissions = filteredSubmissions.filter(s => s.status === status);
    }
    
    if (userId) {
      filteredSubmissions = filteredSubmissions.filter(s => s.user_id === userId);
    }
    
    if (problemId) {
      filteredSubmissions = filteredSubmissions.filter(s => s.problem_id === problemId);
    }
    
    // Sort by submitted_at descending
    filteredSubmissions.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
    
    // Apply pagination
    const paginatedSubmissions = filteredSubmissions.slice(offset, offset + limit);
    
    // Add problem information (mock data)
    return paginatedSubmissions.map(submission => ({
      ...submission,
      problem_title: `Problem ${submission.problem_id}`,
      problem_difficulty: 'medium'
    })) as SubmissionWithProblem[];
  }

  // Update submission
  static async update(id: string, submissionData: UpdateSubmissionData): Promise<Submission> {
    // Use mock data instead of database
    const submissionIndex = mockSubmissions.findIndex(s => s.id === id);
    if (submissionIndex === -1) {
      throw new Error('Submission not found');
    }
    
    // Update the mock submission data
    mockSubmissions[submissionIndex] = {
      ...mockSubmissions[submissionIndex],
      ...submissionData,
      updated_at: new Date()
    } as any;
    
    return mockSubmissions[submissionIndex] as Submission;
  }

  // Delete submission
  static async delete(id: string): Promise<void> {
    // Use mock data instead of database
    const submissionIndex = mockSubmissions.findIndex(s => s.id === id);
    if (submissionIndex === -1) {
      throw new Error('Submission not found');
    }
    
    mockSubmissions.splice(submissionIndex, 1);
  }

  // Count submissions by user
  static async countByUserId(userId: string, status?: string): Promise<number> {
    // Use mock data instead of database
    let filteredSubmissions = mockSubmissions.filter(s => s.user_id === userId);
    
    if (status) {
      filteredSubmissions = filteredSubmissions.filter(s => s.status === status);
    }
    
    return filteredSubmissions.length;
  }

  // Get submission statistics for a user
  static async getUserStats(userId: string): Promise<{
    total_submissions: number;
    accepted_submissions: number;
    success_rate: number;
    problems_solved: number;
    language_distribution: Record<string, number>;
  }> {
    // Use mock data instead of database
    const userSubmissions = mockSubmissions.filter(s => s.user_id === userId);
    
    const total_submissions = userSubmissions.length;
    const accepted_submissions = userSubmissions.filter(s => s.status === 'Accepted').length;
    const success_rate = total_submissions > 0 ? (accepted_submissions / total_submissions) * 100 : 0;
    const problems_solved = new Set(userSubmissions.filter(s => s.status === 'Accepted').map(s => s.problem_id)).size;
    
    const language_distribution: Record<string, number> = {};
    userSubmissions.forEach(s => {
      language_distribution[s.language] = (language_distribution[s.language] || 0) + 1;
    });
    
    return {
      total_submissions,
      accepted_submissions,
      success_rate: Math.round(success_rate * 100) / 100,
      problems_solved,
      language_distribution
    };
  }

  // Get recent submissions (last 24 hours)
  static async getRecentSubmissions(limit = 10): Promise<SubmissionWithProblem[]> {
    // Use mock data instead of database
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const recentSubmissions = mockSubmissions
      .filter(s => new Date(s.submitted_at) > oneDayAgo)
      .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
      .slice(0, limit);
    
    return recentSubmissions.map(submission => ({
      ...submission,
      problem_title: `Problem ${submission.problem_id}`,
      problem_difficulty: 'medium'
    })) as SubmissionWithProblem[];
  }
}
