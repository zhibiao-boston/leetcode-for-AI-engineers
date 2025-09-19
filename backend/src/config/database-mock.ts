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
    password_hash: '$2b$12$jUh91MwcKXSwliw26DtfRep.MpEFbdQZVqmw006gTKuRbggKgSBY2', // Admin123
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
  }
];

export const mockProblems = [
  {
    id: '1',
    title: 'Design Database',
    description: 'You need to design a simple database system that supports the following functionalities: Insert: Add a key-value pair to the database. Remove: Delete a key from the database. Retrieve: Fetch the value associated with a given key.',
    difficulty: 'medium',
    company: 'Google',
    categories: ['coding', 'phone', 'onsite'],
    tags: ['database', 'design', 'system'],
    status: 'published',
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date()
  },
  {
    id: '2',
    title: 'Array Compression',
    description: 'Implement an array compression algorithm that reduces the size of arrays by removing consecutive duplicate elements and replacing them with a count.',
    difficulty: 'medium',
    company: 'Microsoft',
    categories: ['coding', 'phone'],
    tags: ['array', 'compression', 'algorithm'],
    status: 'published',
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date()
  }
];

export const mockSubmissions = [
  {
    id: '1',
    user_id: '2',
    problem_id: '1',
    code: 'class Database:\n    def __init__(self):\n        self.data = {}\n    \n    def insert(self, key, value):\n        self.data[key] = value\n    \n    def remove(self, key):\n        if key in self.data:\n            del self.data[key]\n            return True\n        return False\n    \n    def retrieve(self, key):\n        return self.data.get(key, None)',
    language: 'python',
    status: 'Accepted' as const,
    execution_time: 45,
    memory_usage: 12.5,
    test_cases_passed: 5,
    total_test_cases: 5,
    submitted_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    user_id: '2',
    problem_id: '1',
    code: 'class Database:\n    def __init__(self):\n        self.data = {}\n    \n    def insert(self, key, value):\n        self.data[key] = value\n    \n    def remove(self, key):\n        if key in self.data:\n            del self.data[key]\n        return True\n    \n    def retrieve(self, key):\n        return self.data.get(key, None)',
    language: 'python',
    status: 'Wrong Answer' as const,
    execution_time: 38,
    memory_usage: 11.2,
    test_cases_passed: 3,
    total_test_cases: 5,
    submitted_at: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000)
  },
  {
    id: '3',
    user_id: '2',
    problem_id: '2',
    code: 'function compressArray(arr) {\n    if (arr.length === 0) return [];\n    \n    const result = [];\n    let current = arr[0];\n    let count = 1;\n    \n    for (let i = 1; i < arr.length; i++) {\n        if (arr[i] === current) {\n            count++;\n        } else {\n            result.push([current, count]);\n            current = arr[i];\n            count = 1;\n        }\n    }\n    \n    result.push([current, count]);\n    return result;\n}',
    language: 'javascript',
    status: 'Accepted' as const,
    execution_time: 52,
    memory_usage: 8.7,
    test_cases_passed: 8,
    total_test_cases: 8,
    submitted_at: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: '4',
    user_id: '2',
    problem_id: '2',
    code: 'function compressArray(arr) {\n    const result = [];\n    let current = arr[0];\n    let count = 1;\n    \n    for (let i = 1; i < arr.length; i++) {\n        if (arr[i] === current) {\n            count++;\n        } else {\n            result.push([current, count]);\n            current = arr[i];\n            count = 1;\n        }\n    }\n    \n    return result;\n}',
    language: 'javascript',
    status: 'Runtime Error' as const,
    execution_time: 0,
    memory_usage: 0,
    test_cases_passed: 0,
    total_test_cases: 8,
    submitted_at: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000)
  }
];
