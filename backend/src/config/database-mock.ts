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
  },
  {
    id: '3',
    title: 'Backend Assignment Interview',
    description: 'Design and implement a backend system for a task assignment platform. The system should allow users to create, assign, and complete tasks, support task prioritization and deadline management, implement user authentication and authorization, provide APIs for task CRUD operations, and handle concurrent task assignments and updates.',
    difficulty: 'hard',
    company: 'Amazon',
    categories: ['coding', 'onsite'],
    tags: ['backend', 'system design', 'APIs', 'authentication'],
    status: 'published',
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date()
  },
  {
    id: '4',
    title: 'Basic Calculator',
    description: 'Build a calculator that can evaluate mathematical expressions. The calculator should support basic arithmetic operations (+, -, *, /), handle parentheses for operation precedence, support decimal numbers and negative numbers, implement proper error handling for invalid expressions, and optimize for both accuracy and performance.',
    difficulty: 'easy',
    company: 'Microsoft',
    categories: ['coding', 'phone', 'onsite'],
    tags: ['algorithms', 'parsing', 'mathematics'],
    status: 'published',
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date()
  },
  {
    id: '5',
    title: 'LLM Token Counter',
    description: 'Implement a token counting system for Large Language Models. The system should count tokens accurately for different tokenization methods, support multiple LLM models (GPT, Claude, etc.), handle special tokens and encoding edge cases, provide cost estimation based on token counts, and optimize for large text processing.',
    difficulty: 'medium',
    company: 'OpenAI',
    categories: ['coding', 'phone'],
    tags: ['LLM', 'tokenization', 'NLP', 'cost estimation'],
    status: 'published',
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date()
  },
  {
    id: '6',
    title: 'Neural Network Optimizer',
    description: 'Design an optimization system for neural network training. The system should implement various optimization algorithms (Adam, SGD, etc.), support learning rate scheduling and decay, handle gradient clipping and normalization, provide performance metrics and visualization, and optimize for both training speed and model accuracy.',
    difficulty: 'hard',
    company: 'DeepMind',
    categories: ['coding', 'onsite'],
    tags: ['neural networks', 'optimization', 'machine learning', 'gradients'],
    status: 'published',
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date()
  },
  {
    id: '7',
    title: 'Prompt Engineering Framework',
    description: 'Create a framework for prompt engineering and management. The framework should support template-based prompt generation, implement prompt versioning and A/B testing, provide prompt performance analytics, support dynamic prompt injection, and handle prompt security and validation.',
    difficulty: 'medium',
    company: 'Anthropic',
    categories: ['coding', 'phone'],
    tags: ['prompt engineering', 'LLM', 'templates', 'analytics'],
    status: 'published',
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date()
  },
  {
    id: '8',
    title: 'Vector Database Query',
    description: 'Implement a vector similarity search system. The system should support high-dimensional vector storage and indexing, implement efficient similarity search algorithms, handle batch queries and real-time updates, provide ranking and filtering capabilities, and optimize for both accuracy and query speed.',
    difficulty: 'hard',
    company: 'Pinecone',
    categories: ['coding', 'onsite'],
    tags: ['vector databases', 'similarity search', 'machine learning', 'indexing'],
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

export const mockTestCases = [
  // Problem 1 - Design Database
  {
    id: '1-1',
    problem_id: '1',
    input: "db.insert('key1', 'value1')\ndb.retrieve('key1')",
    expected_output: 'value1',
    description: 'Basic insert and retrieve',
    is_hidden: false,
    is_quick_test: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '1-2',
    problem_id: '1',
    input: "db.insert('key2', 'value2')\ndb.remove('key2')\ndb.retrieve('key2')",
    expected_output: 'null',
    description: 'Insert, remove, then retrieve',
    is_hidden: false,
    is_quick_test: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '1-3',
    problem_id: '1',
    input: "db.retrieve('nonexistent')",
    expected_output: 'null',
    description: 'Retrieve non-existent key',
    is_hidden: false,
    is_quick_test: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '1-4',
    problem_id: '1',
    input: "db.insert('key3', 'value3')\ndb.insert('key3', 'new_value')\ndb.retrieve('key3')",
    expected_output: 'new_value',
    description: 'Update existing key',
    is_hidden: true,
    is_quick_test: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '1-5',
    problem_id: '1',
    input: "db.remove('nonexistent')",
    expected_output: 'false',
    description: 'Remove non-existent key',
    is_hidden: true,
    is_quick_test: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  // Problem 2 - Array Compression
  {
    id: '2-1',
    problem_id: '2',
    input: 'compress([1, 1, 2, 2, 2])',
    expected_output: '[(1, 2), (2, 3)]',
    description: 'Basic compression',
    is_hidden: false,
    is_quick_test: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '2-2',
    problem_id: '2',
    input: 'compress([])',
    expected_output: '[]',
    description: 'Empty array',
    is_hidden: false,
    is_quick_test: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '2-3',
    problem_id: '2',
    input: 'decompress([(5, 3)])',
    expected_output: '[5, 5, 5]',
    description: 'Basic decompression',
    is_hidden: false,
    is_quick_test: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '2-4',
    problem_id: '2',
    input: 'compress([1, 2, 3, 4, 5])',
    expected_output: '[(1, 1), (2, 1), (3, 1), (4, 1), (5, 1)]',
    description: 'No duplicates',
    is_hidden: true,
    is_quick_test: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '2-5',
    problem_id: '2',
    input: 'compress([7, 7, 7, 7, 7])',
    expected_output: '[(7, 5)]',
    description: 'All same elements',
    is_hidden: true,
    is_quick_test: false,
    created_at: new Date(),
    updated_at: new Date()
  }
];

export const mockExecutionRecords = [
  {
    id: 'exec-1',
    user_id: '2',
    problem_id: '1',
    code: 'class Database:\n    def __init__(self):\n        self.data = {}\n    \n    def insert(self, key, value):\n        self.data[key] = value\n    \n    def remove(self, key):\n        if key in self.data:\n            del self.data[key]\n            return True\n        return False\n    \n    def retrieve(self, key):\n        return self.data.get(key, None)',
    language: 'python',
    passed: true,
    passed_count: 2,
    total_count: 2,
    execution_time: 45,
    memory_usage: 12,
    is_quick_test: true,
    created_at: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
  },
  {
    id: 'exec-2',
    user_id: '2',
    problem_id: '1',
    code: 'class Database:\n    def __init__(self):\n        self.data = {}\n    \n    def insert(self, key, value):\n        self.data[key] = value\n    \n    def remove(self, key):\n        if key in self.data:\n            del self.data[key]\n            return True\n        return False\n    \n    def retrieve(self, key):\n        return self.data.get(key, None)',
    language: 'python',
    passed: true,
    passed_count: 5,
    total_count: 5,
    execution_time: 120,
    memory_usage: 15,
    is_quick_test: false,
    created_at: new Date(Date.now() - 25 * 60 * 1000) // 25 minutes ago
  },
  {
    id: 'exec-3',
    user_id: '2',
    problem_id: '2',
    code: 'function compressArray(arr) {\n    if (arr.length === 0) return [];\n    \n    const result = [];\n    let current = arr[0];\n    let count = 1;\n    \n    for (let i = 1; i < arr.length; i++) {\n        if (arr[i] === current) {\n            count++;\n        } else {\n            result.push([current, count]);\n            current = arr[i];\n            count = 1;\n        }\n    }\n    \n    result.push([current, count]);\n    return result;\n}',
    language: 'javascript',
    passed: true,
    passed_count: 2,
    total_count: 2,
    execution_time: 35,
    memory_usage: 8,
    is_quick_test: true,
    created_at: new Date(Date.now() - 20 * 60 * 1000) // 20 minutes ago
  }
];
