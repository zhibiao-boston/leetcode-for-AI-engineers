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
  layoutTrigger?: number; // New prop to trigger layout updates
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
  externalCode,
  layoutTrigger = 0
}) => {
  const [code, setCode] = useState(initialCode || DEFAULT_TEMPLATE);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [editorInstance, setEditorInstance] = useState<any>(null);

  // Suppress ResizeObserver errors for Monaco Editor
  useEffect(() => {
    const handleResizeObserverError = (e: ErrorEvent) => {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleResizeObserverError);
    return () => window.removeEventListener('error', handleResizeObserverError);
  }, []);

  // Ensure code is properly initialized
  useEffect(() => {
    if (!code || code === DEFAULT_TEMPLATE) {
      setCode(initialCode || DEFAULT_TEMPLATE);
    }
  }, [initialCode, code]);

  // Manual layout handling for Monaco Editor
  useEffect(() => {
    if (!editorInstance) return;

    const resizeObserver = new ResizeObserver((entries) => {
      // Manually trigger layout when container resizes
      if (entries.length > 0) {
        setTimeout(() => {
          editorInstance.layout();
        }, 0);
      }
    });

    // Observe the editor container and its parent containers
    const editorContainer = document.querySelector('.monaco-editor');
    const parentContainer = editorContainer?.parentElement;
    
    if (editorContainer) {
      resizeObserver.observe(editorContainer);
    }
    if (parentContainer) {
      resizeObserver.observe(parentContainer);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [editorInstance]);

  // Force layout when component dimensions change
  useEffect(() => {
    if (editorInstance) {
      const timeoutId = setTimeout(() => {
        editorInstance.layout();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [editorInstance]);

  // Handle window resize events
  useEffect(() => {
    if (!editorInstance) return;

    const handleResize = () => {
      setTimeout(() => {
        editorInstance.layout();
      }, 50);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [editorInstance]);

  // Handle layout trigger from parent component
  useEffect(() => {
    if (editorInstance && layoutTrigger > 0) {
      setTimeout(() => {
        editorInstance.layout();
      }, 50);
    }
  }, [editorInstance, layoutTrigger]);

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

  // Only update editor value when external code changes (not from user typing)
  useEffect(() => {
    if (editorInstance && externalCode && externalCode !== editorInstance.getValue()) {
      editorInstance.setValue(externalCode);
    }
  }, [editorInstance, externalCode]);

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange?.(newCode);
    console.log('Code changed:', newCode.substring(0, 50) + '...');
  };

  const handleRun = async () => {
    if (!onRun) {
      console.log('No onRun function provided');
      return;
    }
    
    console.log('Running code:', code.substring(0, 100) + '...');
    setIsRunning(true);
    setError(null);
    setOutput('Running...');
    setExecutionTime(null);
    
    try {
      const result = await onRun(code);
      console.log('Run result:', result);
      setOutput(result.output);
      setExecutionTime(result.executionTime);
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error('Run error:', err);
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
    <div className="bg-gray-800 w-full h-full">
      {/* Editor Header - Conditional rendering */}
      {showHeader && (
        <div className="bg-gray-900 px-4 py-2 border-b border-gray-700 flex items-center justify-end">
          <div className="flex space-x-2">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm"
            >
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
            <button
              onClick={handleClear}
              className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded-md transition-colors duration-200 text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Code Editor */}
      <div 
        style={{ height, width: '100%' }} 
        className="bg-gray-800 w-full h-full"
        onClick={() => {
          if (editorInstance) {
            editorInstance.focus();
          }
        }}
      >
        <Editor
          height="100%"
          width="100%"
          defaultLanguage="python"
          language="python"
          value={code || initialCode || DEFAULT_TEMPLATE}
          onChange={handleCodeChange}
          onMount={(editor) => {
            console.log('Monaco Editor mounted successfully');
            setEditorInstance(editor);
            
            // Ensure the editor has the correct initial content
            const editorValue = editor.getValue();
            const targetValue = initialCode || DEFAULT_TEMPLATE;
            
            if (!editorValue || editorValue.trim() === '') {
              editor.setValue(targetValue);
            }
            
            // Focus the editor after mounting
            setTimeout(() => {
              editor.focus();
              editor.layout();
            }, 100);
            
            // Prevent editor from losing focus during typing
            editor.onDidFocusEditorText(() => {
              console.log('Editor focused');
            });
            
            editor.onDidBlurEditorText(() => {
              console.log('Editor blurred');
            });
          }}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: false,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            readOnly: false,
            selectOnLineNumbers: true,
            roundedSelection: false,
            cursorStyle: 'line',
            contextmenu: true,
            mouseWheelZoom: true,
            smoothScrolling: true,
            cursorBlinking: 'blink',
            cursorSmoothCaretAnimation: 'on',
            renderWhitespace: 'selection',
            renderControlCharacters: false,
            // Focus and interaction options
            acceptSuggestionOnEnter: 'on',
            acceptSuggestionOnCommitCharacter: true,
            autoClosingBrackets: 'languageDefined',
            autoClosingQuotes: 'languageDefined',
            autoIndent: 'full',
            autoSurround: 'languageDefined',
            // Prevent focus issues
            disableLayerHinting: true,
            disableMonospaceOptimizations: true,
            fixedOverflowWidgets: true,
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
