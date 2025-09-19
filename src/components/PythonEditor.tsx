import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { useTheme } from '../contexts/ThemeContext';

interface PythonEditorProps {
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => Promise<RunResult>;
  height?: string;
  showHeader?: boolean;
  triggerRun?: number;
  triggerClear?: number;
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
  triggerClear = 0
}) => {
  const { theme } = useTheme();
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

  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Force editor to take full width
    const editorElement = editor.getDomNode();
    if (editorElement) {
      editorElement.style.width = '100%';
      editorElement.style.minWidth = '100%';
      editorElement.style.maxWidth = '100%';
      editorElement.style.flex = '1';
      
      const parentElement = editorElement.parentElement;
      if (parentElement) {
        parentElement.style.width = '100%';
        parentElement.style.minWidth = '100%';
        parentElement.style.flex = '1';
      }
    }
  };

  return (
    <div className={`rounded-lg overflow-hidden w-full transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
    }`}>
      {/* Editor Header - Conditional rendering */}
      {showHeader && (
        <div className={`px-4 py-2 border-b transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200'
        }`}>
          <div className={`text-sm transition-colors duration-200 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Python Editor
          </div>
        </div>
      )}

      {/* Code Editor */}
      <div style={{ height, width: '100%', minWidth: '100%' }}>
        <Editor
          height="100%"
          width="100%"
          defaultLanguage="python"
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          theme={theme === 'dark' ? 'vs-dark' : 'vs'}
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
        <div className={`border-t p-4 transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className={`text-sm font-medium transition-colors duration-200 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Output:</h4>
            {executionTime && (
              <span className={`text-xs transition-colors duration-200 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Executed in {executionTime}ms
              </span>
            )}
          </div>
          <pre className={`text-sm font-mono whitespace-pre-wrap p-3 rounded border transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-200 text-gray-800'
          }`}>
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
