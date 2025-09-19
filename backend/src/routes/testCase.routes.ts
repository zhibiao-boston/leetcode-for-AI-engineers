import { Router } from 'express';
import { TestCaseController, 
  getTestCasesValidation,
  createTestCaseValidation,
  updateTestCaseValidation,
  deleteTestCaseValidation,
  executeQuickTestValidation,
  executeFullTestValidation,
  getExecutionRecordsValidation
} from '../controllers/testCase.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { createRateLimit } from '../middleware/auth.middleware';

const router = Router();

// 创建速率限制
const testCaseRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 最多100个请求
  message: 'Too many test case requests, please try again later.'
});

const executionRateLimit = createRateLimit({
  windowMs: 1 * 60 * 1000, // 1分钟
  max: 20, // 最多20个执行请求
  message: 'Too many code execution requests, please try again later.'
});

// 获取题目的测试用例
router.get('/problems/:problemId/test-cases', 
  getTestCasesValidation,
  TestCaseController.getTestCases
);

// 创建测试用例 (需要管理员权限)
router.post('/problems/:problemId/test-cases',
  authenticateToken,
  testCaseRateLimit,
  createTestCaseValidation,
  TestCaseController.createTestCase
);

// 更新测试用例 (需要管理员权限)
router.put('/test-cases/:testCaseId',
  authenticateToken,
  testCaseRateLimit,
  updateTestCaseValidation,
  TestCaseController.updateTestCase
);

// 删除测试用例 (需要管理员权限)
router.delete('/test-cases/:testCaseId',
  authenticateToken,
  testCaseRateLimit,
  deleteTestCaseValidation,
  TestCaseController.deleteTestCase
);

// 执行快速测试
router.post('/problems/:problemId/quick-test',
  authenticateToken,
  executionRateLimit,
  executeQuickTestValidation,
  TestCaseController.executeQuickTest
);

// 执行完整测试
router.post('/problems/:problemId/full-test',
  authenticateToken,
  executionRateLimit,
  executeFullTestValidation,
  TestCaseController.executeFullTest
);

// 获取执行记录
router.get('/problems/:problemId/execution-records',
  authenticateToken,
  getExecutionRecordsValidation,
  TestCaseController.getExecutionRecords
);

// 获取用户执行统计
router.get('/user/execution-stats',
  authenticateToken,
  TestCaseController.getUserExecutionStats
);

export default router;
