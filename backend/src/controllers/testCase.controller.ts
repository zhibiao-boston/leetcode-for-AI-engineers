import { Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { TestCaseService } from '../services/testCase.service';

export class TestCaseController {
  // 获取题目的测试用例
  static async getTestCases(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { problemId } = req.params;
      const { type } = req.query;

      let testCases;
      if (type === 'quick') {
        testCases = await TestCaseService.getQuickTestCasesByProblemId(problemId);
      } else if (type === 'full') {
        testCases = await TestCaseService.getFullTestCasesByProblemId(problemId);
      } else {
        testCases = await TestCaseService.getTestCasesByProblemId(problemId);
      }

      res.json({
        success: true,
        data: testCases,
        count: testCases.length
      });
    } catch (error) {
      console.error('Error getting test cases:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 创建测试用例
  static async createTestCase(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { problemId } = req.params;
      const { input, expected_output, description, is_hidden, is_quick_test } = req.body;

      const testCase = await TestCaseService.createTestCase({
        problem_id: problemId,
        input,
        expected_output,
        description,
        is_hidden: is_hidden || false,
        is_quick_test: is_quick_test || false
      });

      res.status(201).json({
        success: true,
        data: testCase
      });
    } catch (error) {
      console.error('Error creating test case:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 更新测试用例
  static async updateTestCase(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { testCaseId } = req.params;
      const updates = req.body;

      const testCase = await TestCaseService.updateTestCase(testCaseId, updates);
      if (!testCase) {
        res.status(404).json({ error: 'Test case not found' });
        return;
      }

      res.json({
        success: true,
        data: testCase
      });
    } catch (error) {
      console.error('Error updating test case:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 删除测试用例
  static async deleteTestCase(req: Request, res: Response): Promise<void> {
    try {
      const { testCaseId } = req.params;

      const deleted = await TestCaseService.deleteTestCase(testCaseId);
      if (!deleted) {
        res.status(404).json({ error: 'Test case not found' });
        return;
      }

      res.json({
        success: true,
        message: 'Test case deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting test case:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 执行快速测试
  static async executeQuickTest(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { problemId } = req.params;
      const { code, language } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const result = await TestCaseService.executeQuickTest(userId, problemId, code, language);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error executing quick test:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 执行完整测试
  static async executeFullTest(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { problemId } = req.params;
      const { code, language } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const result = await TestCaseService.executeFullTest(userId, problemId, code, language);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error executing full test:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 获取执行记录
  static async getExecutionRecords(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { problemId } = req.params;
      const { limit = 50, offset = 0 } = req.query;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const records = await TestCaseService.getProblemExecutionRecords(
        problemId, 
        parseInt(limit as string), 
        parseInt(offset as string)
      );

      res.json({
        success: true,
        data: records,
        count: records.length
      });
    } catch (error) {
      console.error('Error getting execution records:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 获取用户执行统计
  static async getUserExecutionStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const stats = await TestCaseService.getUserExecutionStats(userId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting user execution stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

// 验证规则
export const getTestCasesValidation = [
  param('problemId').isString().notEmpty().withMessage('Problem ID is required'),
  query('type').optional().isIn(['quick', 'full']).withMessage('Type must be quick or full')
];

export const createTestCaseValidation = [
  param('problemId').isString().notEmpty().withMessage('Problem ID is required'),
  body('input').isString().notEmpty().withMessage('Input is required'),
  body('expected_output').isString().notEmpty().withMessage('Expected output is required'),
  body('description').optional().isString(),
  body('is_hidden').optional().isBoolean(),
  body('is_quick_test').optional().isBoolean()
];

export const updateTestCaseValidation = [
  param('testCaseId').isString().notEmpty().withMessage('Test case ID is required'),
  body('input').optional().isString(),
  body('expected_output').optional().isString(),
  body('description').optional().isString(),
  body('is_hidden').optional().isBoolean(),
  body('is_quick_test').optional().isBoolean()
];

export const deleteTestCaseValidation = [
  param('testCaseId').isString().notEmpty().withMessage('Test case ID is required')
];

export const executeQuickTestValidation = [
  param('problemId').isString().notEmpty().withMessage('Problem ID is required'),
  body('code').isString().notEmpty().withMessage('Code is required'),
  body('language').isString().notEmpty().withMessage('Language is required')
];

export const executeFullTestValidation = [
  param('problemId').isString().notEmpty().withMessage('Problem ID is required'),
  body('code').isString().notEmpty().withMessage('Code is required'),
  body('language').isString().notEmpty().withMessage('Language is required')
];

export const getExecutionRecordsValidation = [
  param('problemId').isString().notEmpty().withMessage('Problem ID is required'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative')
];
