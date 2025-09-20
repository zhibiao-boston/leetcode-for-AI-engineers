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
    explanation: string;
  }[];
  testCases: TestCase[];
  template?: string;
}

// Only keep generated LLM Implementation Problems - removed all hardcoded problems
export const sampleQuestions: Question[] = [
  {
    id: "0e2ff27d-dccb-4f44-9390-9262da3fafec",
    title: "Self-Attention",
    categories: ["coding", "phone"],
    lastReported: "Just generated",
    description: "This is a placeholder problem for self-attention. Use Cursor's AI to generate the actual problem.",
    difficulty: "medium",
    company: "OpenAI",
    tags: ["attention", "transformer", "implementation"],
    examples: [
      {
        input: "implement_self_attention(query, key, value)",
        output: "attention_output",
        explanation: "Implement self-attention mechanism"
      }
    ],
    testCases: [
      {
        id: "sa-1",
        input: "self_attention([1, 2], [1, 2], [3, 4])",
        expectedOutput: "attention_result",
        description: "Basic self-attention",
        isQuickTest: true
      }
    ]
  },
  {
    id: "207c7383-c2b8-48eb-b8af-9bc9478e333e",
    title: "Kv-Cache",
    categories: ["coding", "phone"],
    lastReported: "Just generated",
    description: "This is a placeholder problem for kv-cache. Use Cursor's AI to generate the actual problem.",
    difficulty: "medium",
    company: "OpenAI",
    tags: ["inference", "optimization", "memory"],
    examples: [
      {
        input: "kv_cache.get(key)",
        output: "cached_value",
        explanation: "Retrieve value from KV cache"
      }
    ],
    testCases: [
      {
        id: "kv-1",
        input: "cache.set('key1', 'value1')",
        expectedOutput: "True",
        description: "Cache set operation",
        isQuickTest: true
      }
    ]
  },
  {
    id: "6731795c-f9f8-48bd-bf14-66985da810d2",
    title: "Greedy Search",
    categories: ["coding", "phone"],
    lastReported: "Just generated",
    description: "This is a placeholder problem for greedy search. Use Cursor's AI to generate the actual problem.",
    difficulty: "easy",
    company: "OpenAI",
    tags: ["generation", "search", "decoding"],
    examples: [
      {
        input: "greedy_search(tokens, vocab)",
        output: "next_token",
        explanation: "Find next token using greedy search"
      }
    ],
    testCases: [
      {
        id: "gs-1",
        input: "greedy_search([1, 2, 3], vocab)",
        expectedOutput: "4",
        description: "Basic greedy search",
        isQuickTest: true
      }
    ]
  }
];