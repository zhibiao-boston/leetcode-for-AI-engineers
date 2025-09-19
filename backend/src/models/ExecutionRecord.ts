import { pool } from '../config/database';

export interface ExecutionRecord {
  id: string;
  user_id: string;
  problem_id: string;
  code: string;
  language: string;
  passed: boolean;
  passed_count: number;
  total_count: number;
  execution_time: number;
  memory_usage: number;
  is_quick_test: boolean;
  created_at: Date;
}

export class ExecutionRecordModel {
  // 创建执行记录
  static async create(record: Omit<ExecutionRecord, 'id' | 'created_at'>): Promise<ExecutionRecord> {
    const query = `
      INSERT INTO execution_records (user_id, problem_id, code, language, passed, passed_count, total_count, execution_time, memory_usage, is_quick_test)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      record.user_id,
      record.problem_id,
      record.code,
      record.language,
      record.passed,
      record.passed_count,
      record.total_count,
      record.execution_time,
      record.memory_usage,
      record.is_quick_test
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // 根据ID查找执行记录
  static async findById(id: string): Promise<ExecutionRecord | null> {
    const query = 'SELECT * FROM execution_records WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // 根据用户ID查找执行记录
  static async findByUserId(userId: string, limit: number = 50, offset: number = 0): Promise<ExecutionRecord[]> {
    const query = `
      SELECT * FROM execution_records 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
  }

  // 根据题目ID查找执行记录
  static async findByProblemId(problemId: string, limit: number = 50, offset: number = 0): Promise<ExecutionRecord[]> {
    const query = `
      SELECT * FROM execution_records 
      WHERE problem_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [problemId, limit, offset]);
    return result.rows;
  }

  // 根据用户ID和题目ID查找执行记录
  static async findByUserIdAndProblemId(userId: string, problemId: string, limit: number = 50, offset: number = 0): Promise<ExecutionRecord[]> {
    const query = `
      SELECT * FROM execution_records 
      WHERE user_id = $1 AND problem_id = $2 
      ORDER BY created_at DESC 
      LIMIT $3 OFFSET $4
    `;
    const result = await pool.query(query, [userId, problemId, limit, offset]);
    return result.rows;
  }

  // 获取用户执行统计
  static async getStatsByUserId(userId: string): Promise<{
    total_executions: number;
    passed_executions: number;
    quick_test_executions: number;
    full_test_executions: number;
    average_execution_time: number;
  }> {
    const query = `
      SELECT 
        COUNT(*) as total_executions,
        COUNT(CASE WHEN passed = true THEN 1 END) as passed_executions,
        COUNT(CASE WHEN is_quick_test = true THEN 1 END) as quick_test_executions,
        COUNT(CASE WHEN is_quick_test = false THEN 1 END) as full_test_executions,
        AVG(execution_time) as average_execution_time
      FROM execution_records 
      WHERE user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  // 获取题目执行统计
  static async getStatsByProblemId(problemId: string): Promise<{
    total_executions: number;
    passed_executions: number;
    quick_test_executions: number;
    full_test_executions: number;
    average_execution_time: number;
  }> {
    const query = `
      SELECT 
        COUNT(*) as total_executions,
        COUNT(CASE WHEN passed = true THEN 1 END) as passed_executions,
        COUNT(CASE WHEN is_quick_test = true THEN 1 END) as quick_test_executions,
        COUNT(CASE WHEN is_quick_test = false THEN 1 END) as full_test_executions,
        AVG(execution_time) as average_execution_time
      FROM execution_records 
      WHERE problem_id = $1
    `;
    const result = await pool.query(query, [problemId]);
    return result.rows[0];
  }

  // 删除执行记录
  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM execution_records WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  // 根据用户ID删除执行记录
  static async deleteByUserId(userId: string): Promise<number> {
    const query = 'DELETE FROM execution_records WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rowCount;
  }

  // 根据题目ID删除执行记录
  static async deleteByProblemId(problemId: string): Promise<number> {
    const query = 'DELETE FROM execution_records WHERE problem_id = $1';
    const result = await pool.query(query, [problemId]);
    return result.rowCount;
  }
}
