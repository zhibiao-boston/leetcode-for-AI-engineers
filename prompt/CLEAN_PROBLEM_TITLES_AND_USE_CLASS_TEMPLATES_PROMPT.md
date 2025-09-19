# Clean Problem Titles and Use Class Templates

## 🎯 Goals
1. **Remove UUID prefixes and "LLM Implementation:" from problem titles**
2. **Convert all code templates from functions to classes**
3. **Clean up the UI to show concise, professional problem titles**

## 🔍 Current State Analysis

### Current Problem Titles (Need Cleaning):
1. **"0e2ff27d-dccb-4f44-9390-9262da3fafec. LLM Implementation: Self-Attention"**
   - Should become: **"Self-Attention"**
2. **"207c7383-c2b8-48eb-b8af-9bc9478e333e. LLM Implementation: Kv-Cache"**
   - Should become: **"Kv-Cache"**
3. **"6731795c-f9f8-48bd-bf14-66985da810d2. LLM Implementation: Greedy Search"**
   - Should become: **"Greedy Search"**

### Current Code Templates (Need Class Conversion):
- Currently using function-based templates
- Need to convert to class-based architecture for better OOP structure
- Should include proper initialization, methods, and example usage

## 📋 Tasks to Complete

### Task 1: Clean Problem Titles in Backend

**Files to Modify:**
- `backend/src/config/generated-problems.ts`
- `backend/src/config/database-mock.ts` (if problems are hardcoded there)

**Actions:**
1. Remove UUID prefixes (e.g., "0e2ff27d-dccb-4f44-9390-9262da3fafec. ")
2. Remove "LLM Implementation: " prefix
3. Keep only the core topic name (e.g., "Self-Attention", "Kv-Cache", "Greedy Search")
4. Ensure titles are clean and professional

### Task 2: Clean Problem Titles in Frontend

**Files to Modify:**
- `frontend/src/data/questions.ts`

**Actions:**
1. Update all 3 problem titles to remove UUID and "LLM Implementation:" prefixes
2. Ensure consistency with backend titles
3. Maintain all other problem properties (description, difficulty, tags, etc.)

### Task 3: Convert Code Templates to Classes

**Files to Modify:**
- `backend/src/config/generated-problems.ts` (if templates are stored there)
- `frontend/src/data/questions.ts` (if templates are stored there)
- Any template generation files in `problem-generator/`

**Actions:**
1. Convert function-based code to class-based architecture
2. Include proper class initialization (`__init__` methods)
3. Add class methods for core functionality
4. Include example usage with class instantiation

## 🔧 Implementation Examples

### Title Cleaning Example:
```typescript
// BEFORE:
{
  id: "0e2ff27d-dccb-4f44-9390-9262da3fafec",
  title: "0e2ff27d-dccb-4f44-9390-9262da3fafec. LLM Implementation: Self-Attention",
  // ... other properties
}

// AFTER:
{
  id: "0e2ff27d-dccb-4f44-9390-9262da3fafec", // Keep ID unchanged
  title: "Self-Attention", // Clean title
  // ... other properties
}
```

### Code Template Conversion Example:

#### Self-Attention (Function → Class):
```python
# BEFORE (Function-based):
def solve():
    """
    Your Python code here
    """
    pass

if __name__ == "__main__":
    solve()

# AFTER (Class-based):
class SelfAttentionSolver:
    def __init__(self, d_model=512, num_heads=8):
        """
        Initialize self-attention solver
        
        Args:
            d_model: Model dimension
            num_heads: Number of attention heads
        """
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
    
    def compute_attention(self, query, key, value):
        """
        Compute self-attention mechanism
        
        Args:
            query: Query matrix
            key: Key matrix  
            value: Value matrix
            
        Returns:
            Attention output
        """
        # Your implementation here
        pass
    
    def scaled_dot_product_attention(self, Q, K, V):
        """
        Implement scaled dot-product attention
        
        Args:
            Q: Query matrix
            K: Key matrix
            V: Value matrix
            
        Returns:
            Attention scores and output
        """
        # Your implementation here
        pass

# Example usage
if __name__ == "__main__":
    solver = SelfAttentionSolver()
    print("Self-Attention solver ready!")
```

#### Kv-Cache (Function → Class):
```python
# AFTER (Class-based):
class KvCacheSolver:
    def __init__(self, max_seq_len=2048, num_layers=12):
        """
        Initialize KV cache solver
        
        Args:
            max_seq_len: Maximum sequence length
            num_layers: Number of transformer layers
        """
        self.max_seq_len = max_seq_len
        self.num_layers = num_layers
        self.cache = {}
    
    def initialize_cache(self):
        """
        Initialize KV cache structure
        """
        # Your implementation here
        pass
    
    def update_cache(self, layer_idx, key, value):
        """
        Update KV cache for a specific layer
        
        Args:
            layer_idx: Layer index
            key: Key tensor
            value: Value tensor
        """
        # Your implementation here
        pass
    
    def get_cached_kv(self, layer_idx):
        """
        Retrieve cached key-value pairs
        
        Args:
            layer_idx: Layer index
            
        Returns:
            Cached key and value tensors
        """
        # Your implementation here
        pass

# Example usage
if __name__ == "__main__":
    solver = KvCacheSolver()
    print("KV-Cache solver ready!")
```

#### Greedy Search (Function → Class):
```python
# AFTER (Class-based):
class GreedySearchSolver:
    def __init__(self, vocab_size=50000, max_length=100):
        """
        Initialize greedy search solver
        
        Args:
            vocab_size: Vocabulary size
            max_length: Maximum generation length
        """
        self.vocab_size = vocab_size
        self.max_length = max_length
    
    def greedy_decode(self, model, input_ids, max_new_tokens=50):
        """
        Perform greedy decoding
        
        Args:
            model: Language model
            input_ids: Input token IDs
            max_new_tokens: Maximum new tokens to generate
            
        Returns:
            Generated token sequence
        """
        # Your implementation here
        pass
    
    def select_next_token(self, logits):
        """
        Select next token using greedy strategy
        
        Args:
            logits: Model output logits
            
        Returns:
            Selected token ID
        """
        # Your implementation here
        pass

# Example usage
if __name__ == "__main__":
    solver = GreedySearchSolver()
    print("Greedy Search solver ready!")
```

## 🔧 Implementation Steps

### Step 1: Update Generated Problems File
```typescript
// In backend/src/config/generated-problems.ts
export const generatedProblems = [
  {
    id: "0e2ff27d-dccb-4f44-9390-9262da3fafec",
    title: "Self-Attention", // Cleaned title
    description: "Implement the self-attention mechanism used in Transformer models...",
    // ... other properties
  },
  {
    id: "207c7383-c2b8-48eb-b8af-9bc9478e333e", 
    title: "Kv-Cache", // Cleaned title
    description: "Implement key-value caching for efficient transformer inference...",
    // ... other properties
  },
  {
    id: "6731795c-f9f8-48bd-bf14-66985da810d2",
    title: "Greedy Search", // Cleaned title
    description: "Implement greedy search decoding for language model generation...",
    // ... other properties
  }
];
```

### Step 2: Update Frontend Questions
```typescript
// In frontend/src/data/questions.ts
export const sampleQuestions: Question[] = [
  {
    id: "0e2ff27d-dccb-4f44-9390-9262da3fafec",
    title: "Self-Attention", // Cleaned title
    categories: ["coding", "phone"],
    lastReported: "Just generated",
    description: "Implement the self-attention mechanism used in Transformer models...",
    difficulty: "medium",
    company: "OpenAI",
    tags: ["attention", "transformer", "implementation"],
    template: `class SelfAttentionSolver:
    def __init__(self, d_model=512, num_heads=8):
        # Class-based template
        pass`,
    // ... rest of properties
  },
  // ... other problems with cleaned titles and class templates
];
```

### Step 3: Update Problem Generator Templates

**Files to Modify:**
- `prompt/problem_prompts/problem_generation_template.txt`
- `prompt/solution_prompts/full_solution_generation_template.txt`
- `prompt/solution_prompts/practice_solution_generation_template.txt`

**Actions:**
1. Update problem generation to create clean titles without UUIDs
2. Update solution templates to generate class-based code
3. Ensure consistency across all generated content

## 🧪 Testing Requirements

### Test Cases:
1. **Title Display**: Verify UI shows clean titles ("Self-Attention", not "0e2ff...LLM Implementation: Self-Attention")
2. **Code Templates**: Confirm all templates use class-based architecture
3. **API Response**: Check that backend returns clean titles
4. **Frontend Consistency**: Ensure frontend and backend titles match
5. **Functionality**: Verify all features work with updated titles and templates

### Expected Results:
- **Clean Titles**: "Self-Attention", "Kv-Cache", "Greedy Search"
- **Class Templates**: All code uses proper OOP class structure
- **Professional UI**: Clean, concise problem titles in the interface
- **Consistent Data**: Backend and frontend show identical clean titles

## 🎨 UI/UX Improvements

### Visual Enhancements:
1. **Shorter Titles**: More space for other UI elements
2. **Professional Look**: Clean, academic-style problem names
3. **Better Readability**: No UUID clutter in the interface
4. **Consistent Branding**: Focus on the core ML/AI concepts

### Code Quality:
1. **OOP Structure**: Class-based templates promote better coding practices
2. **Initialization**: Proper class constructors with parameters
3. **Method Organization**: Logical grouping of functionality in class methods
4. **Example Usage**: Clear instantiation and usage patterns

## 🔍 Validation Checklist

- [ ] All 3 problem titles are clean (no UUIDs, no "LLM Implementation:" prefix)
- [ ] Backend API returns clean titles
- [ ] Frontend displays clean titles in problem list
- [ ] All code templates use class-based architecture
- [ ] Class templates include proper `__init__` methods
- [ ] Class templates include relevant methods for the topic
- [ ] Example usage shows class instantiation
- [ ] No compilation errors in TypeScript
- [ ] UI layout looks clean with shorter titles
- [ ] All functionality works with updated titles and templates

## 🚀 Implementation Priority

1. **High Priority**: Clean problem titles in both backend and frontend
2. **High Priority**: Convert code templates to class-based architecture
3. **Medium Priority**: Update problem generator templates for future problems
4. **Low Priority**: UI/UX polish and visual improvements

## 📝 Notes

- **Keep IDs Unchanged**: Only modify titles, not the unique identifiers
- **Maintain Functionality**: Ensure all existing features continue to work
- **Class Design**: Use appropriate class names that reflect the ML/AI concept
- **Template Quality**: Ensure class templates are educational and well-structured
- **Consistency**: Maintain consistent naming and structure across all 3 problems

This cleanup will result in a professional ML/AI coding platform with clean titles and proper object-oriented code templates.
