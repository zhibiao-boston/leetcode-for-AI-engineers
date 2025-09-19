import { Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { SubmissionService } from '../services/submission.service';
import { UserModel } from '../models/User';

export class SubmissionController {
  // Validation rules for creating a submission
  static createSubmissionValidation = [
    body('problem_id')
      .notEmpty()
      .withMessage('Problem ID is required'),
    body('code')
      .isString()
      .isLength({ min: 1 })
      .withMessage('Code is required and must be a non-empty string'),
    body('language')
      .isString()
      .isIn(['python', 'javascript', 'java', 'cpp', 'c', 'go', 'rust', 'typescript'])
      .withMessage('Language must be one of: python, javascript, java, cpp, c, go, rust, typescript'),
    body('status')
      .isString()
      .isIn(['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compile Error', 'Memory Limit Exceeded', 'Output Limit Exceeded', 'Presentation Error'])
      .withMessage('Status must be one of: Accepted, Wrong Answer, Time Limit Exceeded, Runtime Error, Compile Error, Memory Limit Exceeded, Output Limit Exceeded, Presentation Error'),
    body('execution_time')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Execution time must be a non-negative integer'),
    body('memory_usage')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Memory usage must be a non-negative number'),
    body('test_cases_passed')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Test cases passed must be a non-negative integer'),
    body('total_test_cases')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Total test cases must be a non-negative integer')
  ];

  // Validation rules for updating a submission
  static updateSubmissionValidation = [
    param('id')
      .isUUID()
      .withMessage('Invalid submission ID'),
    body('status')
      .optional()
      .isString()
      .isIn(['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compile Error', 'Memory Limit Exceeded', 'Output Limit Exceeded', 'Presentation Error'])
      .withMessage('Status must be one of: Accepted, Wrong Answer, Time Limit Exceeded, Runtime Error, Compile Error, Memory Limit Exceeded, Output Limit Exceeded, Presentation Error'),
    body('execution_time')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Execution time must be a non-negative integer'),
    body('memory_usage')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Memory usage must be a non-negative number'),
    body('test_cases_passed')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Test cases passed must be a non-negative integer'),
    body('total_test_cases')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Total test cases must be a non-negative integer')
  ];

  // Validation rules for query parameters
  static getSubmissionsValidation = [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be a non-negative integer'),
    query('status')
      .optional()
      .isString()
      .isIn(['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compile Error', 'Memory Limit Exceeded', 'Output Limit Exceeded', 'Presentation Error'])
      .withMessage('Invalid status filter'),
    query('problem_id')
      .optional()
      .isString()
      .withMessage('Invalid problem ID filter'),
    query('language')
      .optional()
      .isString()
      .isIn(['python', 'javascript', 'java', 'cpp', 'c', 'go', 'rust', 'typescript'])
      .withMessage('Invalid language filter')
  ];

  // Create a new submission
  static async createSubmission(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const submissionData = {
        problem_id: req.body.problem_id,
        code: req.body.code,
        language: req.body.language,
        status: req.body.status,
        execution_time: req.body.execution_time,
        memory_usage: req.body.memory_usage,
        test_cases_passed: req.body.test_cases_passed,
        total_test_cases: req.body.total_test_cases
      };

      // Additional validation
      const validation = SubmissionService.validateSubmissionData(submissionData);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        });
        return;
      }

      const submission = await SubmissionService.createSubmission(userId, submissionData);
      const formattedSubmission = SubmissionService.formatSubmissionResponse(submission);

      res.status(201).json({
        success: true,
        message: 'Submission created successfully',
        data: formattedSubmission
      });
    } catch (error) {
      console.error('Error creating submission:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get user's submission history
  static async getUserSubmissions(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const filters = {
        status: req.query.status as string,
        problemId: req.query.problem_id as string,
        language: req.query.language as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0
      };

      const submissions = await SubmissionService.getUserSubmissions(userId, filters);
      const formattedSubmissions = SubmissionService.formatSubmissionsResponse(submissions);

      res.status(200).json({
        success: true,
        message: 'Submissions retrieved successfully',
        data: formattedSubmissions,
        pagination: {
          limit: filters.limit,
          offset: filters.offset,
          total: await SubmissionService.getUserSubmissionCount(userId, filters.status)
        }
      });
    } catch (error) {
      console.error('Error getting user submissions:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get all submissions (admin only)
  static async getAllSubmissions(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const user = (req as any).user;
      if (!user || user.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
        return;
      }

      const filters = {
        status: req.query.status as string,
        problemId: req.query.problem_id as string,
        language: req.query.language as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0
      };

      const submissions = await SubmissionService.getAllSubmissions(filters);
      const formattedSubmissions = SubmissionService.formatSubmissionsResponse(submissions);

      res.status(200).json({
        success: true,
        message: 'All submissions retrieved successfully',
        data: formattedSubmissions,
        pagination: {
          limit: filters.limit,
          offset: filters.offset
        }
      });
    } catch (error) {
      console.error('Error getting all submissions:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get submission by ID
  static async getSubmissionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;

      const submission = await SubmissionService.getSubmissionById(id);
      if (!submission) {
        res.status(404).json({
          success: false,
          message: 'Submission not found'
        });
        return;
      }

      // Check if user can access this submission
      if (userRole !== 'admin' && submission.user_id !== userId) {
        res.status(403).json({
          success: false,
          message: 'Access denied'
        });
        return;
      }

      const formattedSubmission = SubmissionService.formatSubmissionResponse(submission);

      res.status(200).json({
        success: true,
        message: 'Submission retrieved successfully',
        data: formattedSubmission
      });
    } catch (error) {
      console.error('Error getting submission by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update submission
  static async updateSubmission(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const { id } = req.params;
      const userId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;

      // Check if submission exists and user has permission
      const existingSubmission = await SubmissionService.getSubmissionById(id);
      if (!existingSubmission) {
        res.status(404).json({
          success: false,
          message: 'Submission not found'
        });
        return;
      }

      if (userRole !== 'admin' && existingSubmission.user_id !== userId) {
        res.status(403).json({
          success: false,
          message: 'Access denied'
        });
        return;
      }

      const updateData = {
        status: req.body.status,
        execution_time: req.body.execution_time,
        memory_usage: req.body.memory_usage,
        test_cases_passed: req.body.test_cases_passed,
        total_test_cases: req.body.total_test_cases
      };

      const submission = await SubmissionService.updateSubmission(id, updateData);
      const formattedSubmission = SubmissionService.formatSubmissionResponse(submission);

      res.status(200).json({
        success: true,
        message: 'Submission updated successfully',
        data: formattedSubmission
      });
    } catch (error) {
      console.error('Error updating submission:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete submission
  static async deleteSubmission(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;

      // Check if submission exists and user has permission
      const existingSubmission = await SubmissionService.getSubmissionById(id);
      if (!existingSubmission) {
        res.status(404).json({
          success: false,
          message: 'Submission not found'
        });
        return;
      }

      if (userRole !== 'admin' && existingSubmission.user_id !== userId) {
        res.status(403).json({
          success: false,
          message: 'Access denied'
        });
        return;
      }

      await SubmissionService.deleteSubmission(id);

      res.status(200).json({
        success: true,
        message: 'Submission deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting submission:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get user submission statistics
  static async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const stats = await SubmissionService.getUserSubmissionStats(userId);

      res.status(200).json({
        success: true,
        message: 'User submission statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting user stats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get recent submissions
  static async getRecentSubmissions(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      if (limit < 1 || limit > 50) {
        res.status(400).json({
          success: false,
          message: 'Limit must be between 1 and 50'
        });
        return;
      }

      const submissions = await SubmissionService.getRecentSubmissions(limit);
      const formattedSubmissions = SubmissionService.formatSubmissionsResponse(submissions);

      res.status(200).json({
        success: true,
        message: 'Recent submissions retrieved successfully',
        data: formattedSubmissions
      });
    } catch (error) {
      console.error('Error getting recent submissions:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
