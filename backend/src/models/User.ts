import { pool } from '../config/database';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'admin' | 'user';
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
}

export interface CreateUserData {
  email: string;
  password_hash: string;
  name: string;
  role?: 'admin' | 'user';
}

export interface UpdateUserData {
  name?: string;
  password_hash?: string;
  last_login_at?: Date;
}

export class UserModel {
  // Create a new user
  static async create(userData: CreateUserData): Promise<User> {
    const { email, password_hash, name, role = 'user' } = userData;
    
    const query = `
      INSERT INTO users (email, password_hash, name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [email, password_hash, name, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Find user by email
  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  // Find user by ID
  static async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Update user
  static async update(id: string, userData: UpdateUserData): Promise<User> {
    const fields = Object.keys(userData).map((key, index) => `${key} = $${index + 2}`);
    const values = Object.values(userData);
    
    const query = `
      UPDATE users 
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, ...values]);
    return result.rows[0];
  }

  // Delete user (soft delete)
  static async delete(id: string): Promise<void> {
    const query = 'UPDATE users SET updated_at = NOW() WHERE id = $1';
    await pool.query(query, [id]);
  }

  // Get all users (admin only)
  static async findAll(limit = 50, offset = 0): Promise<User[]> {
    const query = `
      SELECT id, email, name, role, created_at, updated_at, last_login_at
      FROM users 
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  // Count total users
  static async count(): Promise<number> {
    const query = 'SELECT COUNT(*) FROM users';
    const result = await pool.query(query);
    return parseInt(result.rows[0].count);
  }

  // Check if email exists
  static async emailExists(email: string): Promise<boolean> {
    const query = 'SELECT 1 FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows.length > 0;
  }
}
