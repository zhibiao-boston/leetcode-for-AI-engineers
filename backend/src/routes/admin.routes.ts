import { Router } from 'express';
import { ProblemController } from '../controllers/problem.controller';
import { AdminSolutionController } from '../controllers/admin-solution.controller';
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
  param('id').isUUID().withMessage('Invalid problem ID'),
  body('title').optional().notEmpty(),
  body('description').optional().notEmpty(),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
  body('company').optional().isString(),
  body('categories').optional().isArray(),
  body('tags').optional().isArray(),
  body('status').optional().isIn(['draft', 'published'])
], ProblemController.updateProblem);

router.delete('/problems/:id', [
  param('id').isUUID().withMessage('Invalid problem ID')
], ProblemController.deleteProblem);

router.patch('/problems/:id/status', [
  param('id').isUUID().withMessage('Invalid problem ID'),
  body('status').isIn(['draft', 'published']).withMessage('Invalid status')
], ProblemController.toggleProblemStatus);

// Admin Solution Management Routes
router.get('/problems/:problemId/solutions', AdminSolutionController.getSolutionsByProblem);
router.post('/problems/:problemId/solutions', [
  param('problemId').isUUID().withMessage('Invalid problem ID'),
  body('code').notEmpty().withMessage('Code is required'),
  body('explanation').optional().isString(),
  body('time_complexity').optional().isString(),
  body('space_complexity').optional().isString()
], AdminSolutionController.createSolution);

router.put('/solutions/:id', [
  param('id').isUUID().withMessage('Invalid solution ID'),
  body('code').optional().notEmpty(),
  body('explanation').optional().isString(),
  body('time_complexity').optional().isString(),
  body('space_complexity').optional().isString()
], AdminSolutionController.updateSolution);

router.delete('/solutions/:id', [
  param('id').isUUID().withMessage('Invalid solution ID')
], AdminSolutionController.deleteSolution);

export default router;
