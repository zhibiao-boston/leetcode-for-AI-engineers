import { SubmissionModel, CreateSubmissionData, UpdateSubmissionData, SubmissionWithProblem } from '../models/Submission';
import { ProblemModel } from '../models/Problem';
import { UserModel } from '../models/User';

export interface SubmissionFilters {
  status?: string;
  problemId?: string;
  language?: string;
  limit?: number;
  offset?: number;
}

export interface SubmissionStats {
  total_submissions: number;
  accepted_submissions: number;
  success_rate: number;
  problems_solved: number;
  language_distribution: Record<string, number>;
  recent_submissions: SubmissionWithProblem[];
}

export class SubmissionService {
  // Create a new submission
  static async createSubmission(
    userId: string, 
    submissionData: Omit<CreateSubmissionData, 'user_id'>
  ): Promise<SubmissionWithProblem> {
    // Validate that the problem exists
    const problem = await ProblemModel.findById(submissionData.problem_id);
    if (!problem) {
      throw new Error('Problem not found');
    }

    // Validate that the user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create the submission
    const submission = await SubmissionModel.create({
      ...submissionData,
      user_id: userId
    });

    // Return submission with problem information
    return {
      ...submission,
      problem_title: problem.title,
      problem_difficulty: problem.difficulty
    };
  }

  // Get user's submission history
  static async getUserSubmissions(
    userId: string, 
    filters: SubmissionFilters = {}
  ): Promise<SubmissionWithProblem[]> {
    const { status, problemId, limit = 20, offset = 0 } = filters;
    
    return await SubmissionModel.findByUserId(userId, limit, offset, status, problemId);
  }

  // Get all submissions (admin only)
  static async getAllSubmissions(
    filters: SubmissionFilters = {}
  ): Promise<SubmissionWithProblem[]> {
    const { status, problemId, limit = 50, offset = 0 } = filters;
    
    return await SubmissionModel.findAll(limit, offset, status, undefined, problemId);
  }

  // Get submission by ID
  static async getSubmissionById(submissionId: string): Promise<SubmissionWithProblem | null> {
    const submission = await SubmissionModel.findById(submissionId);
    if (!submission) {
      return null;
    }

    // Get problem information
    const problem = await ProblemModel.findById(submission.problem_id);
    if (!problem) {
      throw new Error('Problem not found');
    }

    return {
      ...submission,
      problem_title: problem.title,
      problem_difficulty: problem.difficulty
    };
  }

  // Update submission (for status updates, etc.)
  static async updateSubmission(
    submissionId: string, 
    updateData: UpdateSubmissionData
  ): Promise<SubmissionWithProblem> {
    const submission = await SubmissionModel.update(submissionId, updateData);
    
    // Get problem information
    const problem = await ProblemModel.findById(submission.problem_id);
    if (!problem) {
      throw new Error('Problem not found');
    }

    return {
      ...submission,
      problem_title: problem.title,
      problem_difficulty: problem.difficulty
    };
  }

  // Delete submission
  static async deleteSubmission(submissionId: string): Promise<void> {
    await SubmissionModel.delete(submissionId);
  }

  // Get submission statistics for a user
  static async getUserSubmissionStats(userId: string): Promise<SubmissionStats> {
    const stats = await SubmissionModel.getUserStats(userId);
    const recentSubmissions = await SubmissionModel.findByUserId(userId, 5, 0);
    
    return {
      ...stats,
      recent_submissions: recentSubmissions
    };
  }

  // Get recent submissions across all users
  static async getRecentSubmissions(limit = 10): Promise<SubmissionWithProblem[]> {
    return await SubmissionModel.getRecentSubmissions(limit);
  }

  // Get submission count for a user
  static async getUserSubmissionCount(userId: string, status?: string): Promise<number> {
    return await SubmissionModel.countByUserId(userId, status);
  }

  // Validate submission data
  static validateSubmissionData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.problem_id) {
      errors.push('Problem ID is required');
    }

    if (!data.code || typeof data.code !== 'string' || data.code.trim().length === 0) {
      errors.push('Code is required and must be a non-empty string');
    }

    if (!data.language || typeof data.language !== 'string') {
      errors.push('Language is required');
    }

    const validLanguages = ['python', 'javascript', 'java', 'cpp', 'c', 'go', 'rust', 'typescript'];
    if (data.language && !validLanguages.includes(data.language.toLowerCase())) {
      errors.push(`Language must be one of: ${validLanguages.join(', ')}`);
    }

    if (!data.status) {
      errors.push('Status is required');
    }

    const validStatuses = [
      'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 
      'Compile Error', 'Memory Limit Exceeded', 'Output Limit Exceeded', 'Presentation Error'
    ];
    if (data.status && !validStatuses.includes(data.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    if (data.execution_time !== undefined && (typeof data.execution_time !== 'number' || data.execution_time < 0)) {
      errors.push('Execution time must be a non-negative number');
    }

    if (data.memory_usage !== undefined && (typeof data.memory_usage !== 'number' || data.memory_usage < 0)) {
      errors.push('Memory usage must be a non-negative number');
    }

    if (data.test_cases_passed !== undefined && (typeof data.test_cases_passed !== 'number' || data.test_cases_passed < 0)) {
      errors.push('Test cases passed must be a non-negative number');
    }

    if (data.total_test_cases !== undefined && (typeof data.total_test_cases !== 'number' || data.total_test_cases < 0)) {
      errors.push('Total test cases must be a non-negative number');
    }

    if (data.test_cases_passed !== undefined && data.total_test_cases !== undefined && 
        data.test_cases_passed > data.total_test_cases) {
      errors.push('Test cases passed cannot be greater than total test cases');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Format submission for API response
  static formatSubmissionResponse(submission: SubmissionWithProblem) {
    return {
      id: submission.id,
      problem_id: submission.problem_id,
      problem_title: submission.problem_title,
      problem_difficulty: submission.problem_difficulty,
      code: submission.code,
      language: submission.language,
      status: submission.status,
      execution_time: submission.execution_time,
      memory_usage: submission.memory_usage,
      test_cases_passed: submission.test_cases_passed,
      total_test_cases: submission.total_test_cases,
      submitted_at: submission.submitted_at,
      created_at: submission.created_at,
      updated_at: submission.updated_at
    };
  }

  // Format multiple submissions for API response
  static formatSubmissionsResponse(submissions: SubmissionWithProblem[]) {
    return submissions.map(submission => this.formatSubmissionResponse(submission));
  }
}
