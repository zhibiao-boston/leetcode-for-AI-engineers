# Add Python Code Editor Card - Feature Request

## 🎯 **Goal**
Add a new Python code editor card under the Tags section that allows users to write, edit, and run Python code for solving the LLM coding problems.

## 📋 **Requirements**

### **1. Visual Design**
- **Location**: Position directly under the existing Tags section
- **Style**: Code editor interface with syntax highlighting
- **Size**: Large enough to accommodate code editing (minimum 400px height)
- **Theme**: Dark theme matching the existing application design
- **Border**: Subtle border with rounded corners consistent with the app

### **2. Functionality**
- **Code Editor**: Full-featured Python code editor with syntax highlighting
- **Run Button**: Execute Python code and display results
- **Clear Button**: Clear the editor content
- **Auto-save**: Save code automatically as user types
- **Error Handling**: Display Python errors and exceptions clearly
- **Output Display**: Show execution results in a separate output area

### **3. User Experience**
- **Default Template**: Pre-populate with basic Solution class structure
- **Syntax Highlighting**: Python syntax highlighting for better readability
- **Line Numbers**: Show line numbers for easier navigation
- **Indentation**: Proper Python indentation support
- **Keyboard Shortcuts**: 
  - `Ctrl+Enter` or `Cmd+Enter` to run code
  - `Ctrl+A` to select all
  - `Tab` for indentation
- **Responsive**: Adapt to different screen sizes

## 🛠️ **Technical Implementation**

### **Component Structure**
```typescript
interface PythonEditorProps {
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => Promise<RunResult>;
  theme?: 'dark' | 'light';
  height?: string;
}

interface RunResult {
  output: string;
  error?: string;
  executionTime: number;
}

const PythonEditor: React.FC<PythonEditorProps> = ({
  initialCode = DEFAULT_PYTHON_TEMPLATE,
  onCodeChange,
  onRun,
  theme = 'dark',
  height = '400px'
}) => {
  // Implementation details
};
```

### **Default Python Template**
```python
class Solution:
    def solve(self, input_data):
        """
        Implement your solution here
        
        Args:
            input_data: The input data for the problem
            
        Returns:
            The solution result
        """
        # Your code here
        pass

# Example usage
if __name__ == "__main__":
    solution = Solution()
    # Test your solution here
    print("Solution ready!")
```

### **State Management**
- **Local State**: Use `useState` for editor content and output
- **Parent State**: Pass code changes and run results to parent component
- **Execution State**: Track running status (idle, running, completed, error)

### **Styling Classes**
```css
/* Editor container */
.python-editor-container {
  @apply bg-gray-800 border border-gray-700 rounded-lg overflow-hidden;
}

/* Editor header */
.editor-header {
  @apply bg-gray-900 px-4 py-2 border-b border-gray-700 flex justify-between items-center;
}

/* Code editor */
.code-editor {
  @apply bg-gray-800 text-gray-100 font-mono text-sm;
}

/* Output area */
.output-area {
  @apply bg-gray-900 border-t border-gray-700 p-4 text-sm font-mono;
}

/* Run button */
.run-button {
  @apply bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors duration-200;
}

/* Clear button */
.clear-button {
  @apply bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-md transition-colors duration-200;
}
```

## 📍 **Integration Points**

### **1. QuestionDetails Component**
- Add the `PythonEditor` component after the Tags section
- Position it below the current tag list
- Maintain consistent spacing and layout

### **2. Code Execution**
- **Client-side**: Use a Python execution service (e.g., Pyodide)
- **Server-side**: Send code to backend for execution (future enhancement)
- **Sandbox**: Execute code in a secure environment

### **3. Layout Integration**
```typescript
// In QuestionDetails.tsx
<div className="mt-8 pt-6 border-t border-gray-700">
  <h3 className="text-sm font-medium text-gray-400 mb-3">Tags</h3>
  <div className="flex flex-wrap gap-2">
    {/* Existing tags */}
    {question.tags.map((tag, index) => (
      <span key={index} className="tag-style">
        {tag}
      </span>
    ))}
  </div>
</div>

{/* New Python Editor Section */}
<div className="mt-8 pt-6 border-t border-gray-700">
  <h3 className="text-sm font-medium text-gray-400 mb-3">Python Editor</h3>
  <PythonEditor
    initialCode={getDefaultTemplate(question)}
    onCodeChange={handleCodeChange}
    onRun={handleCodeRun}
    height="400px"
  />
</div>
```

## 🎨 **Design Specifications**

### **Visual Hierarchy**
- **Size**: Minimum 400px height, expandable
- **Spacing**: Consistent with existing sections (`mt-8 pt-6`)
- **Alignment**: Full width within the question details panel
- **Typography**: Monospace font for code, regular font for UI elements

### **Color Scheme**
- **Background**: `bg-gray-800` (editor), `bg-gray-900` (header/output)
- **Border**: `border-gray-700` for subtle separation
- **Text**: `text-gray-100` for code, `text-gray-400` for labels
- **Accent**: `bg-primary` for run button
- **Error**: `text-red-400` for error messages

### **Interactive States**
1. **Default**: Dark editor with syntax highlighting
2. **Running**: Disabled run button, loading indicator
3. **Error**: Red error text in output area
4. **Success**: Green success text in output area

## 🚀 **Implementation Steps**

### **Phase 1: Basic Editor (Day 1)**
- Create `PythonEditor` component
- Implement basic code editor with syntax highlighting
- Add run and clear buttons
- Style to match existing design

### **Phase 2: Code Execution (Day 2)**
- Integrate Pyodide for client-side Python execution
- Add output display area
- Implement error handling
- Add execution time tracking

### **Phase 3: Enhanced UX (Day 3)**
- Add keyboard shortcuts
- Implement auto-save functionality
- Add loading states and animations
- Test with sample problems

## ✅ **Success Criteria**

### **Functional Requirements**
- [ ] Code editor with Python syntax highlighting
- [ ] Run button executes Python code
- [ ] Clear button resets editor content
- [ ] Output area displays results and errors
- [ ] Auto-save functionality works
- [ ] Keyboard shortcuts function properly

### **Visual Requirements**
- [ ] Matches existing dark theme
- [ ] Consistent spacing and layout
- [ ] Proper syntax highlighting
- [ ] Clear visual hierarchy
- [ ] Responsive design

### **Technical Requirements**
- [ ] TypeScript types defined
- [ ] Component is reusable
- [ ] State management works correctly
- [ ] No console errors or warnings
- [ ] Performance optimized

## 🔧 **Code Example**

### **Complete Component Implementation**
```typescript
import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';

interface PythonEditorProps {
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => Promise<RunResult>;
  height?: string;
}

interface RunResult {
  output: string;
  error?: string;
  executionTime: number;
}

const DEFAULT_TEMPLATE = `class Solution:
    def solve(self, input_data):
        """
        Implement your solution here
        
        Args:
            input_data: The input data for the problem
            
        Returns:
            The solution result
        """
        # Your code here
        pass

# Example usage
if __name__ == "__main__":
    solution = Solution()
    # Test your solution here
    print("Solution ready!")
`;

const PythonEditor: React.FC<PythonEditorProps> = ({
  initialCode = DEFAULT_TEMPLATE,
  onCodeChange,
  onRun,
  height = '400px'
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const handleRun = async () => {
    if (!onRun) return;
    
    setIsRunning(true);
    setError(null);
    setOutput('Running...');
    
    try {
      const result = await onRun(code);
      setOutput(result.output);
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setOutput('');
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setCode(DEFAULT_TEMPLATE);
    setOutput('');
    setError(null);
    onCodeChange?.(DEFAULT_TEMPLATE);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
      {/* Editor Header */}
      <div className="bg-gray-900 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-400">Python Editor</span>
        <div className="flex space-x-2">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="bg-primary hover:bg-primary-dark disabled:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm"
          >
            {isRunning ? 'Running...' : 'Run'}
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-md transition-colors duration-200 text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div style={{ height }}>
        <Editor
          height="100%"
          defaultLanguage="python"
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
          }}
        />
      </div>

      {/* Output Area */}
      {(output || error) && (
        <div className="bg-gray-900 border-t border-gray-700 p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Output:</h4>
          <pre className="text-sm font-mono text-gray-100 whitespace-pre-wrap">
            {error ? (
              <span className="text-red-400">{error}</span>
            ) : (
              output
            )}
          </pre>
        </div>
      )}
    </div>
  );
};

export default PythonEditor;
```

## 📦 **Dependencies**

### **Required Packages**
```json
{
  "@monaco-editor/react": "^4.6.0",
  "monaco-editor": "^0.45.0"
}
```

### **Installation**
```bash
npm install @monaco-editor/react monaco-editor
```

This prompt provides a comprehensive guide for implementing a Python code editor card that integrates seamlessly with the existing LLM Coding application design and provides a professional coding environment for users to solve problems.
