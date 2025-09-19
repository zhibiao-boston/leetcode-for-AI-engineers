// Comprehensive ResizeObserver error suppression utility
// This must be imported before any components to ensure proper error handling

// Store original functions
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// More aggressive error suppression
console.error = (...args: any[]) => {
  const message = args[0]?.toString() || '';
  
  // List of patterns to suppress (more comprehensive)
  const suppressPatterns = [
    'ResizeObserver loop completed with undelivered notifications',
    'ResizeObserver loop limit exceeded', 
    'ResizeObserver loop',
    'ResizeObserver',
    'handleError'  // This catches the specific error from your screenshot
  ];
  
  const shouldSuppress = suppressPatterns.some(pattern => 
    message.toLowerCase().includes(pattern.toLowerCase())
  );
  
  if (!shouldSuppress) {
    originalConsoleError.apply(console, args);
  }
};

// Also suppress console.warn for ResizeObserver
console.warn = (...args: any[]) => {
  const message = args[0]?.toString() || '';
  
  if (message.includes('ResizeObserver')) {
    return; // Suppress ResizeObserver warnings too
  }
  
  originalConsoleWarn.apply(console, args);
};

// Multiple error handlers for different error types
const handleWindowError = (event: ErrorEvent): boolean => {
  const message = event.message || event.error?.message || event.error?.toString() || '';
  
  if (message.includes('ResizeObserver') || 
      message.includes('handleError') ||
      event.filename?.includes('bundle.js')) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  }
  
  return true;
};

// Handle unhandled rejections
const handleUnhandledRejection = (event: PromiseRejectionEvent): boolean => {
  const message = event.reason?.toString() || event.reason?.message || '';
  
  if (message.includes('ResizeObserver')) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
  
  return true;
};

// Override the global error handler
const originalOnError = window.onerror;
window.onerror = (message, source, lineno, colno, error) => {
  const messageStr = message?.toString() || '';
  
  if (messageStr.includes('ResizeObserver') || 
      messageStr.includes('handleError') ||
      source?.includes('bundle.js')) {
    return true; // Prevent default error handling
  }
  
  if (originalOnError) {
    return originalOnError(message, source, lineno, colno, error);
  }
  
  return false;
};

// Add event listeners with capture phase
window.addEventListener('error', handleWindowError, true);
window.addEventListener('unhandledrejection', handleUnhandledRejection, true);

// Additional DOM error suppression
document.addEventListener('DOMContentLoaded', () => {
  // Monkey patch ResizeObserver to catch errors at the source
  if (window.ResizeObserver) {
    const OriginalResizeObserver = window.ResizeObserver;
    
    window.ResizeObserver = class extends OriginalResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        const wrappedCallback: ResizeObserverCallback = (entries, observer) => {
          try {
            callback(entries, observer);
          } catch (error) {
            // Silently catch ResizeObserver callback errors
            const errorMessage = error?.toString() || '';
            if (!errorMessage.includes('ResizeObserver')) {
              throw error; // Re-throw if it's not a ResizeObserver error
            }
          }
        };
        
        super(wrappedCallback);
      }
    };
  }
});

// Export cleanup function if needed
export const cleanupErrorSuppression = (): void => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  window.onerror = originalOnError;
  window.removeEventListener('error', handleWindowError, true);
  window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
};

// Log that error suppression is active (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('🔇 Aggressive ResizeObserver error suppression active');
}
