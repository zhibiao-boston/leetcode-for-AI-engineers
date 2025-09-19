export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description?: string;
  isQuickTest: boolean;
}

export interface Question {
  id: string;
  title: string;
  categories: string[];
  lastReported: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  company?: string;
  tags: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  testCases: TestCase[];
  template?: string; // Custom template for the editor
}

export const sampleQuestions: Question[] = [
  {
    id: "1",
    title: "Design Database",
    categories: ["coding", "phone", "onsite"],
    lastReported: "2 weeks ago",
    description: "You need to design a simple database system that supports the following functionalities:\n\n• Insert: Add a key-value pair to the database.\n• Remove: Delete a key from the database.\n• Retrieve: Fetch the value associated with a given key.\n• Optional: Support additional functionalities like listing all keys or updating a value.",
    difficulty: "medium",
    company: "Google",
    tags: ["database", "system design", "data structures"],
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
      },
      {
        id: "1-3",
        input: "db.retrieve('nonexistent')",
        expectedOutput: "null",
        description: "Retrieve non-existent key",
        isQuickTest: false
      }
    ]
  },
  {
    id: "2",
    title: "Array Compression",
    categories: ["coding", "phone", "onsite"],
    lastReported: "1 week ago",
    description: "Implement an array compression algorithm that reduces the size of arrays containing repeated elements. The algorithm should:\n\n• Compress consecutive duplicate elements into a single element with a count\n• Decompress the compressed array back to its original form\n• Handle edge cases like empty arrays and single elements\n• Optimize for both time and space complexity",
    difficulty: "medium",
    company: "Meta",
    tags: ["algorithms", "compression", "arrays"],
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
      },
      {
        id: "2-3",
        input: "decompress([(5, 3)])",
        expectedOutput: "[5, 5, 5]",
        description: "Basic decompression",
        isQuickTest: false
      }
    ]
  },
  {
    id: "3",
    title: "Backend Assignment Interview",
    categories: ["coding", "onsite"],
    lastReported: "3 days ago",
    description: "Design and implement a backend system for a task assignment platform. The system should:\n\n• Allow users to create, assign, and complete tasks\n• Support task prioritization and deadline management\n• Implement user authentication and authorization\n• Provide APIs for task CRUD operations\n• Handle concurrent task assignments and updates",
    difficulty: "hard",
    company: "Amazon",
    tags: ["backend", "system design", "APIs", "authentication"],
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
    
    def assign_task(self, task_id, user_id):
        """
        Assign a task to a user
        
        Args:
            task_id: ID of the task to assign
            user_id: ID of the user to assign to
            
        Returns:
            Success status
        """
        # Your code here
        pass
    
    def get_tasks_by_user(self, user_id):
        """
        Get all tasks assigned to a user
        
        Args:
            user_id: ID of the user
            
        Returns:
            List of task objects
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
        input: "createTask('Fix bug', 'high', 'user123')",
        output: "taskId",
        explanation: "Create a new task with high priority"
      },
      {
        input: "assignTask('taskId', 'user123')",
        output: "success",
        explanation: "Assign task to user"
      }
    ],
    testCases: [
      {
        id: "3-1",
        input: "createTask('Test task', 'medium', 'user1')",
        expectedOutput: "taskId",
        description: "Create basic task",
        isQuickTest: true
      },
      {
        id: "3-2",
        input: "assignTask('taskId', 'user2')",
        expectedOutput: "success",
        description: "Assign task to user",
        isQuickTest: true
      },
      {
        id: "3-3",
        input: "getTasksByUser('user2')",
        expectedOutput: "[taskObject]",
        description: "Get user's tasks",
        isQuickTest: false
      }
    ]
  },
  {
    id: "4",
    title: "Basic Calculator",
    categories: ["coding", "phone", "onsite"],
    lastReported: "5 days ago",
    description: "Build a calculator that can evaluate mathematical expressions. The calculator should:\n\n• Support basic arithmetic operations (+, -, *, /)\n• Handle parentheses for operation precedence\n• Support decimal numbers and negative numbers\n• Implement proper error handling for invalid expressions\n• Optimize for both accuracy and performance",
    difficulty: "easy",
    company: "Microsoft",
    tags: ["algorithms", "parsing", "mathematics"],
    template: `def calculate(expression):
    """
    Evaluate a mathematical expression
    
    Args:
        expression: String containing mathematical expression
        
    Returns:
        Result of the calculation as a float
    """
    # Your code here
    pass

def parse_expression(expression):
    """
    Parse a mathematical expression into tokens
    
    Args:
        expression: String containing mathematical expression
        
    Returns:
        List of tokens (numbers and operators)
    """
    # Your code here
    pass

# Example usage
if __name__ == "__main__":
    # Test your calculator here
    test_expressions = ["2 + 3 * 4", "(2 + 3) * 4", "10 / 2"]
    for expr in test_expressions:
        result = calculate(expr)
        print(f"{expr} = {result}")
`,
    examples: [
      {
        input: "2 + 3 * 4",
        output: "14",
        explanation: "Multiplication has higher precedence than addition"
      },
      {
        input: "(2 + 3) * 4",
        output: "20",
        explanation: "Parentheses override operator precedence"
      }
    ],
    testCases: [
      {
        id: "4-1",
        input: "1 + 2",
        expectedOutput: "3",
        description: "Basic addition",
        isQuickTest: true
      },
      {
        id: "4-2",
        input: "10 / 2",
        expectedOutput: "5",
        description: "Basic division",
        isQuickTest: true
      },
      {
        id: "4-3",
        input: "2 * (3 + 4)",
        expectedOutput: "14",
        description: "Parentheses precedence",
        isQuickTest: false
      }
    ]
  },
  {
    id: "5",
    title: "LLM Token Counter",
    categories: ["coding", "phone"],
    lastReported: "1 week ago",
    description: "Implement a token counting system for Large Language Models. The system should:\n\n• Count tokens accurately for different tokenization methods\n• Support multiple LLM models (GPT, Claude, etc.)\n• Handle special tokens and encoding edge cases\n• Provide cost estimation based on token counts\n• Optimize for large text processing",
    difficulty: "medium",
    company: "OpenAI",
    tags: ["LLM", "tokenization", "NLP", "cost estimation"],
    template: `class TokenCounter:
    def __init__(self):
        """
        Initialize the token counter with model pricing
        """
        self.model_prices = {
            'gpt-3.5-turbo': 0.0005,
            'gpt-4': 0.03,
            'claude-3': 0.015
        }
    
    def count_tokens(self, text, model):
        """
        Count tokens for a given text and model
        
        Args:
            text: Input text to count tokens for
            model: Model name (gpt-3.5-turbo, gpt-4, claude-3)
            
        Returns:
            Number of tokens
        """
        # Your code here
        pass
    
    def estimate_cost(self, text, model):
        """
        Estimate cost for processing text with a model
        
        Args:
            text: Input text
            model: Model name
            
        Returns:
            Cost in dollars as string
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
        input: "countTokens('Hello world', 'gpt-3.5-turbo')",
        output: "2",
        explanation: "Count tokens for a simple sentence"
      },
      {
        input: "estimateCost('Hello world', 'gpt-4')",
        output: "$0.00003",
        explanation: "Estimate cost based on token count and model pricing"
      }
    ],
    testCases: [
      {
        id: "5-1",
        input: "countTokens('Hi', 'gpt-3.5-turbo')",
        expectedOutput: "1",
        description: "Single word token count",
        isQuickTest: true
      },
      {
        id: "5-2",
        input: "countTokens('', 'gpt-3.5-turbo')",
        expectedOutput: "0",
        description: "Empty string",
        isQuickTest: true
      },
      {
        id: "5-3",
        input: "estimateCost('Test', 'gpt-4')",
        expectedOutput: "0.00006",
        description: "Cost estimation",
        isQuickTest: false
      }
    ]
  },
  {
    id: "6",
    title: "Neural Network Optimizer",
    categories: ["coding", "onsite"],
    lastReported: "4 days ago",
    description: "Design an optimization system for neural network training. The system should:\n\n• Implement various optimization algorithms (Adam, SGD, etc.)\n• Support learning rate scheduling and decay\n• Handle gradient clipping and normalization\n• Provide performance metrics and visualization\n• Optimize for both training speed and model accuracy",
    difficulty: "hard",
    company: "DeepMind",
    tags: ["neural networks", "optimization", "machine learning", "gradients"],
    template: `class AdamOptimizer:
    def __init__(self, lr=0.001, beta1=0.9, beta2=0.999, epsilon=1e-8):
        """
        Initialize Adam optimizer
        
        Args:
            lr: Learning rate
            beta1: First moment decay rate
            beta2: Second moment decay rate
            epsilon: Small constant for numerical stability
        """
        self.lr = lr
        self.beta1 = beta1
        self.beta2 = beta2
        self.epsilon = epsilon
        self.m = 0  # First moment estimate
        self.v = 0  # Second moment estimate
        self.t = 0  # Time step
    
    def step(self, gradients):
        """
        Apply Adam optimization step
        
        Args:
            gradients: Gradient values
            
        Returns:
            Updated parameters
        """
        # Your code here
        pass

class StepLR:
    def __init__(self, optimizer, step_size, gamma):
        """
        Initialize step learning rate scheduler
        
        Args:
            optimizer: Optimizer to schedule
            step_size: Period of learning rate decay
            gamma: Multiplicative factor of learning rate decay
        """
        self.optimizer = optimizer
        self.step_size = step_size
        self.gamma = gamma
        self.step_count = 0
    
    def step(self):
        """
        Update learning rate based on schedule
        
        Returns:
            Adjusted learning rate
        """
        # Your code here
        pass

# Example usage
if __name__ == "__main__":
    # Test your optimizers here
    print("Neural Network Optimizer ready!")
`,
    examples: [
      {
        input: "optimizer = AdamOptimizer(lr=0.001)\noptimizer.step(gradients)",
        output: "updated_weights",
        explanation: "Apply Adam optimization step"
      },
      {
        input: "scheduler = StepLR(optimizer, step_size=10, gamma=0.1)",
        output: "adjusted_lr",
        explanation: "Adjust learning rate based on schedule"
      }
    ],
    testCases: [
      {
        id: "6-1",
        input: "sgd.step([0.1, 0.2, 0.3])",
        expectedOutput: "updated_params",
        description: "SGD optimization step",
        isQuickTest: true
      },
      {
        id: "6-2",
        input: "adam.step([0.1, 0.2, 0.3])",
        expectedOutput: "updated_params",
        description: "Adam optimization step",
        isQuickTest: true
      },
      {
        id: "6-3",
        input: "clipGradients(gradients, max_norm=1.0)",
        expectedOutput: "clipped_gradients",
        description: "Gradient clipping",
        isQuickTest: false
      }
    ]
  },
  {
    id: "7",
    title: "Prompt Engineering Framework",
    categories: ["coding", "phone"],
    lastReported: "6 days ago",
    description: "Create a framework for prompt engineering and management. The framework should:\n\n• Support template-based prompt generation\n• Implement prompt versioning and A/B testing\n• Provide prompt performance analytics\n• Support dynamic prompt injection\n• Handle prompt security and validation",
    difficulty: "medium",
    company: "Anthropic",
    tags: ["prompt engineering", "LLM", "templates", "analytics"],
    template: `class PromptTemplate:
    def __init__(self, template_string):
        """
        Initialize prompt template
        
        Args:
            template_string: Template string with placeholders like {text}
        """
        self.template = template_string
        self.version = "1.0"
    
    def render(self, **kwargs):
        """
        Render template with provided variables
        
        Args:
            **kwargs: Variables to substitute in template
            
        Returns:
            Rendered prompt string
        """
        # Your code here
        pass

class PromptAnalytics:
    def __init__(self):
        """
        Initialize prompt analytics tracker
        """
        self.metrics = {}
    
    def track_prompt(self, prompt_id, response, rating):
        """
        Track prompt performance metrics
        
        Args:
            prompt_id: ID of the prompt
            response: Response received
            rating: User rating of the response
            
        Returns:
            Success status
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
        input: "template = PromptTemplate('Summarize: {text}')\ntemplate.render(text='Hello world')",
        output: "Summarize: Hello world",
        explanation: "Use template to generate prompt"
      },
      {
        input: "analytics.trackPrompt(promptId, response, rating)",
        output: "success",
        explanation: "Track prompt performance metrics"
      }
    ],
    testCases: [
      {
        id: "7-1",
        input: "createTemplate('Classify: {text}')",
        expectedOutput: "templateId",
        description: "Create prompt template",
        isQuickTest: true
      },
      {
        id: "7-2",
        input: "renderTemplate(templateId, {text: 'test'})",
        expectedOutput: "Classify: test",
        description: "Render template with variables",
        isQuickTest: true
      },
      {
        id: "7-3",
        input: "validatePrompt('malicious prompt')",
        expectedOutput: "false",
        description: "Validate prompt security",
        isQuickTest: false
      }
    ]
  },
  {
    id: "8",
    title: "Vector Database Query",
    categories: ["coding", "onsite"],
    lastReported: "2 days ago",
    description: "Implement a vector similarity search system. The system should:\n\n• Support high-dimensional vector storage and indexing\n• Implement efficient similarity search algorithms\n• Handle batch queries and real-time updates\n• Provide ranking and filtering capabilities\n• Optimize for both accuracy and query speed",
    difficulty: "hard",
    company: "Pinecone",
    tags: ["vector databases", "similarity search", "machine learning", "indexing"],
    template: `class VectorDatabase:
    def __init__(self):
        """
        Initialize vector database
        """
        self.vectors = {}
        self.vector_dim = None
    
    def insert_vector(self, doc_id, vector):
        """
        Insert a vector into the database
        
        Args:
            doc_id: Document identifier
            vector: Vector to insert
            
        Returns:
            Success status
        """
        # Your code here
        pass
    
    def search(self, query_vector, top_k=5):
        """
        Search for most similar vectors
        
        Args:
            query_vector: Query vector
            top_k: Number of top results to return
            
        Returns:
            List of results with id and score
        """
        # Your code here
        pass
    
    def batch_search(self, query_vectors, top_k=5):
        """
        Perform batch similarity search
        
        Args:
            query_vectors: List of query vectors
            top_k: Number of top results per query
            
        Returns:
            List of result lists
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
        output: "[{id: 'doc1', score: 0.95}, {id: 'doc2', score: 0.87}]",
        explanation: "Find top 5 most similar vectors"
      },
      {
        input: "batchSearch([vec1, vec2], top_k=3)",
        output: "[[results1], [results2]]",
        explanation: "Perform batch similarity search"
      }
    ],
    testCases: [
      {
        id: "8-1",
        input: "search([0.1, 0.2, 0.3], top_k=1)",
        expectedOutput: "[{id: 'doc1', score: 0.99}]",
        description: "Basic similarity search",
        isQuickTest: true
      },
      {
        id: "8-2",
        input: "insertVector('doc1', [0.1, 0.2, 0.3])",
        expectedOutput: "success",
        description: "Insert vector",
        isQuickTest: true
      },
      {
        id: "8-3",
        input: "batchSearch([[0.1, 0.2], [0.3, 0.4]], top_k=2)",
        expectedOutput: "[[results1], [results2]]",
        description: "Batch search",
        isQuickTest: false
      }
    ]
  }
];
