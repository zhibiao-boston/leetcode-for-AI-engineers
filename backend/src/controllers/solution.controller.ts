import { Request, Response } from 'express';
import { AdminSolutionModel } from '../models/AdminSolution';

export class SolutionController {
  /**
   * Create a new solution for a problem
   */
  static async createSolution(req: Request, res: Response): Promise<void> {
    try {
      const { problemId } = req.params;
      const { language, code, description, is_published = false } = req.body;

      // Validate required fields
      if (!language || !code) {
        res.status(400).json({
          error: 'Language and code are required'
        });
        return;
      }

      // Create solution data
      const solutionData = {
        problem_id: problemId,
        title: `${language.charAt(0).toUpperCase() + language.slice(1)} Solution`, // Auto-generate title
        language,
        code,
        description: description || '',
        is_published: Boolean(is_published),
        created_by: req.user?.userId || '1' // Default to admin user
      };

      const solution = await AdminSolutionModel.create(solutionData);

      res.status(201).json({
        message: 'Solution created successfully',
        data: solution
      });
    } catch (error) {
      console.error('Failed to create solution:', error);
      res.status(500).json({
        error: 'Failed to create solution'
      });
    }
  }

  /**
   * Get all solutions for a problem (admin view)
   */
  static async getAllSolutionsForProblem(req: Request, res: Response): Promise<void> {
    try {
      const { problemId } = req.params;

      const solutions = await AdminSolutionModel.findByProblemId(problemId);

      res.json({
        message: 'Solutions retrieved successfully',
        data: solutions
      });
    } catch (error) {
      console.error('Failed to get solutions:', error);
      res.status(500).json({
        error: 'Failed to get solutions'
      });
    }
  }

  /**
   * Get a specific solution by ID
   */
  static async getSolutionById(req: Request, res: Response): Promise<void> {
    try {
      const { problemId, solutionId } = req.params;

      const solution = await AdminSolutionModel.findById(solutionId);

      if (!solution) {
        res.status(404).json({
          error: 'Solution not found'
        });
        return;
      }

      // Verify the solution belongs to the specified problem
      if (solution.problem_id !== problemId) {
        res.status(400).json({
          error: 'Solution does not belong to the specified problem'
        });
        return;
      }

      res.json({
        message: 'Solution retrieved successfully',
        data: solution
      });
    } catch (error) {
      console.error('Failed to get solution:', error);
      res.status(500).json({
        error: 'Failed to get solution'
      });
    }
  }

  /**
   * Update a solution
   */
  static async updateSolution(req: Request, res: Response): Promise<void> {
    try {
      const { problemId, solutionId } = req.params;
      const updateData = req.body;

      // Get existing solution to verify it belongs to the problem
      const existingSolution = await AdminSolutionModel.findById(solutionId);
      if (!existingSolution) {
        res.status(404).json({
          error: 'Solution not found'
        });
        return;
      }

      if (existingSolution.problem_id !== problemId) {
        res.status(400).json({
          error: 'Solution does not belong to the specified problem'
        });
        return;
      }

      // Prepare update data
      const solutionData: any = {};
      if (updateData.language !== undefined) solutionData.language = updateData.language;
      if (updateData.code !== undefined) solutionData.code = updateData.code;
      if (updateData.description !== undefined) solutionData.description = updateData.description;
      if (updateData.is_published !== undefined) solutionData.is_published = Boolean(updateData.is_published);

      const updatedSolution = await AdminSolutionModel.update(solutionId, solutionData);

      res.json({
        message: 'Solution updated successfully',
        data: updatedSolution
      });
    } catch (error) {
      console.error('Failed to update solution:', error);
      res.status(500).json({
        error: 'Failed to update solution'
      });
    }
  }

  /**
   * Delete a solution
   */
  static async deleteSolution(req: Request, res: Response): Promise<void> {
    try {
      const { problemId, solutionId } = req.params;

      // Get existing solution to verify it belongs to the problem
      const existingSolution = await AdminSolutionModel.findById(solutionId);
      if (!existingSolution) {
        res.status(404).json({
          error: 'Solution not found'
        });
        return;
      }

      if (existingSolution.problem_id !== problemId) {
        res.status(400).json({
          error: 'Solution does not belong to the specified problem'
        });
        return;
      }

      const success = await AdminSolutionModel.delete(solutionId);

      if (!success) {
        res.status(500).json({
          error: 'Failed to delete solution'
        });
        return;
      }

      res.json({
        message: 'Solution deleted successfully'
      });
    } catch (error) {
      console.error('Failed to delete solution:', error);
      res.status(500).json({
        error: 'Failed to delete solution'
      });
    }
  }

  /**
   * Get published solutions for a problem (public endpoint)
   */
  static async getPublishedSolutionsForProblem(req: Request, res: Response): Promise<void> {
    try {
      const { problemId } = req.params;

      const allSolutions = await AdminSolutionModel.findByProblemId(problemId);
      const publishedSolutions = allSolutions.filter(solution => solution.is_published);

      res.json({
        message: 'Published solutions retrieved successfully',
        data: publishedSolutions
      });
    } catch (error) {
      console.error('Failed to get published solutions:', error);
      res.status(500).json({
        error: 'Failed to get published solutions'
      });
    }
  }
}
