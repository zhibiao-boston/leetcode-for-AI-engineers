# 🚀 Integrate Problem Generator with LeetCode for AI Engineers

## 🎯 Objective

Transform the current hardcoded problem system to use dynamically generated ML/AI problems from the `problem-generator` module while maintaining all existing functionality including examples, test cases, and templates.

## 📋 Current State Analysis

### ✅ What We Have:
- **Problem Generator**: Located in `/problem-generator/` with 3 generated problems
- **Generated Problems**: `/problem-generator/data/generated_problems.json` with ML/AI topics
- **Generated Solutions**: `/problem-generator/data/generated_solutions.json` with full/practice solutions
- **ML Topics Config**: 160+ ML/AI topics organized by category
- **Current Frontend**: Displays hardcoded problems with test cases and examples
- **Working Test Cases**: UI properly renders test case tabs and examples

### ❌ What Needs Change:
- **Hardcoded Problems**: Currently using static problems in `backend/api-demo.js`
- **Missing Integration**: Problem generator data not connected to backend API
- **Placeholder Content**: Generated problems have placeholder descriptions
- **Missing Test Cases**: Generated problems lack examples and test cases

## 🎯 Goals to Achieve

### 1. Remove All Hardcoded Problems ❌➡️✅
- **Current**: `backend/api-demo.js` contains 2 hardcoded problems ("Design Database", "Array Compression")
- **Target**: Remove all hardcoded problems from backend
- **Keep**: API structure and endpoints intact

### 2. Add All Generated Problems ✅
- **Source**: `/problem-generator/data/generated_problems.json`
- **Current Count**: 3 problems (Self-Attention, KV-Cache, Greedy Search)
- **Target**: Load all generated problems into backend API
- **Maintain**: Problem ID mapping and status fields

### 3. Keep All Examples and Test Case Functionalities ✅
- **Current UI**: Test case tabs, examples display, code templates
- **Target**: Preserve all existing UI functionality
- **Requirement**: Generated problems must have same data structure as hardcoded ones

### 4. Generate Problem Descriptions for Generated Problems 📝
- **Current**: Generated problems have placeholder descriptions
- **Target**: Rich, detailed problem descriptions with examples and test cases
- **Format**: Match existing problem description format

## 📊 Data Structure Requirements

### Generated Problem Structure (Current):
```json
{
  "id": "uuid",
  "topic": "self-attention",
  "title": "LLM Implementation: Self-Attention",
  "description": "placeholder text",
  "difficulty": "medium",
  "company": "OpenAI",
  "categories": ["coding", "phone"],
  "tags": ["attention", "transformer"],
  "status": "generated"
}
```

### Required Frontend Structure:
```json
{
  "id": "uuid",
  "title": "LLM Implementation: Self-Attention",
  "description": "detailed problem description with context",
  "difficulty": "medium",
  "company": "OpenAI",
  "categories": ["coding", "phone"],
  "tags": ["attention", "transformer"],
  "status": "published",
  "lastReported": "Recently updated",
  "examples": [
    {
      "input": "attention_weights = compute_attention(...)",
      "output": "tensor([[0.2, 0.3, 0.5], ...])",
      "explanation": "Self-attention computation example"
    }
  ],
  "testCases": [
    {
      "id": "test-1",
      "input": "batch_size=2, seq_len=4, d_model=512",
      "expectedOutput": "attention_output.shape == (2, 4, 512)",
      "description": "Basic self-attention shape test",
      "isQuickTest": true
    }
  ],
  "template": "import torch\nimport torch.nn as nn\n\nclass SelfAttention(nn.Module):\n    def __init__(self, d_model):\n        # Your implementation here\n        pass"
}
```

## 🔧 Implementation Steps

### Step 1: Update Backend API Integration
**File**: `backend/api-demo.js`

```javascript
// Replace hardcoded problems array with:
const fs = require('fs');
const path = require('path');

// Load generated problems
const loadGeneratedProblems = () => {
  try {
    const problemsPath = path.join(__dirname, '../problem-generator/data/generated_problems.json');
    const solutionsPath = path.join(__dirname, '../problem-generator/data/generated_solutions.json');
    
    const generatedProblems = JSON.parse(fs.readFileSync(problemsPath, 'utf8'));
    const generatedSolutions = JSON.parse(fs.readFileSync(solutionsPath, 'utf8'));
    
    return generatedProblems.map(problem => transformProblemStructure(problem, generatedSolutions));
  } catch (error) {
    console.error('Error loading generated problems:', error);
    return [];
  }
};

const problems = loadGeneratedProblems();
```

### Step 2: Transform Problem Structure
Create transformation function to match frontend requirements:

```javascript
const transformProblemStructure = (generatedProblem, solutions) => {
  const problemSolutions = solutions.filter(s => s.problem_id === generatedProblem.id);
  const fullSolution = problemSolutions.find(s => s.type === 'full_solution');
  
  return {
    id: generatedProblem.id,
    title: generatedProblem.title,
    description: generateRichDescription(generatedProblem),
    difficulty: generatedProblem.difficulty,
    company: generatedProblem.company || 'OpenAI',
    categories: generatedProblem.categories || ['coding', 'phone'],
    tags: generatedProblem.tags || [],
    status: 'published',
    lastReported: 'Recently generated',
    examples: generateExamples(generatedProblem),
    testCases: generateTestCases(generatedProblem),
    template: generateTemplate(generatedProblem),
    created_at: generatedProblem.created_at
  };
};
```

### Step 3: Generate Rich Problem Descriptions
Create detailed problem descriptions for ML/AI topics:

```javascript
const generateRichDescription = (problem) => {
  const topicDescriptions = {
    'self-attention': `Implement the self-attention mechanism from the Transformer architecture.

• **Core Concept**: Self-attention allows each position in a sequence to attend to all positions in the same sequence
• **Key Components**: Query (Q), Key (K), and Value (V) matrices
• **Mathematical Formula**: Attention(Q,K,V) = softmax(QK^T/√d_k)V
• **Applications**: Language modeling, machine translation, text understanding

**Requirements**:
- Implement scaled dot-product attention
- Handle batched inputs with proper tensor shapes
- Support causal masking for autoregressive models
- Optimize for GPU computation with proper memory usage`,

    'kv-cache': `Implement Key-Value caching for efficient autoregressive generation.

• **Purpose**: Optimize inference speed by caching computed keys and values
• **Problem**: Autoregressive generation recomputes attention for all previous tokens
• **Solution**: Cache K,V matrices and only compute for new tokens
• **Performance**: Reduces O(n²) complexity to O(n) for generation

**Requirements**:
- Implement efficient KV cache storage
- Handle dynamic sequence length updates
- Support batch processing with variable lengths
- Memory-efficient cache management`,

    'greedy search': `Implement greedy search decoding for language model generation.

• **Concept**: Select the token with highest probability at each step
• **Advantages**: Fast, deterministic, simple implementation
• **Disadvantages**: Can get stuck in repetitive patterns
• **Use Cases**: Quick generation, deterministic outputs

**Requirements**:
- Implement greedy token selection
- Handle end-of-sequence tokens properly
- Support batched generation
- Integrate with attention mechanisms`
  };

  return topicDescriptions[problem.topic] || 
    `Implement ${problem.topic.replace('-', ' ')} for LLM systems.\n\n${problem.description}`;
};
```

### Step 4: Generate Examples and Test Cases
Create realistic examples and test cases for ML/AI problems:

```javascript
const generateExamples = (problem) => {
  const examplesByTopic = {
    'self-attention': [
      {
        input: `# Input sequence: "Hello world"
tokens = torch.tensor([[1, 2, 3, 4]])  # shape: (1, 4)
attention = SelfAttention(d_model=512)
output = attention(tokens)`,
        output: `# Output: attended representations
tensor([[[0.1, 0.2, ...], [0.3, 0.1, ...], ...]])  # shape: (1, 4, 512)`,
        explanation: "Self-attention computes contextual representations for each token"
      }
    ],
    'kv-cache': [
      {
        input: `# Initialize cache and generate tokens
cache = KVCache(max_length=100)
tokens = generate_with_cache(model, cache, prompt="Hello")`,
        output: `# Generated: "Hello world, how are you?"
cache.size()  # Returns current cache utilization`,
        explanation: "KV cache enables efficient autoregressive generation"
      }
    ]
  };

  return examplesByTopic[problem.topic] || [
    {
      input: `# Example usage for ${problem.topic}`,
      output: `# Expected output`,
      explanation: `Implementation example for ${problem.topic}`
    }
  ];
};

const generateTestCases = (problem) => {
  const testCasesByTopic = {
    'self-attention': [
      {
        id: `${problem.id}-1`,
        input: `batch_size=2, seq_len=10, d_model=512`,
        expectedOutput: `output.shape == torch.Size([2, 10, 512])`,
        description: "Basic shape verification",
        isQuickTest: true
      },
      {
        id: `${problem.id}-2`,
        input: `causal_mask=True, seq_len=5`,
        expectedOutput: `attention_weights[0, i, j] == 0 for j > i`,
        description: "Causal masking test",
        isQuickTest: true
      }
    ]
  };

  return testCasesByTopic[problem.topic] || [
    {
      id: `${problem.id}-1`,
      input: `test_input_for_${problem.topic.replace('-', '_')}()`,
      expectedOutput: `expected_output_shape_and_values`,
      description: `Basic functionality test for ${problem.topic}`,
      isQuickTest: true
    }
  ];
};
```

### Step 5: Generate Code Templates
Create starter code templates for each ML/AI topic:

```javascript
const generateTemplate = (problem) => {
  const templatesByTopic = {
    'self-attention': `import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class SelfAttention(nn.Module):
    def __init__(self, d_model, n_heads=8):
        """
        Self-Attention mechanism implementation
        
        Args:
            d_model: Model dimension
            n_heads: Number of attention heads
        """
        super().__init__()
        self.d_model = d_model
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        
        # Linear projections for Q, K, V
        self.w_q = nn.Linear(d_model, d_model)
        self.w_k = nn.Linear(d_model, d_model)
        self.w_v = nn.Linear(d_model, d_model)
        self.w_o = nn.Linear(d_model, d_model)
        
    def forward(self, x, mask=None):
        """
        Forward pass for self-attention
        
        Args:
            x: Input tensor (batch_size, seq_len, d_model)
            mask: Optional attention mask
            
        Returns:
            Output tensor (batch_size, seq_len, d_model)
        """
        # Your implementation here
        # 1. Compute Q, K, V matrices
        # 2. Reshape for multi-head attention
        # 3. Compute attention scores
        # 4. Apply softmax and optional mask
        # 5. Compute attention output
        # 6. Concatenate heads and apply output projection
        pass

# Example usage
if __name__ == "__main__":
    # Test your implementation
    batch_size, seq_len, d_model = 2, 10, 512
    x = torch.randn(batch_size, seq_len, d_model)
    attention = SelfAttention(d_model)
    output = attention(x)
    print(f"Input shape: {x.shape}")
    print(f"Output shape: {output.shape}")`,

    'kv-cache': `import torch
import torch.nn as nn
from typing import Optional, Tuple

class KVCache:
    def __init__(self, max_length: int, n_heads: int, d_k: int):
        """
        Key-Value cache for efficient autoregressive generation
        
        Args:
            max_length: Maximum sequence length to cache
            n_heads: Number of attention heads
            d_k: Dimension per head
        """
        self.max_length = max_length
        self.n_heads = n_heads
        self.d_k = d_k
        
        # Initialize cache tensors
        # Your implementation here
        pass
    
    def update(self, keys: torch.Tensor, values: torch.Tensor, 
               position: int) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Update cache with new keys and values
        
        Args:
            keys: New key tensor (batch_size, n_heads, 1, d_k)
            values: New value tensor (batch_size, n_heads, 1, d_k)
            position: Current position in sequence
            
        Returns:
            Tuple of (cached_keys, cached_values) up to current position
        """
        # Your implementation here
        # 1. Store new keys/values at current position
        # 2. Return all cached keys/values up to current position
        pass
    
    def reset(self):
        """Reset cache for new sequence"""
        # Your implementation here
        pass

class AttentionWithCache(nn.Module):
    def __init__(self, d_model: int, n_heads: int):
        super().__init__()
        self.d_model = d_model
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        
        self.w_q = nn.Linear(d_model, d_model)
        self.w_k = nn.Linear(d_model, d_model)
        self.w_v = nn.Linear(d_model, d_model)
        self.w_o = nn.Linear(d_model, d_model)
        
    def forward(self, x: torch.Tensor, cache: Optional[KVCache] = None, 
                position: int = 0) -> torch.Tensor:
        """
        Forward pass with optional KV caching
        
        Args:
            x: Input tensor (batch_size, seq_len, d_model)
            cache: Optional KV cache
            position: Current position for cache update
            
        Returns:
            Output tensor (batch_size, seq_len, d_model)
        """
        # Your implementation here
        # 1. Compute Q, K, V for current input
        # 2. If cache exists, update and retrieve cached K, V
        # 3. Compute attention with cached or full K, V
        pass

# Example usage
if __name__ == "__main__":
    d_model, n_heads = 512, 8
    max_length = 100
    
    # Initialize cache and model
    cache = KVCache(max_length, n_heads, d_model // n_heads)
    attention = AttentionWithCache(d_model, n_heads)
    
    # Simulate autoregressive generation
    for pos in range(5):
        x = torch.randn(1, 1, d_model)  # Single token input
        output = attention(x, cache, pos)
        print(f"Position {pos}, Output shape: {output.shape}")`
  };

  return templatesByTopic[problem.topic] || 
    `# ${problem.title} Implementation Template

def solve_${problem.topic.replace('-', '_')}():
    """
    Implement ${problem.topic.replace('-', ' ')} for LLM systems
    
    Your implementation here
    """
    pass

# Example usage
if __name__ == "__main__":
    result = solve_${problem.topic.replace('-', '_')}()
    print("Implementation result:", result)`;
};
```

## 🔄 Integration Workflow

### Phase 1: Backend Integration
1. **Update `backend/api-demo.js`**:
   - Remove hardcoded problems array
   - Add generated problems loading function
   - Implement structure transformation functions
   - Test API endpoints return correct data

### Phase 2: Rich Content Generation
1. **Enhance Problem Descriptions**:
   - Create topic-specific detailed descriptions
   - Add mathematical formulations and context
   - Include implementation requirements

2. **Generate Examples and Test Cases**:
   - Create realistic ML/AI examples
   - Add proper test cases with expected outputs
   - Ensure test case UI compatibility

### Phase 3: Code Templates
1. **Create Starter Templates**:
   - Topic-specific Python code templates
   - Include proper imports and structure
   - Add helpful comments and TODOs

### Phase 4: Testing and Validation
1. **Frontend Integration**:
   - Verify UI displays generated problems correctly
   - Test examples and test cases functionality
   - Ensure code editor loads templates properly

2. **API Testing**:
   - Test all endpoints with generated data
   - Verify data structure compatibility
   - Check error handling and edge cases

## 📈 Expected Outcomes

### ✅ After Implementation:
- **Dynamic Problem Loading**: Backend serves generated ML/AI problems
- **Rich Problem Content**: Detailed descriptions with context and examples
- **Preserved Functionality**: All existing UI features work with generated problems
- **Scalable System**: Easy to add new generated problems
- **ML/AI Focus**: Problems specifically designed for LLM/AI engineers

### 📊 Metrics:
- **Problem Count**: From 2 hardcoded → 3+ generated (expandable)
- **Content Quality**: From basic descriptions → rich ML/AI context
- **Maintenance**: From manual updates → automated generation
- **Relevance**: From generic coding → specialized ML/AI topics

## 🎯 Success Criteria

1. **✅ Zero Hardcoded Problems**: All problems loaded from generator
2. **✅ Rich Descriptions**: Generated problems have detailed, context-rich descriptions
3. **✅ Working Examples**: Each problem has realistic examples with explanations
4. **✅ Functional Test Cases**: Test case tabs display and work correctly
5. **✅ Code Templates**: Starter code loads properly in editor
6. **✅ UI Compatibility**: All existing frontend features work seamlessly
7. **✅ API Consistency**: Backend endpoints return expected data structure

## 🔧 Technical Notes

- **File Paths**: Ensure correct relative paths between backend and problem-generator
- **Error Handling**: Add proper error handling for missing or malformed data
- **Performance**: Consider caching generated problems for production
- **Extensibility**: Design system to easily add more generated problems
- **Data Validation**: Validate generated problem structure matches frontend expectations

---

**This integration will transform the static problem system into a dynamic, ML/AI-focused platform while preserving all existing functionality and user experience.**
