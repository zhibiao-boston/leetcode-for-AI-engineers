import { Router } from 'express';
import { ProblemModel } from '../models/Problem';

const router = Router();

// Public route to get all published problems (for home page)
router.get('/problems', async (req, res) => {
  try {
    const { difficulty, company, category, tag, limit, offset } = req.query;
    const filters: any = {
      status: 'published' // Only published problems
    };
    
    if (difficulty) filters.difficulty = difficulty;
    if (company) filters.company = company;
    if (category) filters.category = category;
    if (tag) filters.tag = tag;
    if (limit) filters.limit = parseInt(limit as string);
    if (offset) filters.offset = parseInt(offset as string);
    
    const problems = await ProblemModel.findAllWithSolutions(filters);
    
    res.json({
      message: 'Published problems retrieved successfully',
      data: problems
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve problems' });
  }
});

// Public route to get single published problem
router.get('/problems/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await ProblemModel.findByIdWithSolutions(id);
    
    if (!problem) {
      res.status(404).json({ error: 'Problem not found' });
      return;
    }
    
    // Only return published problems to public
    if (problem.status !== 'published') {
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
});

export default router;
