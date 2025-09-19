# Add Resizable Layout and Enhanced Features

## 🎯 Goals
1. **Add window divisor** to adjust window size between problem description and code editor
2. **Add examples section** with example input and output under problem description
3. **Add test results** (Case 1, Case 2) functionality for problems

## 🔍 Current State Analysis

### What's Working:
- **Fixed Layout**: Problem description on left, code editor on right
- **Basic Examples**: Some examples display but need enhancement
- **Test Cases**: Basic test case structure exists
- **Run Code**: Code execution with output display

### What Needs Enhancement:
1. **No Resizable Divisor**: Fixed 40%/60% layout, not adjustable
2. **Examples Need Improvement**: Need better formatting and visibility
3. **Test Results Missing**: No interactive test case execution results

## 📋 Implementation Tasks

### Task 1: Add Resizable Window Divisor

**Location**: `frontend/src/App.tsx` (HomePage component)

**Requirements**:
- Draggable divider between problem list and problem details
- Adjustable width from 20% to 80% for left panel
- Visual feedback during resize (cursor change, hover effects)
- Persistent resize state during session

**Implementation**:
```jsx
// Add state for panel width
const [leftPanelWidth, setLeftPanelWidth] = useState(40); // Percentage
const [isResizing, setIsResizing] = useState(false);

// Mouse event handlers for resizing
const handleMouseDown = (e: React.MouseEvent) => {
  setIsResizing(true);
  e.preventDefault();
};

const handleMouseMove = useCallback((e: MouseEvent) => {
  if (!isResizing) return;
  
  const containerWidth = window.innerWidth;
  const newWidth = (e.clientX / containerWidth) * 100;
  
  // Constrain between 20% and 80%
  const constrainedWidth = Math.min(Math.max(newWidth, 20), 80);
  setLeftPanelWidth(constrainedWidth);
}, [isResizing]);

const handleMouseUp = useCallback(() => {
  setIsResizing(false);
}, []);

// Add event listeners
useEffect(() => {
  if (isResizing) {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }
}, [isResizing, handleMouseMove, handleMouseUp]);

// JSX Layout with resizable divider
<div className="flex h-screen pt-16">
  {/* Left Panel - Problem List */}
  <div 
    className="border-r border-gray-700"
    style={{ width: `${leftPanelWidth}%` }}
  >
    <QuestionList />
  </div>
  
  {/* Resizable Divider */}
  <div
    className={`w-1 bg-gray-600 hover:bg-purple-500 cursor-col-resize transition-colors ${
      isResizing ? 'bg-purple-500' : ''
    }`}
    onMouseDown={handleMouseDown}
  />
  
  {/* Right Panel - Problem Details */}
  <div 
    className="flex-1"
    style={{ width: `${100 - leftPanelWidth}%` }}
  >
    <QuestionDetails />
  </div>
</div>
```

### Task 2: Enhanced Examples Section

**Location**: `frontend/src/components/QuestionDetails.tsx`

**Requirements**:
- Clear "Examples" heading
- Well-formatted input/output blocks
- Proper explanation text
- Visual separation between examples
- Responsive design

**Implementation**:
```jsx
{/* Enhanced Examples Section */}
<div className="mb-8">
  <h2 className="text-xl font-semibold mb-4 text-white">Examples</h2>
  <div className="space-y-6">
    {question.examples?.map((example, index) => (
      <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm font-medium text-gray-400 mb-2">
              Example {index + 1} Input:
            </div>
            <div className="bg-gray-900 rounded p-3 border border-gray-600">
              <pre className="text-gray-100 text-sm font-mono whitespace-pre-wrap">
                {example.input}
              </pre>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-400 mb-2">
              Example {index + 1} Output:
            </div>
            <div className="bg-gray-900 rounded p-3 border border-gray-600">
              <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                {example.output}
              </pre>
            </div>
          </div>
        </div>
        {example.explanation && (
          <div className="text-gray-300 text-sm">
            <span className="font-medium text-gray-200">Explanation:</span> {example.explanation}
          </div>
        )}
      </div>
    ))}
  </div>
</div>
```

### Task 3: Interactive Test Results

**Location**: `frontend/src/components/QuestionDetails.tsx`

**Requirements**:
- Case 1, Case 2 tabs with active state styling
- Execute test cases and show results
- Pass/fail indicators with checkmarks/X marks
- Actual vs Expected output comparison
- Execution time for each test case

**State Management**:
```jsx
const [activeTestCase, setActiveTestCase] = useState(0);
const [testResults, setTestResults] = useState<{
  [key: string]: {
    passed: boolean;
    actualOutput: string;
    expectedOutput: string;
    executionTime: number;
    error?: string;
  }
}>({});
```

**Implementation**:
```jsx
// Test case execution function
const executeTestCase = async (testCase: any, code: string) => {
  const startTime = Date.now();
  
  try {
    // Simulate test case execution
    const result = await simulateTestCaseExecution(code, testCase.input, testCase.expectedOutput);
    const executionTime = Date.now() - startTime;
    
    return {
      passed: result.actualOutput === testCase.expectedOutput,
      actualOutput: result.actualOutput,
      expectedOutput: testCase.expectedOutput,
      executionTime,
      error: result.error
    };
  } catch (error) {
    return {
      passed: false,
      actualOutput: '',
      expectedOutput: testCase.expectedOutput,
      executionTime: Date.now() - startTime,
      error: error.message
    };
  }
};

// Test Results UI
{/* Test Results Section */}
<div className="mt-6 border-t border-gray-700 pt-6">
  <h3 className="text-lg font-semibold mb-4 text-white">Test Cases</h3>
  
  {/* Test Case Tabs */}
  <div className="flex space-x-2 mb-4">
    {question.testCases?.slice(0, 2).map((testCase, index) => {
      const result = testResults[testCase.id];
      return (
        <button
          key={testCase.id}
          onClick={() => setActiveTestCase(index)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
            activeTestCase === index
              ? 'bg-green-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <span>Case {index + 1}</span>
          {result && (
            <span className={result.passed ? 'text-green-300' : 'text-red-300'}>
              {result.passed ? '✓' : '✗'}
            </span>
          )}
        </button>
      );
    })}
  </div>
  
  {/* Active Test Case Content */}
  {question.testCases?.[activeTestCase] && (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-medium text-gray-400 mb-2">Input:</div>
          <div className="bg-gray-900 rounded p-3 border border-gray-600">
            <pre className="text-gray-100 text-sm font-mono whitespace-pre-wrap">
              {question.testCases[activeTestCase].input}
            </pre>
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-400 mb-2">Expected Output:</div>
          <div className="bg-gray-900 rounded p-3 border border-gray-600">
            <pre className="text-gray-100 text-sm font-mono whitespace-pre-wrap">
              {question.testCases[activeTestCase].expectedOutput}
            </pre>
          </div>
        </div>
      </div>
      
      {/* Test Result Display */}
      {testResults[question.testCases[activeTestCase].id] && (
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-400 mb-2">Test Result:</div>
          <div className={`rounded p-3 border ${
            testResults[question.testCases[activeTestCase].id].passed
              ? 'bg-green-900 border-green-600'
              : 'bg-red-900 border-red-600'
          }`}>
            <div className={`text-sm font-medium mb-2 ${
              testResults[question.testCases[activeTestCase].id].passed
                ? 'text-green-300'
                : 'text-red-300'
            }`}>
              {testResults[question.testCases[activeTestCase].id].passed ? '✓ PASSED' : '✗ FAILED'}
              <span className="ml-2 text-gray-400">
                ({testResults[question.testCases[activeTestCase].id].executionTime}ms)
              </span>
            </div>
            
            {!testResults[question.testCases[activeTestCase].id].passed && (
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-400">Actual Output:</div>
                  <pre className="text-red-300 text-sm font-mono bg-gray-800 p-2 rounded">
                    {testResults[question.testCases[activeTestCase].id].actualOutput}
                  </pre>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Expected Output:</div>
                  <pre className="text-green-300 text-sm font-mono bg-gray-800 p-2 rounded">
                    {testResults[question.testCases[activeTestCase].id].expectedOutput}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )}
</div>
```

### Task 4: Enhanced Problem Data

**Update Problem Data**: Ensure all 3 problems have rich examples and test cases

**Self-Attention Problem**:
```typescript
{
  id: "0e2ff27d-dccb-4f44-9390-9262da3fafec",
  title: "Self-Attention",
  description: "Implement the self-attention mechanism used in Transformer models. Calculate attention weights and apply them to values.",
  examples: [
    {
      input: "attention = SelfAttention(d_model=512, num_heads=8)\nquery = torch.randn(1, 10, 512)\nkey = torch.randn(1, 10, 512)\nvalue = torch.randn(1, 10, 512)\noutput = attention(query, key, value)",
      output: "torch.Size([1, 10, 512])\nAttention weights computed successfully",
      explanation: "Compute self-attention with multi-head mechanism"
    },
    {
      input: "attention.compute_attention_weights(query, key)",
      output: "torch.Size([1, 8, 10, 10])\nScaled dot-product attention weights",
      explanation: "Calculate attention weights using scaled dot-product"
    }
  ],
  testCases: [
    {
      id: "sa-1",
      input: "attention = SelfAttention(512, 8)\nresult = attention.forward(q, k, v)",
      expectedOutput: "attention_output_tensor",
      description: "Basic self-attention computation",
      isQuickTest: true
    },
    {
      id: "sa-2",
      input: "weights = attention.compute_scores(query, key)",
      expectedOutput: "attention_weights_matrix",
      description: "Attention score computation",
      isQuickTest: true
    }
  ]
}
```

**Kv-Cache Problem**:
```typescript
{
  id: "207c7383-c2b8-48eb-b8af-9bc9478e333e",
  title: "Kv-Cache",
  description: "Implement key-value caching for efficient transformer inference. Manage cache updates and retrieval for sequential generation.",
  examples: [
    {
      input: "cache = KVCache(max_seq_len=2048, num_layers=12)\ncache.update(layer=0, key=k_tensor, value=v_tensor)\ncached_kv = cache.get(layer=0)",
      output: "Cache updated successfully\nRetrieved: (key_tensor, value_tensor)",
      explanation: "Update and retrieve key-value pairs from cache"
    },
    {
      input: "cache.initialize_cache(batch_size=2, seq_len=100)\nprint(cache.get_cache_size())",
      output: "Cache initialized for batch_size=2, seq_len=100\nCache size: 2.4 MB",
      explanation: "Initialize cache and check memory usage"
    }
  ],
  testCases: [
    {
      id: "kv-1",
      input: "cache = KVCache(1024, 6)\ncache.set('layer_0', key, value)",
      expectedOutput: "True",
      description: "Cache set operation",
      isQuickTest: true
    },
    {
      id: "kv-2",
      input: "cached_data = cache.get('layer_0')",
      expectedOutput: "(key_tensor, value_tensor)",
      description: "Cache retrieval operation",
      isQuickTest: true
    }
  ]
}
```

**Greedy Search Problem**:
```typescript
{
  id: "6731795c-f9f8-48bd-bf14-66985da810d2",
  title: "Greedy Search",
  description: "Implement greedy search decoding for language model generation. Select the most probable next token at each step.",
  examples: [
    {
      input: "decoder = GreedyDecoder(vocab_size=50000)\ninput_ids = [1, 2, 3]\noutput = decoder.generate(input_ids, max_length=10)",
      output: "[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nGeneration completed in 5 steps",
      explanation: "Generate sequence using greedy decoding strategy"
    },
    {
      input: "logits = torch.randn(1, 50000)\nnext_token = decoder.select_next_token(logits)",
      output: "Token ID: 12345\nConfidence: 0.85",
      explanation: "Select highest probability token from logits"
    }
  ],
  testCases: [
    {
      id: "gs-1",
      input: "decoder = GreedyDecoder(1000)\nresult = decoder.decode([1, 2, 3])",
      expectedOutput: "[1, 2, 3, 4]",
      description: "Basic greedy decoding",
      isQuickTest: true
    },
    {
      id: "gs-2",
      input: "token = decoder.select_best(logits)",
      expectedOutput: "argmax_token_id",
      description: "Token selection",
      isQuickTest: true
    }
  ]
}
```

## 🎨 UI/UX Design Requirements

### Resizable Divider:
- **Visual Indicator**: 1px wide gray line that becomes purple on hover
- **Cursor Change**: Show col-resize cursor when hovering
- **Smooth Transition**: Animate color changes
- **Constraints**: Minimum 20%, maximum 80% for left panel
- **Feedback**: Visual feedback during active resizing

### Enhanced Examples:
- **Clear Heading**: "Examples" with proper typography
- **Code Blocks**: Dark background with syntax highlighting
- **Output Styling**: Green text for outputs to distinguish from inputs
- **Explanations**: Clear, readable explanation text
- **Spacing**: Proper margins and padding for readability

### Test Results:
- **Tab Design**: Green for active, gray for inactive
- **Status Indicators**: ✓ for pass, ✗ for fail
- **Result Display**: Color-coded success/failure states
- **Comparison View**: Side-by-side actual vs expected when failed
- **Execution Time**: Display timing for each test case

## 🔧 Technical Implementation

### Resizable Layout Structure:
```jsx
<div className="flex h-screen pt-16">
  {/* Left Panel */}
  <div style={{ width: `${leftPanelWidth}%` }}>
    {/* Problem description and examples */}
  </div>
  
  {/* Resizable Divider */}
  <div 
    className="resizable-divider"
    onMouseDown={handleMouseDown}
  />
  
  {/* Right Panel */}
  <div style={{ width: `${100 - leftPanelWidth}%` }}>
    {/* Code editor and test results */}
  </div>
</div>
```

### Test Case Execution:
```jsx
const runTestCase = async (testCase: TestCase, code: string) => {
  const startTime = Date.now();
  
  try {
    // Execute code with test case input
    const result = await executeCodeWithInput(code, testCase.input);
    const executionTime = Date.now() - startTime;
    
    const testResult = {
      passed: result.output === testCase.expectedOutput,
      actualOutput: result.output,
      expectedOutput: testCase.expectedOutput,
      executionTime,
      error: result.error
    };
    
    // Update test results state
    setTestResults(prev => ({
      ...prev,
      [testCase.id]: testResult
    }));
    
    return testResult;
  } catch (error) {
    const executionTime = Date.now() - startTime;
    const testResult = {
      passed: false,
      actualOutput: '',
      expectedOutput: testCase.expectedOutput,
      executionTime,
      error: error.message
    };
    
    setTestResults(prev => ({
      ...prev,
      [testCase.id]: testResult
    }));
    
    return testResult;
  }
};
```

## 🧪 Testing Requirements

### Resizable Divider Tests:
- [ ] Divider is visible between panels
- [ ] Cursor changes to col-resize on hover
- [ ] Dragging adjusts panel widths
- [ ] Width constraints work (20%-80%)
- [ ] Visual feedback during resize

### Examples Tests:
- [ ] Examples display below description
- [ ] Input/output formatted correctly
- [ ] Explanations are readable
- [ ] Responsive on different screen sizes

### Test Results Tests:
- [ ] Test case tabs are clickable
- [ ] Active tab shows green styling
- [ ] Pass/fail indicators work
- [ ] Execution time displays
- [ ] Actual vs expected comparison works

## 🎯 Success Criteria

### Visual Verification:
- [ ] Resizable divider visible and functional
- [ ] Enhanced examples section matches design
- [ ] Test case tabs with proper styling
- [ ] Pass/fail indicators working
- [ ] Professional, clean interface

### Functional Verification:
- [ ] Panel resizing works smoothly
- [ ] Examples display rich content
- [ ] Test cases execute and show results
- [ ] Error handling works correctly
- [ ] Multi-language support maintained

## 📝 Implementation Priority

1. **High Priority**: Add resizable divider (major UX improvement)
2. **High Priority**: Enhance examples section (content visibility)
3. **Medium Priority**: Implement test results functionality
4. **Low Priority**: Polish and performance optimizations

## 🎨 Design Notes

- **Consistent Theming**: Use existing dark theme colors
- **Professional Look**: Clean, educational interface
- **Responsive Design**: Works on different screen sizes
- **Accessibility**: Proper cursor indicators and visual feedback
- **Performance**: Smooth animations and transitions

This implementation will create a professional, interactive coding environment with adjustable layout, rich examples, and comprehensive test case functionality.
