# 用户提交历史功能实现

## 功能需求
为LeetCode练习平台添加用户提交历史功能，记录和展示用户的代码提交记录。

## 具体要求

### 1. 数据模型设计
- 创建 `Submission` 模型，包含以下字段：
  - `id`: 唯一标识符
  - `user_id`: 用户ID（外键关联）
  - `problem_id`: 题目ID（外键关联）
  - `code`: 提交的代码内容
  - `language`: 编程语言（Python, JavaScript, Java等）
  - `status`: 提交状态（Accepted, Wrong Answer, Time Limit Exceeded, Runtime Error等）
  - `execution_time`: 执行时间（毫秒）
  - `memory_usage`: 内存使用量（MB）
  - `test_cases_passed`: 通过的测试用例数量
  - `total_test_cases`: 总测试用例数量
  - `submitted_at`: 提交时间
  - `created_at`: 创建时间
  - `updated_at`: 更新时间

### 2. 后端API实现
- `POST /api/submissions` - 创建新的提交记录
- `GET /api/submissions` - 获取当前用户的提交历史（支持分页）
- `GET /api/submissions/:id` - 获取特定提交的详细信息
- `GET /api/submissions/user/:userId` - 获取指定用户的所有提交（管理员功能）
- `DELETE /api/submissions/:id` - 删除提交记录（仅限本人或管理员）

### 3. 前端界面设计
- 在用户个人资料页面添加"提交历史"标签页
- 以列表形式展示提交记录，包含：
  - 题目名称和难度
  - 提交时间
  - 执行状态（带颜色标识）
  - 执行时间和内存使用
  - 通过率（x/y 测试用例）
- 支持按状态、时间、题目筛选
- 支持分页加载
- 点击可查看详细代码和执行结果

### 4. 功能特性
- 实时提交状态更新
- 代码语法高亮显示
- 提交统计图表（成功率、语言分布等）
- 导出提交历史功能
- 搜索和排序功能

### 5. 技术实现要点
- 使用TypeScript确保类型安全
- 实现数据验证和错误处理
- 添加适当的权限控制
- 优化数据库查询性能
- 实现响应式设计，支持移动端

### 6. 数据库设计
```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language VARCHAR(20) NOT NULL,
  status VARCHAR(50) NOT NULL,
  execution_time INTEGER,
  memory_usage DECIMAL(10,2),
  test_cases_passed INTEGER DEFAULT 0,
  total_test_cases INTEGER DEFAULT 0,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_problem_id ON submissions(problem_id);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at DESC);
```

### 7. 实现优先级
1. 高优先级：基础数据模型和API
2. 中优先级：前端列表展示和详情查看
3. 低优先级：高级功能（统计图表、导出等）

请按照以上要求实现用户提交历史功能，确保代码质量和用户体验。··