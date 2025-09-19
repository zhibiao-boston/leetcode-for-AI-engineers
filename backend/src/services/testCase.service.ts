import { TestCaseModel, TestCase, TestCaseResult, ExecutionResult } from '../models/TestCase';
import { ExecutionRecordModel, ExecutionRecord } from '../models/ExecutionRecord';
import { mockTestCases, mockExecutionRecords } from '../config/database-mock';
import { CodeExecutionService, CodeExecutionOptions } from './codeExecution.service';

export class TestCaseService {
  // 获取题目的测试用例
  static async getTestCasesByProblemId(problemId: string): Promise<TestCase[]> {
    // 在开发环境中使用mock数据
    if (process.env.NODE_ENV !== 'production') {
      return mockTestCases.filter(tc => tc.problem_id === problemId);
    }
    
    return await TestCaseModel.findByProblemId(problemId);
  }

  // 获取题目的快速测试用例
  static async getQuickTestCasesByProblemId(problemId: string): Promise<TestCase[]> {
    // 在开发环境中使用mock数据
    if (process.env.NODE_ENV !== 'production') {
      return mockTestCases.filter(tc => tc.problem_id === problemId && tc.is_quick_test);
    }
    
    return await TestCaseModel.findQuickTestsByProblemId(problemId);
  }

  // 获取题目的完整测试用例
  static async getFullTestCasesByProblemId(problemId: string): Promise<TestCase[]> {
    // 在开发环境中使用mock数据
    if (process.env.NODE_ENV !== 'production') {
      return mockTestCases.filter(tc => tc.problem_id === problemId && !tc.is_quick_test);
    }
    
    return await TestCaseModel.findFullTestsByProblemId(problemId);
  }

  // 创建测试用例
  static async createTestCase(testCase: Omit<TestCase, 'id' | 'created_at' | 'updated_at'>): Promise<TestCase> {
    if (process.env.NODE_ENV !== 'production') {
      const newTestCase: TestCase = {
        id: `${testCase.problem_id}-${Date.now()}`,
        ...testCase,
        created_at: new Date(),
        updated_at: new Date()
      };
      mockTestCases.push(newTestCase);
      return newTestCase;
    }
    
    return await TestCaseModel.create(testCase);
  }

  // 更新测试用例
  static async updateTestCase(id: string, updates: Partial<Omit<TestCase, 'id' | 'created_at' | 'updated_at'>>): Promise<TestCase | null> {
    if (process.env.NODE_ENV !== 'production') {
      const index = mockTestCases.findIndex(tc => tc.id === id);
      if (index === -1) return null;
      
      mockTestCases[index] = {
        ...mockTestCases[index],
        ...updates,
        updated_at: new Date()
      };
      return mockTestCases[index];
    }
    
    return await TestCaseModel.update(id, updates);
  }

  // 删除测试用例
  static async deleteTestCase(id: string): Promise<boolean> {
    if (process.env.NODE_ENV !== 'production') {
      const index = mockTestCases.findIndex(tc => tc.id === id);
      if (index === -1) return false;
      
      mockTestCases.splice(index, 1);
      return true;
    }
    
    return await TestCaseModel.delete(id);
  }

  // 执行快速测试
  static async executeQuickTest(
    userId: string,
    problemId: string,
    code: string,
    language: string
  ): Promise<ExecutionResult> {
    const testCases = await this.getQuickTestCasesByProblemId(problemId);
    return await this.executeCode(userId, problemId, code, language, testCases, true);
  }

  // 执行完整测试
  static async executeFullTest(
    userId: string,
    problemId: string,
    code: string,
    language: string
  ): Promise<ExecutionResult> {
    const testCases = await this.getTestCasesByProblemId(problemId);
    return await this.executeCode(userId, problemId, code, language, testCases, false);
  }

  // 执行代码并运行测试用例
  private static async executeCode(
    userId: string,
    problemId: string,
    code: string,
    language: string,
    testCases: TestCase[],
    isQuickTest: boolean
  ): Promise<ExecutionResult> {
    // 验证代码安全性
    const validation = CodeExecutionService.validateCode(code, language);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // 设置执行选项
    const options: CodeExecutionOptions = {
      language,
      timeout: isQuickTest ? 3000 : 10000, // 快速测试3秒，完整测试10秒
      memoryLimit: 128 // 128MB内存限制
    };

    // 使用代码执行引擎
    const executionResult = await CodeExecutionService.executeCode(code, testCases, options);

    // 记录执行记录
    await this.recordExecution(userId, problemId, code, language, executionResult);

    return executionResult;
  }


  // 记录执行记录
  private static async recordExecution(
    userId: string,
    problemId: string,
    code: string,
    language: string,
    result: ExecutionResult
  ): Promise<void> {
    const executionRecord: Omit<ExecutionRecord, 'id' | 'created_at'> = {
      user_id: userId,
      problem_id: problemId,
      code,
      language,
      passed: result.passed,
      passed_count: result.passed_count,
      total_count: result.total_count,
      execution_time: result.execution_time,
      memory_usage: result.memory_usage,
      is_quick_test: result.is_quick_test
    };

    if (process.env.NODE_ENV !== 'production') {
      const newRecord: ExecutionRecord = {
        id: `exec-${Date.now()}`,
        ...executionRecord,
        created_at: new Date()
      };
      mockExecutionRecords.push(newRecord);
    } else {
      await ExecutionRecordModel.create(executionRecord);
    }
  }

  // 获取用户的执行记录
  static async getUserExecutionRecords(userId: string, limit: number = 50, offset: number = 0): Promise<ExecutionRecord[]> {
    if (process.env.NODE_ENV !== 'production') {
      return mockExecutionRecords
        .filter(record => record.user_id === userId)
        .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
        .slice(offset, offset + limit);
    }
    
    return await ExecutionRecordModel.findByUserId(userId, limit, offset);
  }

  // 获取题目的执行记录
  static async getProblemExecutionRecords(problemId: string, limit: number = 50, offset: number = 0): Promise<ExecutionRecord[]> {
    if (process.env.NODE_ENV !== 'production') {
      return mockExecutionRecords
        .filter(record => record.problem_id === problemId)
        .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
        .slice(offset, offset + limit);
    }
    
    return await ExecutionRecordModel.findByProblemId(problemId, limit, offset);
  }

  // 获取用户执行统计
  static async getUserExecutionStats(userId: string): Promise<{
    total_executions: number;
    passed_executions: number;
    quick_test_executions: number;
    full_test_executions: number;
    average_execution_time: number;
  }> {
    if (process.env.NODE_ENV !== 'production') {
      const userRecords = mockExecutionRecords.filter(record => record.user_id === userId);
      return {
        total_executions: userRecords.length,
        passed_executions: userRecords.filter(record => record.passed).length,
        quick_test_executions: userRecords.filter(record => record.is_quick_test).length,
        full_test_executions: userRecords.filter(record => !record.is_quick_test).length,
        average_execution_time: userRecords.length > 0 
          ? userRecords.reduce((sum, record) => sum + record.execution_time, 0) / userRecords.length 
          : 0
      };
    }
    
    return await ExecutionRecordModel.getStatsByUserId(userId);
  }
}
