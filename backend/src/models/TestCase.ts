import { pool } from '../config/database';

export interface TestCase {
  id: string;
  problem_id: string;
  input: string;
  expected_output: string;
  description?: string;
  is_hidden: boolean;
  is_quick_test: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface TestCaseResult {
  test_case_id: string;
  passed: boolean;
  input: string;
  expected_output: string;
  actual_output: string;
  execution_time: number;
  error_message?: string;
}

export interface ExecutionResult {
  passed: boolean;
  passed_count: number;
  total_count: number;
  results: TestCaseResult[];
  execution_time: number;
  memory_usage: number;
  is_quick_test: boolean;
}

export class TestCaseModel {
  // 创建测试用例
  static async create(testCase: Omit<TestCase, 'id' | 'created_at' | 'updated_at'>): Promise<TestCase> {
    const query = `
      INSERT INTO test_cases (problem_id, input, expected_output, description, is_hidden, is_quick_test)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      testCase.problem_id,
      testCase.input,
      testCase.expected_output,
      testCase.description,
      testCase.is_hidden,
      testCase.is_quick_test
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // 根据ID查找测试用例
  static async findById(id: string): Promise<TestCase | null> {
    const query = 'SELECT * FROM test_cases WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // 根据题目ID查找测试用例
  static async findByProblemId(problemId: string): Promise<TestCase[]> {
    const query = 'SELECT * FROM test_cases WHERE problem_id = $1 ORDER BY is_quick_test DESC, created_at ASC';
    const result = await pool.query(query, [problemId]);
    return result.rows;
  }

  // 根据题目ID查找快速测试用例
  static async findQuickTestsByProblemId(problemId: string): Promise<TestCase[]> {
    const query = 'SELECT * FROM test_cases WHERE problem_id = $1 AND is_quick_test = true ORDER BY created_at ASC';
    const result = await pool.query(query, [problemId]);
    return result.rows;
  }

  // 根据题目ID查找完整测试用例
  static async findFullTestsByProblemId(problemId: string): Promise<TestCase[]> {
    const query = 'SELECT * FROM test_cases WHERE problem_id = $1 AND is_quick_test = false ORDER BY created_at ASC';
    const result = await pool.query(query, [problemId]);
    return result.rows;
  }

  // 更新测试用例
  static async update(id: string, updates: Partial<Omit<TestCase, 'id' | 'created_at' | 'updated_at'>>): Promise<TestCase | null> {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    
    const query = `
      UPDATE test_cases 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, ...values]);
    return result.rows[0] || null;
  }

  // 删除测试用例
  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM test_cases WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  // 根据题目ID删除所有测试用例
  static async deleteByProblemId(problemId: string): Promise<number> {
    const query = 'DELETE FROM test_cases WHERE problem_id = $1';
    const result = await pool.query(query, [problemId]);
    return result.rowCount;
  }

  // 批量创建测试用例
  static async createBatch(testCases: Omit<TestCase, 'id' | 'created_at' | 'updated_at'>[]): Promise<TestCase[]> {
    if (testCases.length === 0) return [];
    
    const query = `
      INSERT INTO test_cases (problem_id, input, expected_output, description, is_hidden, is_quick_test)
      VALUES ${testCases.map((_, index) => 
        `($${index * 6 + 1}, $${index * 6 + 2}, $${index * 6 + 3}, $${index * 6 + 4}, $${index * 6 + 5}, $${index * 6 + 6})`
      ).join(', ')}
      RETURNING *
    `;
    
    const values = testCases.flatMap(tc => [
      tc.problem_id,
      tc.input,
      tc.expected_output,
      tc.description,
      tc.is_hidden,
      tc.is_quick_test
    ]);
    
    const result = await pool.query(query, values);
    return result.rows;
  }
}
