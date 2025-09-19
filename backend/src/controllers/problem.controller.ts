import { Request, Response } from 'express';
import { ProblemModel } from '../models/Problem';
import { body, param, validationResult } from 'express-validator';

export class ProblemController {
  // Get all problems (admin can see draft, published, and archived)
  static async getAllProblems(req: Request, res: Response): Promise<void> {
    try {
      const { status, difficulty, company, category, tag, limit, offset } = req.query;
      const filters: any = {};
      
      if (status) filters.status = status;
      if (difficulty) filters.difficulty = difficulty;
      if (company) filters.company = company;
      if (category) filters.category = category;
      if (tag) filters.tag = tag;
      if (limit) filters.limit = parseInt(limit as string);
      if (offset) filters.offset = parseInt(offset as string);
      
      const problems = await ProblemModel.findAllWithSolutions(filters);
      res.json({
        message: 'Problems retrieved successfully',
        data: problems
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve problems' });
    }
  }

  // Get single problem with admin solutions
  static async getProblemById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const problem = await ProblemModel.findByIdWithSolutions(id);
      
      if (!problem) {
        res.status(404).json({ error: 'Problem not found' });
        return;
      }
      
      res.json({
        message: 'Problem retrieved successfully',
        data: problem
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve problem' });
    }
  }

  // Create new problem (admin only)
  static async createProblem(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const problemData = {
        ...req.body,
        created_by: req.user?.userId,
        status: req.body.status || 'draft'
      };

      const problem = await ProblemModel.create(problemData);
      
      res.status(201).json({
        message: 'Problem created successfully',
        data: problem
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create problem' });
    }
  }

  // Update problem (admin only)
  static async updateProblem(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const updateData = req.body;

      const problem = await ProblemModel.update(id, updateData);
      
      if (!problem) {
        res.status(404).json({ error: 'Problem not found' });
        return;
      }

      res.json({
        message: 'Problem updated successfully',
        data: problem
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update problem' });
    }
  }

  // Delete problem (admin only)
  static async deleteProblem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const deleted = await ProblemModel.delete(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Problem not found' });
        return;
      }

      res.json({
        message: 'Problem deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete problem' });
    }
  }

  // Update problem status
  static async updateProblemStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['draft', 'published', 'archived'].includes(status)) {
        res.status(400).json({ error: 'Invalid status. Must be draft, published, or archived' });
        return;
      }

      const updateData = { 
        status,
        published_at: status === 'published' ? new Date() : null
      };

      const problem = await ProblemModel.update(id, updateData);
      
      if (!problem) {
        res.status(404).json({ error: 'Problem not found' });
        return;
      }

      res.json({
        message: `Problem status updated to ${status} successfully`,
        data: problem
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update problem status' });
    }
  }
}
