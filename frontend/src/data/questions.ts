export interface Question {
  id: string;
  title: string;
  categories: string[];
  lastReported: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  company?: string;
  tags: string[];
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
    tags: ["database", "system design", "data structures"]
  },
  {
    id: "2",
    title: "Array Compression",
    categories: ["coding", "phone", "onsite"],
    lastReported: "1 week ago",
    description: "Implement an array compression algorithm that reduces the size of arrays containing repeated elements. The algorithm should:\n\n• Compress consecutive duplicate elements into a single element with a count\n• Decompress the compressed array back to its original form\n• Handle edge cases like empty arrays and single elements\n• Optimize for both time and space complexity",
    difficulty: "medium",
    company: "Meta",
    tags: ["algorithms", "compression", "arrays"]
  },
  {
    id: "3",
    title: "Backend Assignment Interview",
    categories: ["coding", "onsite"],
    lastReported: "3 days ago",
    description: "Design and implement a backend system for a task assignment platform. The system should:\n\n• Allow users to create, assign, and complete tasks\n• Support task prioritization and deadline management\n• Implement user authentication and authorization\n• Provide APIs for task CRUD operations\n• Handle concurrent task assignments and updates",
    difficulty: "hard",
    company: "Amazon",
    tags: ["backend", "system design", "APIs", "authentication"]
  },
  {
    id: "4",
    title: "Basic Calculator",
    categories: ["coding", "phone", "onsite"],
    lastReported: "5 days ago",
    description: "Build a calculator that can evaluate mathematical expressions. The calculator should:\n\n• Support basic arithmetic operations (+, -, *, /)\n• Handle parentheses for operation precedence\n• Support decimal numbers and negative numbers\n• Implement proper error handling for invalid expressions\n• Optimize for both accuracy and performance",
    difficulty: "easy",
    company: "Microsoft",
    tags: ["algorithms", "parsing", "mathematics"]
  },
  {
    id: "5",
    title: "LLM Token Counter",
    categories: ["coding", "phone"],
    lastReported: "1 week ago",
    description: "Implement a token counting system for Large Language Models. The system should:\n\n• Count tokens accurately for different tokenization methods\n• Support multiple LLM models (GPT, Claude, etc.)\n• Handle special tokens and encoding edge cases\n• Provide cost estimation based on token counts\n• Optimize for large text processing",
    difficulty: "medium",
    company: "OpenAI",
    tags: ["LLM", "tokenization", "NLP", "cost estimation"]
  },
  {
    id: "6",
    title: "Neural Network Optimizer",
    categories: ["coding", "onsite"],
    lastReported: "2 days ago",
    description: "Design an optimization system for neural network training. The system should:\n\n• Implement various optimization algorithms (Adam, SGD, etc.)\n• Support learning rate scheduling and decay\n• Handle gradient clipping and normalization\n• Provide performance metrics and visualization\n• Optimize for both training speed and model accuracy",
    difficulty: "hard",
    company: "DeepMind",
    tags: ["neural networks", "optimization", "machine learning", "gradients"]
  },
  {
    id: "7",
    title: "Prompt Engineering Framework",
    categories: ["coding", "phone"],
    lastReported: "4 days ago",
    description: "Create a framework for prompt engineering and management. The framework should:\n\n• Support template-based prompt generation\n• Implement prompt versioning and A/B testing\n• Provide prompt performance analytics\n• Support dynamic prompt injection\n• Handle prompt security and validation",
    difficulty: "medium",
    company: "Anthropic",
    tags: ["prompt engineering", "LLM", "templates", "analytics"]
  },
  {
    id: "8",
    title: "Vector Database Query",
    categories: ["coding", "onsite"],
    lastReported: "1 day ago",
    description: "Implement a vector similarity search system. The system should:\n\n• Support high-dimensional vector storage and indexing\n• Implement efficient similarity search algorithms\n• Handle batch queries and real-time updates\n• Provide ranking and filtering capabilities\n• Optimize for both accuracy and query speed",
    difficulty: "hard",
    company: "Pinecone",
    tags: ["vector databases", "similarity search", "machine learning", "indexing"]
  },
  // Generated LLM Implementation Problems
  {
    id: "0e2ff27d-dccb-4f44-9390-9262da3fafec",
    title: "LLM Implementation: Self-Attention",
    categories: ["coding", "phone"],
    lastReported: "Just generated",
    description: "This is a placeholder problem for self-attention. Use Cursor's AI to generate the actual problem.",
    difficulty: "medium",
    company: "OpenAI",
    tags: ["attention", "transformer", "implementation"]
  },
  {
    id: "207c7383-c2b8-48eb-b8af-9bc9478e333e",
    title: "LLM Implementation: Kv-Cache",
    categories: ["coding", "phone"],
    lastReported: "Just generated",
    description: "This is a placeholder problem for kv-cache. Use Cursor's AI to generate the actual problem.",
    difficulty: "medium",
    company: "OpenAI",
    tags: ["inference", "optimization", "memory"]
  },
  {
    id: "6731795c-f9f8-48bd-bf14-66985da810d2",
    title: "LLM Implementation: Greedy Search",
    categories: ["coding", "phone"],
    lastReported: "Just generated",
    description: "This is a placeholder problem for greedy search. Use Cursor's AI to generate the actual problem.",
    difficulty: "easy",
    company: "OpenAI",
    tags: ["generation", "search", "decoding"]
  }
];