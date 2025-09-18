import { pool } from '../config/database';

export interface Problem {
  id: string;
  external_id?: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  company?: string;
  categories: string[];
  tags: string[];
  status: 'draft' | 'published';
  created_by: string;
  created_at: Date;
  updated_at: Date;
  published_at?: Date;
}

export interface CreateProblemData {
  external_id?: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  company?: string;
  categories: string[];
  tags: string[];
  created_by: string;
}

export interface UpdateProblemData {
  title?: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  company?: string;
  categories?: string[];
  tags?: string[];
  status?: 'draft' | 'published';
}

export class ProblemModel {
  // Create a new problem
  static async create(problemData: CreateProblemData): Promise<Problem> {
    const { external_id, title, description, difficulty, company, categories, tags, created_by } = problemData;
    
    const query = `
      INSERT INTO problems (external_id, title, description, difficulty, company, categories, tags, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [external_id, title, description, difficulty, company, categories, tags, created_by];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Find problem by ID
  static async findById(id: string): Promise<Problem | null> {
    const query = 'SELECT * FROM problems WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Find problem by external ID
  static async findByExternalId(external_id: string): Promise<Problem | null> {
    const query = 'SELECT * FROM problems WHERE external_id = $1';
    const result = await pool.query(query, [external_id]);
    return result.rows[0] || null;
  }

  // Get all problems with filters
  static async findAll(filters: {
    status?: 'draft' | 'published';
    difficulty?: 'easy' | 'medium' | 'hard';
    company?: string;
    category?: string;
    tag?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<Problem[]> {
    const { status, difficulty, company, category, tag, limit = 50, offset = 0 } = filters;
    
    let query = 'SELECT * FROM problems WHERE 1=1';
    const values: any[] = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      values.push(status);
    }

    if (difficulty) {
      paramCount++;
      query += ` AND difficulty = $${paramCount}`;
      values.push(difficulty);
    }

    if (company) {
      paramCount++;
      query += ` AND company = $${paramCount}`;
      values.push(company);
    }

    if (category) {
      paramCount++;
      query += ` AND $${paramCount} = ANY(categories)`;
      values.push(category);
    }

    if (tag) {
      paramCount++;
      query += ` AND $${paramCount} = ANY(tags)`;
      values.push(tag);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  // Update problem
  static async update(id: string, problemData: UpdateProblemData): Promise<Problem> {
    const fields = Object.keys(problemData).map((key, index) => `${key} = $${index + 2}`);
    const values = Object.values(problemData);
    
    const query = `
      UPDATE problems 
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, ...values]);
    return result.rows[0];
  }

  // Publish problem
  static async publish(id: string): Promise<Problem> {
    const query = `
      UPDATE problems 
      SET status = 'published', published_at = NOW(), updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Unpublish problem
  static async unpublish(id: string): Promise<Problem> {
    const query = `
      UPDATE problems 
      SET status = 'draft', published_at = NULL, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Delete problem (soft delete)
  static async delete(id: string): Promise<void> {
    const query = 'UPDATE problems SET updated_at = NOW() WHERE id = $1';
    await pool.query(query, [id]);
  }

  // Count problems by status
  static async countByStatus(status?: 'draft' | 'published'): Promise<number> {
    let query = 'SELECT COUNT(*) FROM problems';
    const values: any[] = [];

    if (status) {
      query += ' WHERE status = $1';
      values.push(status);
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count);
  }

  // Get problems by creator
  static async findByCreator(created_by: string, limit = 50, offset = 0): Promise<Problem[]> {
    const query = `
      SELECT * FROM problems 
      WHERE created_by = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [created_by, limit, offset]);
    return result.rows;
  }

  // Search problems by title or description
  static async search(searchTerm: string, limit = 50, offset = 0): Promise<Problem[]> {
    const query = `
      SELECT * FROM problems 
      WHERE (title ILIKE $1 OR description ILIKE $1)
      AND status = 'published'
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const searchPattern = `%${searchTerm}%`;
    const result = await pool.query(query, [searchPattern, limit, offset]);
    return result.rows;
  }
}
