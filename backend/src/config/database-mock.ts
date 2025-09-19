// Import generated problems
import { generatedProblems } from './generated-problems';

// Mock database configuration for testing without PostgreSQL
export const mockConnection = {
  test: async (): Promise<boolean> => {
    console.log('✅ Mock database connected successfully');
    return true;
  },
  close: async (): Promise<void> => {
    console.log('✅ Mock database connection closed');
  }
};

// Mock data for testing
export const mockUsers = [
  {
    id: '1',
    email: 'ai_coding@gmail.com',
    password_hash: '$2b$12$AUZXZByI3/yRa2MRZR625en/NCRywmUUYGsmZRs7kXz5mDed/30vG', // 123456
    name: 'AI Coding Admin',
    role: 'admin' as const,
    created_at: new Date(),
    updated_at: new Date(),
    last_login_at: new Date()
  },
  {
    id: '2',
    email: 'user@example.com',
    password_hash: '$2b$12$PA7Yflw5vQWxF3pcErBVbObLX2aL6J2CBu9zvvl97tqBMfACyT.U6', // Password123
    name: 'Test User',
    role: 'user' as const,
    created_at: new Date(),
    updated_at: new Date(),
    last_login_at: new Date()
  },
  {
    id: '3',
    email: 'zhengshuocmu@gmail.com',
    password_hash: '$2b$12$AUZXZByI3/yRa2MRZR625en/NCRywmUUYGsmZRs7kXz5mDed/30vG', // 123456
    name: 'Zheng Shuocmu',
    role: 'user' as const,
    created_at: new Date(),
    updated_at: new Date(),
    last_login_at: new Date()
  }
];

// Only keep generated LLM problems - removed all hardcoded problems (IDs 1-8)
export const mockProblems = [
  ...generatedProblems
];

export const mockSubmissions = [
  {
    id: '1',
    user_id: '2',
    problem_id: '1',
    code: 'class Database:\n    def __init__(self):\n        self.data = {}\n    \n    def insert(self, key, value):\n        self.data[key] = value\n    \n    def remove(self, key):\n        if key in self.data:\n            del self.data[key]\n    \n    def retrieve(self, key):\n        return self.data.get(key, None)',
    language: 'python',
    status: 'accepted',
    execution_time: 120,
    memory_usage: 1024,
    test_cases_passed: 5,
    total_test_cases: 5,
    submitted_at: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  }
];

export const mockSolutions = [
  {
    id: '1',
    problem_id: '1',
    title: 'Optimal Database Solution',
    description: 'An efficient implementation using Python dictionaries',
    code: 'class Database:\n    def __init__(self):\n        self.data = {}\n    \n    def insert(self, key, value):\n        self.data[key] = value\n    \n    def remove(self, key):\n        if key in self.data:\n            del self.data[key]\n    \n    def retrieve(self, key):\n        return self.data.get(key, None)',
    language: 'python',
    time_complexity: 'O(1)',
    space_complexity: 'O(n)',
    explanation: 'This solution uses a Python dictionary for O(1) average-case operations.',
    status: 'published',
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date()
  }
];