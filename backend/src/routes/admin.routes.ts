import { Router } from 'express';
import { ProblemController } from '../controllers/problem.controller';
import { SolutionController } from '../controllers/solution.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import { body, param } from 'express-validator';

const router = Router();

// Apply authentication and admin middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Problem Management Routes
router.get('/problems', ProblemController.getAllProblems);
router.get('/problems/:id', ProblemController.getProblemById);
router.post('/problems', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
  body('company').optional().isString(),
  body('categories').optional().isArray(),
  body('tags').optional().isArray(),
  body('status').optional().isIn(['draft', 'published'])
], ProblemController.createProblem);

router.put('/problems/:id', [
  param('id').notEmpty().withMessage('Invalid problem ID'),
  body('title').optional().notEmpty(),
  body('description').optional().notEmpty(),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
  body('company').optional().isString(),
  body('categories').optional().isArray(),
  body('tags').optional().isArray(),
  body('status').optional().isIn(['draft', 'published'])
], ProblemController.updateProblem);

router.delete('/problems/:id', [
  param('id').notEmpty().withMessage('Invalid problem ID')
], ProblemController.deleteProblem);

router.patch('/problems/:id/status', [
  param('id').notEmpty().withMessage('Invalid problem ID'),
  body('status').isIn(['draft', 'published', 'archived']).withMessage('Invalid status')
], ProblemController.updateProblemStatus);

// Solution Routes for Admin
router.post('/problems/:problemId/solutions', [
  param('problemId').notEmpty().withMessage('Invalid problem ID'),
  body('language').notEmpty().withMessage('Language is required'),
  body('code').notEmpty().withMessage('Code is required'),
  body('description').optional().isString(),
  body('is_published').optional().isBoolean()
], SolutionController.createSolution);

router.get('/problems/:problemId/solutions', [
  param('problemId').notEmpty().withMessage('Invalid problem ID')
], SolutionController.getAllSolutionsForProblem);

router.get('/problems/:problemId/solutions/:solutionId', [
  param('problemId').notEmpty().withMessage('Invalid problem ID'),
  param('solutionId').notEmpty().withMessage('Invalid solution ID')
], SolutionController.getSolutionById);

router.put('/problems/:problemId/solutions/:solutionId', [
  param('problemId').notEmpty().withMessage('Invalid problem ID'),
  param('solutionId').notEmpty().withMessage('Invalid solution ID'),
  body('language').optional().notEmpty().withMessage('Language cannot be empty'),
  body('code').optional().notEmpty().withMessage('Code cannot be empty'),
  body('description').optional().isString(),
  body('is_published').optional().isBoolean()
], SolutionController.updateSolution);

router.delete('/problems/:problemId/solutions/:solutionId', [
  param('problemId').notEmpty().withMessage('Invalid problem ID'),
  param('solutionId').notEmpty().withMessage('Invalid solution ID')
], SolutionController.deleteSolution);

export default router;
