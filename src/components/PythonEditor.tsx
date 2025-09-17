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
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm"
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
