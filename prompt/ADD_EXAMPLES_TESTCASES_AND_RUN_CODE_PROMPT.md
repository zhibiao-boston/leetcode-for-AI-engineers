# Add Examples, Test Cases, and Run Code Functionality

## 🎯 Goals
1. **Add Examples section** below problem description (as shown in image 2)
2. **Add Test Cases section** with interactive case tabs (as shown in image 3)
3. **Implement "Run Code" functionality** to display output when clicked

## 🔍 Current State Analysis

### What's Missing:
1. **Examples Section**: Currently not displaying examples from the problem data
2. **Test Cases Section**: Not showing the interactive test case tabs
3. **Run Code Output**: "Run Code" button exists but doesn't show execution results

### What's Available:
- **Problem Data**: Examples and test cases are already in the data structure
- **Code Editor**: Monaco Editor is working
- **Run Code Button**: Button exists but needs output functionality

## 📋 Implementation Tasks

### Task 1: Add Examples Section (Image 2 Style)

**Location**: `frontend/src/components/QuestionDetails.tsx`

**Requirements**:
- Display examples below the problem description
- Show Input/Output side by side
- Include explanation text
- Use proper styling to match the design

**Implementation**:
```jsx
{/* Examples Section */}
{question.examples && question.examples.length > 0 && (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-3 text-white">Examples</h3>
    <div className="space-y-4">
      {question.examples.map((example, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div className="text-sm text-gray-400 mb-1">Example {index + 1} Input:</div>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-sm font-mono">
                {example.input}
              </pre>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Example {index + 1} Output:</div>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-sm font-mono">
                {example.output}
              </pre>
            </div>
          </div>
          {example.explanation && (
            <div className="text-gray-300 text-sm">
              <strong>Explanation:</strong> {example.explanation}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}
```

### Task 2: Add Test Cases Section (Image 3 Style)

**Location**: `frontend/src/components/QuestionDetails.tsx`

**Requirements**:
- Display test cases at the bottom of the page
- Show "Case 1", "Case 2" tabs (green active state)
- Display Input and Expected Output sections
- Interactive tab switching

**Implementation**:
```jsx
{/* Test Cases Section */}
{question.testCases && question.testCases.length > 0 && (
  <div className="border-t border-gray-700 mt-6 pt-4">
    {/* Test Case Tabs */}
    <div className="flex space-x-2 mb-4">
      {question.testCases.slice(0, 2).map((testCase, index) => (
        <button
          key={testCase.id}
          onClick={() => setActiveTestCaseTab(index)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTestCaseTab === index
              ? 'bg-green-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Case {index + 1}
        </button>
      ))}
    </div>
    
    {/* Test Case Content */}
    {question.testCases[activeTestCaseTab] && (
      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-400 mb-2">Input:</div>
          <div className="bg-gray-800 rounded p-3 border border-gray-700">
            <pre className="text-gray-100 text-sm font-mono whitespace-pre-wrap">
              {question.testCases[activeTestCaseTab].input}
            </pre>
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-400 mb-2">Expected Output:</div>
          <div className="bg-gray-800 rounded p-3 border border-gray-700">
            <pre className="text-gray-100 text-sm font-mono whitespace-pre-wrap">
              {question.testCases[activeTestCaseTab].expectedOutput}
            </pre>
          </div>
        </div>
      </div>
    )}
  </div>
)}
```

### Task 3: Implement Run Code Functionality

**Location**: `frontend/src/components/QuestionDetails.tsx`

**Requirements**:
- Execute code when "Run Code" button is clicked
- Display execution output
- Show execution time
- Handle errors gracefully
- Support multiple programming languages

**State Management**:
```jsx
const [codeOutput, setCodeOutput] = useState<string>('');
const [executionTime, setExecutionTime] = useState<number | null>(null);
const [codeError, setCodeError] = useState<string | null>(null);
const [isRunning, setIsRunning] = useState(false);
```

**Implementation**:
```jsx
const handleCodeRun = async (code: string) => {
  if (!code.trim()) {
    setCodeError('No code to execute');
    return;
  }

  setIsRunning(true);
  setCodeError(null);
  setCodeOutput('');
  
  try {
    const startTime = Date.now();
    
    // Simulate code execution (replace with actual execution logic)
    const result = await simulateCodeExecution(code, selectedLanguage);
    
    const executionTime = Date.now() - startTime;
    
    setCodeOutput(result.output);
    setExecutionTime(executionTime);
    
    if (result.error) {
      setCodeError(result.error);
    }
  } catch (error) {
    setCodeError(error.message || 'Execution failed');
  } finally {
    setIsRunning(false);
  }
};

const simulateCodeExecution = async (code: string, language: string) => {
  // Simulate execution delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // Simple simulation based on language and code content
  if (language === 'python') {
    if (code.includes('print')) {
      return { output: 'Hello, World!\nExecution completed successfully.' };
    } else if (code.includes('def solve')) {
      return { output: 'Function defined successfully.\nReady for execution.' };
    } else {
      return { output: 'Code executed successfully.' };
    }
  } else if (language === 'java') {
    return { output: 'Java code compiled and executed successfully.' };
  } else if (language === 'cpp') {
    return { output: 'C++ code compiled and executed successfully.' };
  }
  
  return { output: 'Code executed successfully.' };
};
```

**Output Display**:
```jsx
{/* Code Execution Output */}
{(codeOutput || codeError) && (
  <div className="mt-4 p-4 bg-gray-900 rounded border border-gray-700">
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-sm font-medium text-gray-300">Output</h4>
      {executionTime && (
        <span className="text-xs text-gray-500">
          Executed in {executionTime}ms
        </span>
      )}
    </div>
    
    {codeError ? (
      <pre className="text-red-400 text-sm font-mono whitespace-pre-wrap">
        Error: {codeError}
      </pre>
    ) : (
      <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
        {codeOutput}
      </pre>
    )}
  </div>
)}
```

### Task 4: Update Problem Data Structure

**Ensure Examples and Test Cases Are Available**:

**Backend**: `backend/src/config/generated-problems.ts`
```typescript
{
  id: "0e2ff27d-dccb-4f44-9390-9262da3fafec",
  title: "Self-Attention",
  description: "Implement the self-attention mechanism...",
  examples: [
    {
      input: "attention = SelfAttention(d_model=512)\noutput = attention(query, key, value)",
      output: "tensor([[0.1, 0.2, ...], [0.3, 0.4, ...]])",
      explanation: "Compute self-attention with scaled dot-product"
    }
  ],
  testCases: [
    {
      id: "sa-1",
      input: "attention = SelfAttention(512, 8)\nresult = attention.forward(q, k, v)",
      expectedOutput: "attention_weights, attention_output",
      description: "Basic self-attention computation",
      isQuickTest: true
    },
    {
      id: "sa-2", 
      input: "attention.compute_scores(query, key)",
      expectedOutput: "attention_scores_matrix",
      description: "Attention score computation",
      isQuickTest: true
    }
  ]
}
```

**Frontend**: `frontend/src/data/questions.ts`
```typescript
// Ensure all 3 problems have proper examples and testCases
// Update the existing problems to include rich examples and test cases
```

## 🎨 UI/UX Design Requirements

### Examples Section (Image 2):
- **Layout**: Two-column grid (Input | Output)
- **Styling**: Dark theme with gray-800 background
- **Typography**: Monospace font for code, regular for explanations
- **Spacing**: Proper margins and padding for readability

### Test Cases Section (Image 3):
- **Tab Design**: Green active state, gray inactive
- **Content Areas**: Input and Expected Output sections
- **Interactive**: Clickable tabs to switch between test cases
- **Positioning**: Bottom of the problem details area

### Run Code Output:
- **Success State**: Green text for successful execution
- **Error State**: Red text for errors
- **Execution Time**: Display execution time in milliseconds
- **Scrollable**: Handle long outputs with proper scrolling

## 🧪 Testing Requirements

### Test Cases:
1. **Examples Display**: Verify examples show below description
2. **Test Case Tabs**: Confirm tabs are clickable and switch content
3. **Run Code Basic**: Test "Run Code" button shows output
4. **Run Code Error**: Test error handling for invalid code
5. **Multi-Language**: Test code execution for Python, Java, C++
6. **Responsive**: Ensure UI works on different screen sizes

### Expected Results:
- **Rich Problem Display**: Examples and test cases visible for all 3 problems
- **Interactive Test Cases**: Clickable tabs with proper content switching
- **Working Code Execution**: "Run Code" button produces visible output
- **Professional UI**: Matches the design shown in the images

## 🔧 Technical Implementation

### State Management:
```jsx
// Add to QuestionDetails component
const [activeTestCaseTab, setActiveTestCaseTab] = useState(0);
const [codeOutput, setCodeOutput] = useState<string>('');
const [executionTime, setExecutionTime] = useState<number | null>(null);
const [codeError, setCodeError] = useState<string | null>(null);
const [isRunning, setIsRunning] = useState(false);
```

### Event Handlers:
```jsx
// Update existing Run Code button handler
const handleRunCodeClick = () => {
  const currentCode = getCurrentCodeFromEditor();
  handleCodeRun(currentCode);
};
```

### Integration Points:
- **Monaco Editor**: Get current code content
- **Problem Data**: Access examples and testCases from question object
- **Language Selection**: Support Python, Java, C++ execution simulation
- **UI State**: Manage tab selection and output display

## 🎯 Success Criteria

### Visual Verification:
- [ ] Examples section appears below description (matches image 2)
- [ ] Test cases section appears at bottom with tabs (matches image 3)
- [ ] "Run Code" button produces visible output
- [ ] Tab switching works correctly (Case 1, Case 2)
- [ ] Output area shows execution results

### Functional Verification:
- [ ] All 3 problems show examples and test cases
- [ ] Code execution works for all programming languages
- [ ] Error handling works for invalid code
- [ ] Execution time is displayed
- [ ] UI remains responsive during code execution

## 📝 Implementation Priority

1. **High Priority**: Add Examples section (most visible improvement)
2. **High Priority**: Implement Run Code output display
3. **Medium Priority**: Add Test Cases section with tabs
4. **Low Priority**: Enhanced code execution simulation and error handling

## 🎨 Design Notes

- **Dark Theme**: Use gray-800/gray-900 backgrounds to match existing design
- **Green Accents**: Use green for active test case tabs and success output
- **Red for Errors**: Use red text for error messages
- **Consistent Spacing**: Match existing component spacing and margins
- **Professional Look**: Clean, educational interface for coding practice

This implementation will transform the basic problem view into a rich, interactive coding environment with examples, test cases, and live code execution feedback.
