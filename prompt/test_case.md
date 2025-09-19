# 测试用例系统功能需求

## 功能概述
为每道LeetCode题目添加完整的测试用例系统，包括示例输入输出、代码运行验证和批量测试功能。

## 核心功能

### 1. 题目示例系统
- **示例输入输出**：为每道题目的description添加清晰的example input和example output
- **格式规范**：统一示例的展示格式，包括输入格式、输出格式、说明文字
- **多示例支持**：每道题目至少提供2-3个不同复杂度的示例

### 2. 代码运行验证
- **Run功能**：每道题提供"Run Code"按钮，执行用户代码
- **Test Code功能**：提供"Test Code"按钮，运行2-3个预定义的测试用例
- **测试用例验证**：使用预定义的测试用例验证代码正确性
- **实时反馈**：显示测试通过/失败状态，提供详细的错误信息
- **性能监控**：记录执行时间和内存使用情况
- **独立测试**：Test Code结果不记录到用户提交历史中

### 3. 快速测试系统（Test Code）
- **测试用例数量**：每道题目提供2-3个快速测试用例
- **即时验证**：快速验证代码基本正确性
- **轻量级**：不记录到提交历史，仅用于开发调试
- **快速反馈**：提供即时的测试结果和错误信息

### 4. 完整测试系统（Submit）
- **测试用例数量**：每道题目准备20个完整测试用例
- **测试覆盖**：包含边界情况、正常情况、异常情况
- **测试结果**：显示通过/失败的测试用例数量和详细信息
- **错误诊断**：提供失败测试用例的输入、期望输出、实际输出对比
- **提交记录**：测试结果记录到用户提交历史中

## 技术实现

### 后端API设计
```typescript
// 测试用例接口
interface TestCase {
  id: string;
  problem_id: string;
  input: string;
  expected_output: string;
  description?: string;
  is_hidden: boolean; // 是否隐藏（用于最终验证）
}

// 代码执行接口
interface CodeExecution {
  code: string;
  language: string;
  test_cases: TestCase[];
  timeout?: number;
}

// 快速测试接口
interface QuickTestExecution {
  code: string;
  language: string;
  problem_id: string;
  timeout?: number;
}

// 快速测试结果接口
interface QuickTestResult {
  passed: boolean;
  passed_count: number;
  total_count: number;
  results: TestCaseResult[];
  execution_time: number;
  is_quick_test: boolean; // 标识是否为快速测试
}

// 执行结果接口
interface ExecutionResult {
  passed: boolean;
  passed_count: number;
  total_count: number;
  results: TestCaseResult[];
  execution_time: number;
  memory_usage: number;
}

interface TestCaseResult {
  test_case_id: string;
  passed: boolean;
  input: string;
  expected_output: string;
  actual_output: string;
  execution_time: number;
  error_message?: string;
}
```

### 前端UI设计
- **示例展示区域**：在题目描述中突出显示示例
- **代码编辑器集成**：Run按钮和Test Code按钮集成到代码编辑器工具栏
- **测试结果面板**：显示测试进度、结果统计、详细错误信息
- **快速测试面板**：专门显示Test Code的测试结果，不记录到历史
- **测试用例管理**：管理员可以添加、编辑、删除测试用例

### 代码执行引擎
- **沙箱环境**：安全的代码执行环境，防止恶意代码
- **多语言支持**：Python、JavaScript、Java、C++等
- **超时控制**：防止无限循环和超时执行
- **资源限制**：限制内存使用和执行时间

## 数据库设计

### 测试用例表
```sql
CREATE TABLE test_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID NOT NULL REFERENCES problems(id),
  input TEXT NOT NULL,
  expected_output TEXT NOT NULL,
  description TEXT,
  is_hidden BOOLEAN DEFAULT false,
  is_quick_test BOOLEAN DEFAULT false, -- 是否为快速测试用例
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_test_cases_problem_id ON test_cases(problem_id);
CREATE INDEX idx_test_cases_is_hidden ON test_cases(is_hidden);
CREATE INDEX idx_test_cases_is_quick_test ON test_cases(is_quick_test);
```

### 执行记录表
```sql
CREATE TABLE execution_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  problem_id UUID NOT NULL REFERENCES problems(id),
  code TEXT NOT NULL,
  language VARCHAR(20) NOT NULL,
  passed BOOLEAN NOT NULL,
  passed_count INTEGER NOT NULL,
  total_count INTEGER NOT NULL,
  execution_time INTEGER NOT NULL, -- 毫秒
  memory_usage INTEGER NOT NULL, -- KB
  is_quick_test BOOLEAN DEFAULT false, -- 是否为快速测试
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_execution_records_user_id ON execution_records(user_id);
CREATE INDEX idx_execution_records_problem_id ON execution_records(problem_id);
CREATE INDEX idx_execution_records_created_at ON execution_records(created_at);
CREATE INDEX idx_execution_records_is_quick_test ON execution_records(is_quick_test);
```

## Test Code功能详细说明

### 功能特点
- **独立按钮**：在代码编辑器工具栏添加"Test Code"按钮
- **快速验证**：运行2-3个预定义的测试用例
- **即时反馈**：提供快速的测试结果，不阻塞用户开发流程
- **不记录历史**：测试结果不会保存到用户的提交历史中
- **轻量级**：专注于基本功能验证，不进行完整测试

### 测试用例选择
- **基础用例**：选择最能代表题目核心逻辑的2-3个测试用例
- **边界情况**：包含一个边界条件测试（如空输入、单元素等）
- **正常情况**：包含1-2个典型的正常输入输出测试
- **快速执行**：测试用例设计为快速执行，避免复杂计算

### UI设计
- **按钮位置**：Test Code按钮位于Run Code按钮旁边
- **结果展示**：在代码编辑器下方显示测试结果面板
- **状态指示**：使用颜色和图标清晰显示通过/失败状态
- **详细信息**：显示每个测试用例的输入、期望输出、实际输出

### 与Submit功能的区别
| 功能 | Test Code | Submit |
|------|-----------|--------|
| 测试用例数量 | 2-3个 | 20个 |
| 执行速度 | 快速 | 完整 |
| 记录历史 | 否 | 是 |
| 用途 | 开发调试 | 正式提交 |
| 测试覆盖 | 基础验证 | 全面测试 |

## 功能特性

### 1. 示例展示
- **格式美化**：使用代码高亮和格式化显示示例
- **交互式**：用户可以复制示例输入到编辑器
- **多语言**：根据用户选择的编程语言显示对应示例

### 2. 测试执行
- **实时反馈**：显示测试执行进度和状态
- **错误提示**：详细的错误信息和调试建议
- **性能指标**：执行时间、内存使用、通过率统计
- **快速测试**：Test Code按钮提供即时反馈，不记录历史
- **完整测试**：Submit按钮进行完整验证，记录到提交历史

### 3. 测试管理
- **测试用例编辑**：管理员可以管理测试用例
- **批量导入**：支持从文件批量导入测试用例
- **测试验证**：确保测试用例的正确性

## 实现优先级

### 阶段1：基础功能
1. 为现有题目添加示例输入输出
2. 实现基本的代码执行功能
3. 添加Test Code按钮和2-3个快速测试用例
4. 实现快速测试结果展示（不记录历史）

### 阶段2：完整测试系统
1. 实现Submit按钮和20个完整测试用例的批量验证
2. 添加详细的测试结果展示和提交历史记录
3. 实现测试用例管理功能
4. 区分快速测试和完整测试的UI展示

### 阶段3：高级功能
1. 添加性能监控和优化建议
2. 实现测试用例的自动生成
3. 添加代码质量分析

## 技术栈

### 后端
- **代码执行**：Docker容器 + 多语言运行时
- **测试框架**：自定义测试执行引擎
- **API**：Express.js + TypeScript

### 前端
- **UI组件**：React + TypeScript
- **代码高亮**：Monaco Editor
- **状态管理**：React Context + Hooks

### 部署
- **容器化**：Docker + Docker Compose
- **安全**：代码执行沙箱隔离
- **监控**：执行时间和资源使用监控

## 安全考虑

1. **代码执行安全**：使用Docker容器隔离执行环境
2. **资源限制**：限制执行时间、内存使用、文件系统访问
3. **输入验证**：严格验证测试用例输入和用户代码
4. **错误处理**：防止敏感信息泄露，提供安全的错误提示

## 性能优化

1. **异步执行**：非阻塞的代码执行和测试
2. **结果缓存**：缓存测试结果，避免重复执行
3. **资源池**：复用执行容器，提高效率
4. **负载均衡**：分布式执行，支持高并发

## 用户体验

1. **直观界面**：清晰的测试结果展示和进度指示
2. **快速反馈**：实时的执行状态和结果更新
3. **错误诊断**：详细的错误信息和修复建议
4. **学习辅助**：通过测试用例帮助用户理解题目要求