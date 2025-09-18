import { pool } from '../config/database';

export interface UserSolution {
  id: string;
  problem_id: string;
  user_id: string;
  code: string;
  output?: string;
  error?: string;
  execution_time?: number;
  status: 'completed' | 'in_progress' | 'failed';
  created_at: Date;
  updated_at: Date;
}

export interface AdminSolution {
  id: string;
  problem_id: string;
  code: string;
  explanation?: string;
  time_complexity?: string;
  space_complexity?: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserSolutionData {
  problem_id: string;
  user_id: string;
  code: string;
  output?: string;
  error?: string;
  execution_time?: number;
  status?: 'completed' | 'in_progress' | 'failed';
}

export interface CreateAdminSolutionData {
  problem_id: string;
  code: string;
  explanation?: string;
  time_complexity?: string;
  space_complexity?: string;
  created_by: string;
}

export class UserSolutionModel {
  // Create a new user solution
  static async create(solutionData: CreateUserSolutionData): Promise<UserSolution> {
    const { problem_id, user_id, code, output, error, execution_time, status = 'in_progress' } = solutionData;
    
    const query = `
      INSERT INTO solutions (problem_id, user_id, code, output, error, execution_time, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [problem_id, user_id, code, output, error, execution_time, status];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Find solution by ID
  static async findById(id: string): Promise<UserSolution | null> {
    const query = 'SELECT * FROM solutions WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Get solutions by user
  static async findByUser(user_id: string, limit = 50, offset = 0): Promise<UserSolution[]> {
    const query = `
      SELECT s.*, p.title as problem_title, p.difficulty as problem_difficulty
      FROM solutions s
      JOIN problems p ON s.problem_id = p.id
      WHERE s.user_id = $1
      ORDER BY s.updated_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [user_id, limit, offset]);
    return result.rows;
  }

  // Get solutions by problem
  static async findByProblem(problem_id: string, limit = 50, offset = 0): Promise<UserSolution[]> {
    const query = `
      SELECT s.*, u.name as user_name, u.email as user_email
      FROM solutions s
      JOIN users u ON s.user_id = u.id
      WHERE s.problem_id = $1
      ORDER BY s.updated_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [problem_id, limit, offset]);
    return result.rows;
  }

  // Get user's solution for a specific problem
  static async findByUserAndProblem(user_id: string, problem_id: string): Promise<UserSolution[]> {
    const query = `
      SELECT * FROM solutions 
      WHERE user_id = $1 AND problem_id = $2
      ORDER BY updated_at DESC
    `;
    
    const result = await pool.query(query, [user_id, problem_id]);
    return result.rows;
  }

  // Update solution
  static async update(id: string, updateData: Partial<CreateUserSolutionData>): Promise<UserSolution> {
    const fields = Object.keys(updateData).map((key, index) => `${key} = $${index + 2}`);
    const values = Object.values(updateData);
    
    const query = `
      UPDATE solutions 
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, ...values]);
    return result.rows[0];
  }

  // Delete solution
  static async delete(id: string): Promise<void> {
    const query = 'DELETE FROM solutions WHERE id = $1';
    await pool.query(query, [id]);
  }

  // Count solutions by user
  static async countByUser(user_id: string): Promise<number> {
    const query = 'SELECT COUNT(*) FROM solutions WHERE user_id = $1';
    const result = await pool.query(query, [user_id]);
    return parseInt(result.rows[0].count);
  }

  // Count solutions by problem
  static async countByProblem(problem_id: string): Promise<number> {
    const query = 'SELECT COUNT(*) FROM solutions WHERE problem_id = $1';
    const result = await pool.query(query, [problem_id]);
    return parseInt(result.rows[0].count);
  }

  // Get solution statistics
  static async getStatistics(user_id?: string): Promise<{
    total: number;
    completed: number;
    in_progress: number;
    failed: number;
  }> {
    let query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed
      FROM solutions
    `;
    
    const values: any[] = [];
    if (user_id) {
      query += ' WHERE user_id = $1';
      values.push(user_id);
    }
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

export class AdminSolutionModel {
  // Create a new admin solution
  static async create(solutionData: CreateAdminSolutionData): Promise<AdminSolution> {
    const { problem_id, code, explanation, time_complexity, space_complexity, created_by } = solutionData;
    
    const query = `
      INSERT INTO admin_solutions (problem_id, code, explanation, time_complexity, space_complexity, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [problem_id, code, explanation, time_complexity, space_complexity, created_by];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Find admin solution by ID
  static async findById(id: string): Promise<AdminSolution | null> {
    const query = 'SELECT * FROM admin_solutions WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Get admin solutions by problem
  static async findByProblem(problem_id: string): Promise<AdminSolution[]> {
    const query = `
      SELECT as.*, u.name as created_by_name
      FROM admin_solutions as
      JOIN users u ON as.created_by = u.id
      WHERE as.problem_id = $1
      ORDER BY as.created_at DESC
    `;
    
    const result = await pool.query(query, [problem_id]);
    return result.rows;
  }

  // Update admin solution
  static async update(id: string, updateData: Partial<CreateAdminSolutionData>): Promise<AdminSolution> {
    const fields = Object.keys(updateData).map((key, index) => `${key} = $${index + 2}`);
    const values = Object.values(updateData);
    
    const query = `
      UPDATE admin_solutions 
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, ...values]);
    return result.rows[0];
  }

  // Delete admin solution
  static async delete(id: string): Promise<void> {
    const query = 'DELETE FROM admin_solutions WHERE id = $1';
    await pool.query(query, [id]);
  }
}
