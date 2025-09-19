import { Request, Response } from 'express';
import { AdminSolutionModel } from '../models/AdminSolution';
import { body, param, validationResult } from 'express-validator';

export class AdminSolutionController {
  // Get all solutions for a problem
  static async getSolutionsByProblem(req: Request, res: Response): Promise<void> {
    try {
      const { problemId } = req.params;
      const solutions = await AdminSolutionModel.findByProblemId(problemId);
      
      res.json({
        message: 'Solutions retrieved successfully',
        data: solutions
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve solutions' });
    }
  }

  // Create new admin solution
  static async createSolution(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const solutionData = {
        ...req.body,
        problem_id: req.params.problemId,
        created_by: req.user?.userId
      };

      const solution = await AdminSolutionModel.create(solutionData);
      
      res.status(201).json({
        message: 'Solution created successfully',
        data: solution
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create solution' });
    }
  }

  // Update admin solution
  static async updateSolution(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const updateData = req.body;

      const solution = await AdminSolutionModel.update(id, updateData);
      
      if (!solution) {
        res.status(404).json({ error: 'Solution not found' });
        return;
      }

      res.json({
        message: 'Solution updated successfully',
        data: solution
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update solution' });
    }
  }

  // Delete admin solution
  static async deleteSolution(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const deleted = await AdminSolutionModel.delete(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Solution not found' });
        return;
      }

      res.json({
        message: 'Solution deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete solution' });
    }
  }
}
