import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';

interface PythonEditorProps {
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => Promise<RunResult>;
  height?: string;
  showHeader?: boolean;
  triggerRun?: number;
  triggerClear?: number;
  externalCode?: string; // New prop for external code updates
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
  height = '400px',
  showHeader = true,
  triggerRun = 0,
  triggerClear = 0,
  externalCode
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  // Handle external trigger for run
  useEffect(() => {
    if (triggerRun > 0) {
      handleRun();
    }
  }, [triggerRun]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle external trigger for clear
  useEffect(() => {
    if (triggerClear > 0) {
      handleClear();
    }
  }, [triggerClear]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle external code updates
  useEffect(() => {
    if (externalCode && externalCode !== code) {
      setCode(externalCode);
      onCodeChange?.(externalCode);
    }
  }, [externalCode, code, onCodeChange]);

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
    setExecutionTime(null);
    
    try {
      const result = await onRun(code);
      setOutput(result.output);
      setExecutionTime(result.executionTime);
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
    setExecutionTime(null);
    onCodeChange?.(DEFAULT_TEMPLATE);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
      {/* Editor Header - Conditional rendering */}
      {showHeader && (
        <div className="bg-gray-900 px-4 py-2 border-b border-gray-700 flex justify-end">
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
      )}

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
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-400">Output:</h4>
            {executionTime && (
              <span className="text-xs text-gray-500">
                Executed in {executionTime}ms
              </span>
            )}
          </div>
          <pre className="text-sm font-mono text-gray-100 whitespace-pre-wrap bg-gray-800 p-3 rounded border">
            {error ? (
              <span className="text-red-400">❌ {error}</span>
            ) : (
              <span className="text-green-400">✅ {output}</span>
            )}
          </pre>
        </div>
      )}
    </div>
  );
};

export default PythonEditor;
