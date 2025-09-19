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
  externalCode?: string; // New prop for external code updates
  layoutTrigger?: number; // New prop to trigger layout updates
  language?: 'python' | 'java' | 'cpp'; // Language selection
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
  layoutTrigger = 0,
  language = 'python'
}) => {
  const { theme } = useTheme();
  
  // Map our language names to Monaco Editor language IDs
  const getMonacoLanguage = (lang: string) => {
    switch (lang) {
      case 'python': return 'python';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'python';
    }
  };
  
  const monacoLanguage = getMonacoLanguage(language);
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

  // Debounced layout handling for Monaco Editor to prevent ResizeObserver errors
  useEffect(() => {
    if (!editorInstance) return;

    let timeoutId: NodeJS.Timeout;
    
    const debouncedLayout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        try {
          if (editorInstance && typeof editorInstance.layout === 'function') {
            editorInstance.layout();
          }
        } catch (error) {
          // Silently handle layout errors
          console.debug('Monaco layout error (non-critical):', error);
        }
      }, 100); // Debounce by 100ms to prevent rapid resize calls
    };

    // Use a more robust ResizeObserver with error handling
    let resizeObserver: ResizeObserver | null = null;
    
    try {
      resizeObserver = new ResizeObserver((entries) => {
        try {
          if (entries.length > 0) {
            debouncedLayout();
          }
        } catch (error) {
          // Silently handle ResizeObserver callback errors
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
    } catch (error) {
      // Fallback to manual layout trigger if ResizeObserver fails
      console.debug('ResizeObserver creation failed, using fallback');
      
      // Simple fallback - trigger layout on window resize
      const handleResize = () => debouncedLayout();
      window.addEventListener('resize', handleResize);
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', handleResize);
      };
    }

    return () => {
      clearTimeout(timeoutId);
      if (resizeObserver) {
        try {
          resizeObserver.disconnect();
        } catch (error) {
          // Silently handle disconnect errors
        }
      }
    };
  }, [editorInstance]);

  // Force layout when component dimensions change
  useEffect(() => {
    if (editorInstance) {
      const timeoutId = setTimeout(() => {
        editorInstance.layout();
        
        // Force the editor to take full width
        const editorElement = editorInstance.getDomNode();
        if (editorElement) {
          editorElement.style.width = '100%';
          editorElement.style.minWidth = '100%';
          editorElement.style.maxWidth = '100%';
          editorElement.style.flex = '1';
          editorElement.style.display = 'flex';
          editorElement.style.flexDirection = 'column';
          
          // Also set the parent container
          const parentElement = editorElement.parentElement;
          if (parentElement) {
            parentElement.style.width = '100%';
            parentElement.style.minWidth = '100%';
            parentElement.style.maxWidth = '100%';
            parentElement.style.flex = '1';
          }
          
          // Set the root container as well
          const rootElement = editorElement.closest('.w-full.h-full') as HTMLElement;
          if (rootElement) {
            rootElement.style.width = '100%';
            rootElement.style.minWidth = '100%';
            rootElement.style.maxWidth = '100%';
          }
        }
        
        // Force layout again after style changes
        setTimeout(() => {
          editorInstance.layout();
        }, 50);
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
    <div 
      className={`w-full h-full transition-colors duration-200 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
      }`}
      style={{ width: '100%', minWidth: '100%', maxWidth: '100%' }}
    >
      {/* Editor Header - Conditional rendering */}
      {showHeader && (
        <div className={`px-4 py-2 border-b flex items-center justify-end transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200'
        }`}>
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
        style={{ height, width: '100%', minWidth: '100%', maxWidth: '100%' }} 
        className={`w-full h-full transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
        }`}
        onClick={() => {
          if (editorInstance) {
            editorInstance.focus();
          }
        }}
      >
        <Editor
          height="100%"
          width="100%"
          defaultLanguage={monacoLanguage}
          language={monacoLanguage}
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
            
            // Focus the editor after mounting and force layout
            setTimeout(() => {
              editor.focus();
              editor.layout();
              
              // Force the editor to take full width
              const editorElement = editor.getDomNode();
              if (editorElement) {
                editorElement.style.width = '100%';
                editorElement.style.minWidth = '100%';
                editorElement.style.maxWidth = '100%';
                editorElement.style.flex = '1';
                editorElement.style.display = 'flex';
                editorElement.style.flexDirection = 'column';
                
                // Also set the parent container
                const parentElement = editorElement.parentElement;
                if (parentElement) {
                  parentElement.style.width = '100%';
                  parentElement.style.minWidth = '100%';
                  parentElement.style.maxWidth = '100%';
                  parentElement.style.flex = '1';
                }
                
                // Set the root container as well
                const rootElement = editorElement.closest('.w-full.h-full') as HTMLElement;
                if (rootElement) {
                  rootElement.style.width = '100%';
                  rootElement.style.minWidth = '100%';
                  rootElement.style.maxWidth = '100%';
                }
              }
              
              // Force layout again after style changes
              setTimeout(() => {
                editor.layout();
              }, 50);
            }, 100);
            
            // Prevent editor from losing focus during typing
            editor.onDidFocusEditorText(() => {
              console.log('Editor focused');
            });
            
            editor.onDidBlurEditorText(() => {
              console.log('Editor blurred');
            });
          }}
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
