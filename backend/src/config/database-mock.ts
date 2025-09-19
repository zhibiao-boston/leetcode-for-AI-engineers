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

export const mockProblems = [
  {
    id: '1',
    title: 'Design Database',
    description: 'You need to design a simple database system that supports the following functionalities:\n\n• Insert: Add a key-value pair to the database.\n• Remove: Delete a key from the database.\n• Retrieve: Fetch the value associated with a given key.\n• Optional: Support additional functionalities like listing all keys or updating a value.',
    difficulty: 'medium',
    company: 'Google',
    categories: ['coding', 'phone', 'onsite'],
    tags: ['database', 'system design', 'data structures'],
    status: 'published',
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
    lastReported: '2 weeks ago',
    template: `class Database:
    def __init__(self):
        """
        Initialize the database
        """
        # Your code here
        pass
    
    def insert(self, key, value):
        """
        Insert a key-value pair to the database
        
        Args:
            key: The key to insert
            value: The value to associate with the key
        """
        # Your code here
        pass
    
    def remove(self, key):
        """
        Remove a key from the database
        
        Args:
            key: The key to remove
        """
        # Your code here
        pass
    
    def retrieve(self, key):
        """
        Retrieve the value associated with a given key
        
        Args:
            key: The key to retrieve
            
        Returns:
            The value associated with the key, or None if not found
        """
        # Your code here
        pass

# Example usage
if __name__ == "__main__":
    db = Database()
    # Test your database implementation here
    print("Database ready!")
`,
    examples: [
      {
        input: "db.insert('name', 'Alice')\ndb.insert('age', '25')\ndb.retrieve('name')",
        output: "Alice",
        explanation: "Insert two key-value pairs and retrieve the value for 'name'"
      },
      {
        input: "db.insert('city', 'New York')\ndb.remove('city')\ndb.retrieve('city')",
        output: "null",
        explanation: "Insert a key, remove it, then try to retrieve it (should return null)"
      }
    ],
    testCases: [
      {
        id: "1-1",
        input: "db.insert('key1', 'value1')\ndb.retrieve('key1')",
        expectedOutput: "value1",
        description: "Basic insert and retrieve",
        isQuickTest: true
      },
      {
        id: "1-2",
        input: "db.insert('key2', 'value2')\ndb.remove('key2')\ndb.retrieve('key2')",
        expectedOutput: "null",
        description: "Insert, remove, then retrieve",
        isQuickTest: true
      }
    ]
  },
  {
    id: '2',
    title: 'Array Compression',
    description: 'Implement an array compression algorithm that reduces the size of arrays containing repeated elements. The algorithm should:\n\n• Compress consecutive duplicate elements into a single element with a count\n• Decompress the compressed array back to its original form\n• Handle edge cases like empty arrays and single elements\n• Optimize for both time and space complexity',
    difficulty: 'medium',
    company: 'Meta',
    categories: ['coding', 'phone', 'onsite'],
    tags: ['algorithms', 'compression', 'arrays'],
    status: 'published',
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
    lastReported: '1 week ago',
    template: `def compress(arr):
    """
    Compress an array by grouping consecutive duplicate elements
    
    Args:
        arr: List of elements to compress
        
    Returns:
        List of tuples (element, count) representing compressed array
    """
    # Your code here
    pass

def decompress(compressed_arr):
    """
    Decompress a compressed array back to its original form
    
    Args:
        compressed_arr: List of tuples (element, count)
        
    Returns:
        Original array before compression
    """
    # Your code here
    pass

# Example usage
if __name__ == "__main__":
    # Test your compression functions here
    test_array = [1, 1, 2, 2, 2, 3]
    compressed = compress(test_array)
    decompressed = decompress(compressed)
    print(f"Original: {test_array}")
    print(f"Compressed: {compressed}")
    print(f"Decompressed: {decompressed}")
`,
    examples: [
      {
        input: "compress([1, 1, 2, 3, 3, 3])",
        output: "[(1, 2), (2, 1), (3, 3)]",
        explanation: "Compress array with consecutive duplicates"
      },
      {
        input: "decompress([(1, 2), (2, 1), (3, 3)])",
        output: "[1, 1, 2, 3, 3, 3]",
        explanation: "Decompress back to original array"
      }
    ],
    testCases: [
      {
        id: "2-1",
        input: "compress([1, 1, 2, 2, 2])",
        expectedOutput: "[(1, 2), (2, 3)]",
        description: "Basic compression",
        isQuickTest: true
      },
      {
        id: "2-2",
        input: "compress([])",
        expectedOutput: "[]",
        description: "Empty array",
        isQuickTest: true
      }
    ]
  },
  {
    id: '3',
    title: 'Backend Assignment Interview',
    description: 'Design and implement a backend system for a task assignment platform. The system should:\n\n• Allow users to create, assign, and complete tasks\n• Support task prioritization and deadline management\n• Implement user authentication and authorization\n• Provide APIs for task CRUD operations\n• Handle concurrent task assignments and updates',
    difficulty: 'hard',
    company: 'Amazon',
    categories: ['coding', 'onsite'],
    tags: ['backend', 'system design', 'APIs', 'authentication'],
    status: 'published',
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
    lastReported: '3 days ago',
    template: `class TaskManager:
    def __init__(self):
        """
        Initialize the task manager
        """
        self.tasks = {}
        self.task_counter = 0
    
    def create_task(self, title, priority, assignee):
        """
        Create a new task
        
        Args:
            title: Task title
            priority: Task priority (high, medium, low)
            assignee: User ID of the assignee
            
        Returns:
            Task ID
        """
        # Your code here
        pass
    
    def assign_task(self, task_id, assignee):
        """
        Assign a task to a user
        
        Args:
            task_id: ID of the task
            assignee: User ID of the assignee
        """
        # Your code here
        pass
    
    def complete_task(self, task_id):
        """
        Mark a task as completed
        
        Args:
            task_id: ID of the task
        """
        # Your code here
        pass

# Example usage
if __name__ == "__main__":
    tm = TaskManager()
    # Test your task manager here
    print("Task Manager ready!")
`,
    examples: [
      {
        input: "tm.create_task('Fix bug', 'high', 'user123')",
        output: "task_1",
        explanation: "Create a high priority task assigned to user123"
      },
      {
        input: "tm.assign_task('task_1', 'user456')\ntm.complete_task('task_1')",
        output: "Task completed",
        explanation: "Reassign task and mark as completed"
      }
    ],
    testCases: [
      {
        id: "3-1",
        input: "tm.create_task('Test task', 'medium', 'user1')",
        expectedOutput: "task_1",
        description: "Create basic task",
        isQuickTest: true
      },
      {
        id: "3-2",
        input: "tm.complete_task('task_1')",
        expectedOutput: "Task completed",
        description: "Complete existing task",
        isQuickTest: true
      }
    ]
  },
  {
    id: '4',
    title: 'Basic Calculator',
    description: 'Build a calculator that can evaluate mathematical expressions. The calculator should:\n\n• Support basic arithmetic operations (+, -, *, /)\n• Handle parentheses for operation precedence\n• Support decimal numbers and negative numbers\n• Implement proper error handling for invalid expressions\n• Optimize for both accuracy and performance',
    difficulty: 'easy',
    company: 'Microsoft',
    categories: ['coding', 'phone', 'onsite'],
    tags: ['algorithms', 'parsing', 'mathematics'],
    status: 'published',
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
    lastReported: '5 days ago',
    template: `def calculate(expression):
    """
    Calculate the result of a mathematical expression
    
    Args:
        expression: String containing mathematical expression
        
    Returns:
        Result of the calculation
    """
    # Your code here
    pass

def parse_expression(expression):
    """
    Parse a mathematical expression into tokens
    
    Args:
        expression: String containing mathematical expression
        
    Returns:
        List of tokens
    """
    # Your code here
    pass

# Example usage
if __name__ == "__main__":
    # Test your calculator here
    result = calculate("2 + 3 * 4")
    print(f"Result: {result}")
`,
    examples: [
      {
        input: "calculate('2 + 3 * 4')",
        output: "14",
        explanation: "Evaluate expression with operator precedence"
      },
      {
        input: "calculate('(10 - 2) / 4')",
        output: "2.0",
        explanation: "Handle parentheses and division"
      }
    ],
    testCases: [
      {
        id: "4-1",
        input: "calculate('1 + 2')",
        expectedOutput: "3",
        description: "Basic addition",
        isQuickTest: true
      },
      {
        id: "4-2",
        input: "calculate('10 / 2')",
        expectedOutput: "5.0",
        description: "Basic division",
        isQuickTest: true
      }
    ]
  },
  {
    id: '5',
    title: 'LLM Token Counter',
    description: 'Implement a token counting system for Large Language Models. The system should:\n\n• Count tokens accurately for different tokenization methods\n• Support multiple LLM models (GPT, Claude, etc.)\n• Handle special tokens and encoding edge cases\n• Provide cost estimation based on token counts\n• Optimize for large text processing',
    difficulty: 'medium',
    company: 'OpenAI',
    categories: ['coding', 'phone'],
    tags: ['LLM', 'tokenization', 'NLP', 'cost estimation'],
    status: 'published',
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
    lastReported: '1 week ago',
    template: `class TokenCounter:
    def __init__(self):
        """
        Initialize the token counter
        """
        self.model_costs = {
            'gpt-3.5-turbo': 0.002,
            'gpt-4': 0.03,
            'claude-3': 0.015
        }
    
    def count_tokens(self, text, model='gpt-3.5-turbo'):
        """
        Count tokens in text for a specific model
        
        Args:
            text: Input text
            model: Model name
            
        Returns:
            Number of tokens
        """
        # Your code here
        pass
    
    def estimate_cost(self, text, model='gpt-3.5-turbo'):
        """
        Estimate cost for processing text
        
        Args:
            text: Input text
            model: Model name
            
        Returns:
            Estimated cost in USD
        """
        # Your code here
        pass

# Example usage
if __name__ == "__main__":
    counter = TokenCounter()
    # Test your token counter here
    print("Token Counter ready!")
`,
    examples: [
      {
        input: "counter.count_tokens('Hello world', 'gpt-3.5-turbo')",
        output: "2",
        explanation: "Count tokens for simple text"
      },
      {
        input: "counter.estimate_cost('Hello world', 'gpt-4')",
        output: "0.00006",
        explanation: "Estimate cost for GPT-4 processing"
      }
    ],
    testCases: [
      {
        id: "5-1",
        input: "counter.count_tokens('AI is amazing', 'gpt-3.5-turbo')",
        expectedOutput: "4",
        description: "Count tokens for short text",
        isQuickTest: true
      },
      {
        id: "5-2",
        input: "counter.estimate_cost('Test', 'gpt-3.5-turbo')",
        expectedOutput: "0.002",
        description: "Estimate cost for single word",
        isQuickTest: true
      }
    ]
  },
  {
    id: '6',
    title: 'Neural Network Optimizer',
    description: 'Design an optimization system for neural network training. The system should:\n\n• Implement various optimization algorithms (Adam, SGD, etc.)\n• Support learning rate scheduling and decay\n• Handle gradient clipping and normalization\n• Provide performance metrics and visualization\n• Optimize for both training speed and model accuracy',
    difficulty: 'hard',
    company: 'DeepMind',
    categories: ['coding', 'onsite'],
    tags: ['neural networks', 'optimization', 'machine learning', 'gradients'],
    status: 'published',
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
    lastReported: '2 days ago',
    template: `class AdamOptimizer:
    def __init__(self, learning_rate=0.001, beta1=0.9, beta2=0.999):
        """
        Initialize Adam optimizer
        
        Args:
            learning_rate: Learning rate
            beta1: First moment decay rate
            beta2: Second moment decay rate
        """
        # Your code here
        pass
    
    def step(self, gradients, weights):
        """
        Perform optimization step
        
        Args:
            gradients: Current gradients
            weights: Current weights
            
        Returns:
            Updated weights
        """
        # Your code here
        pass

class StepLR:
    def __init__(self, optimizer, step_size, gamma=0.1):
        """
        Initialize step learning rate scheduler
        
        Args:
            optimizer: Optimizer to schedule
            step_size: Number of steps between updates
            gamma: Multiplicative factor
        """
        # Your code here
        pass
    
    def step(self):
        """
        Update learning rate
        """
        # Your code here
        pass

# Example usage
if __name__ == "__main__":
    # Test your optimizer here
    print("Neural Network Optimizer ready!")
`,
    examples: [
      {
        input: "optimizer.step(gradients, weights)",
        output: "updated_weights",
        explanation: "Perform optimization step with Adam"
      },
      {
        input: "scheduler.step()",
        output: "Learning rate updated",
        explanation: "Update learning rate with scheduler"
      }
    ],
    testCases: [
      {
        id: "6-1",
        input: "optimizer.step([0.1, -0.2], [1.0, 2.0])",
        expectedOutput: "[0.999, 2.001]",
        description: "Basic optimization step",
        isQuickTest: true
      },
      {
        id: "6-2",
        input: "scheduler.step()",
        expectedOutput: "Learning rate: 0.0001",
        description: "Learning rate scheduling",
        isQuickTest: true
      }
    ]
  },
  {
    id: '7',
    title: 'Prompt Engineering Framework',
    description: 'Create a framework for prompt engineering and management. The framework should:\n\n• Support template-based prompt generation\n• Implement prompt versioning and A/B testing\n• Provide prompt performance analytics\n• Support dynamic prompt injection\n• Handle prompt security and validation',
    difficulty: 'medium',
    company: 'Anthropic',
    categories: ['coding', 'phone'],
    tags: ['prompt engineering', 'LLM', 'templates', 'analytics'],
    status: 'published',
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
    lastReported: '4 days ago',
    template: `class PromptTemplate:
    def __init__(self, template, variables=None):
        """
        Initialize prompt template
        
        Args:
            template: Template string with placeholders
            variables: Default variables
        """
        # Your code here
        pass
    
    def render(self, **kwargs):
        """
        Render template with variables
        
        Args:
            **kwargs: Variables to substitute
            
        Returns:
            Rendered prompt
        """
        # Your code here
        pass

class PromptAnalytics:
    def __init__(self):
        """
        Initialize prompt analytics
        """
        # Your code here
        pass
    
    def track_performance(self, prompt_id, metrics):
        """
        Track prompt performance metrics
        
        Args:
            prompt_id: ID of the prompt
            metrics: Performance metrics
        """
        # Your code here
        pass

# Example usage
if __name__ == "__main__":
    # Test your prompt framework here
    print("Prompt Engineering Framework ready!")
`,
    examples: [
      {
        input: "template.render(text='Hello world')",
        output: "Summarize: Hello world",
        explanation: "Render template with text variable"
      },
      {
        input: "analytics.track_performance('prompt_1', {'accuracy': 0.95})",
        output: "Metrics recorded",
        explanation: "Track prompt performance"
      }
    ],
    testCases: [
      {
        id: "7-1",
        input: "template.render(text='Test')",
        expectedOutput: "Summarize: Test",
        description: "Basic template rendering",
        isQuickTest: true
      },
      {
        id: "7-2",
        input: "analytics.track_performance('p1', {'score': 0.8})",
        expectedOutput: "Metrics recorded",
        description: "Track performance metrics",
        isQuickTest: true
      }
    ]
  },
  {
    id: '8',
    title: 'Vector Database Query',
    description: 'Implement a vector database query system for similarity search. The system should:\n\n• Support vector indexing and storage\n• Implement efficient similarity search algorithms\n• Handle high-dimensional vectors\n• Provide query optimization and caching\n• Support real-time updates and batch operations',
    difficulty: 'hard',
    company: 'Pinecone',
    categories: ['coding', 'onsite'],
    tags: ['vector database', 'similarity search', 'machine learning', 'indexing'],
    status: 'published',
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
    lastReported: '1 day ago',
    template: `class VectorDatabase:
    def __init__(self, dimension):
        """
        Initialize vector database
        
        Args:
            dimension: Vector dimension
        """
        # Your code here
        pass
    
    def insert(self, id, vector, metadata=None):
        """
        Insert a vector with metadata
        
        Args:
            id: Vector ID
            vector: Vector data
            metadata: Optional metadata
        """
        # Your code here
        pass
    
    def search(self, query_vector, top_k=5):
        """
        Search for similar vectors
        
        Args:
            query_vector: Query vector
            top_k: Number of results to return
            
        Returns:
            List of similar vectors with scores
        """
        # Your code here
        pass

# Example usage
if __name__ == "__main__":
    # Test your vector database here
    print("Vector Database ready!")
`,
    examples: [
      {
        input: "search(query_vector, top_k=5)",
        output: "[{'id': 'doc1', 'score': 0.95}, {'id': 'doc2', 'score': 0.87}]",
        explanation: "Search for similar vectors"
      },
      {
        input: "insert('doc1', [0.1, 0.2, 0.3], {'title': 'Test'})",
        output: "Vector inserted",
        explanation: "Insert vector with metadata"
      }
    ],
    testCases: [
      {
        id: "8-1",
        input: "search([0.1, 0.2], top_k=3)",
        expectedOutput: "[{'id': 'v1', 'score': 0.99}]",
        description: "Basic similarity search",
        isQuickTest: true
      },
      {
        id: "8-2",
        input: "insert('v1', [0.1, 0.2])",
        expectedOutput: "Vector inserted",
        description: "Insert vector",
        isQuickTest: true
      }
    ]
  },
  // Add generated LLM problems
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
    execution_time: 45,
    memory_usage: 1024,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '2',
    user_id: '2',
    problem_id: '2',
    code: 'def compress(arr):\n    if not arr:\n        return []\n    \n    result = []\n    current = arr[0]\n    count = 1\n    \n    for i in range(1, len(arr)):\n        if arr[i] == current:\n            count += 1\n        else:\n            result.append((current, count))\n            current = arr[i]\n            count = 1\n    \n    result.append((current, count))\n    return result',
    language: 'python',
    status: 'accepted',
    execution_time: 32,
    memory_usage: 512,
    created_at: new Date(),
    updated_at: new Date()
  }
];

export const mockAdminSolutions = [
  {
    id: '1',
    problem_id: '1',
    title: 'Optimal Database Implementation',
    description: 'A highly optimized database implementation using hash tables for O(1) operations.',
    code: 'class Database:\n    def __init__(self):\n        self.data = {}\n    \n    def insert(self, key, value):\n        self.data[key] = value\n    \n    def remove(self, key):\n        return self.data.pop(key, None)\n    \n    def retrieve(self, key):\n        return self.data.get(key, None)',
    language: 'python',
    time_complexity: 'O(1)',
    space_complexity: 'O(n)',
    created_by: '1',
    created_at: new Date(),
    updated_at: new Date()
  }
];