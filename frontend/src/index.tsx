import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Global ResizeObserver error suppression
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('ResizeObserver loop completed with undelivered notifications')) {
    return; // Suppress ResizeObserver errors
  }
  originalConsoleError.apply(console, args);
};

// Suppress ResizeObserver errors globally
window.addEventListener('error', (e) => {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
    e.stopImmediatePropagation();
    e.preventDefault();
    return false;
  }
});

window.addEventListener('unhandledrejection', (e) => {
  if (e.reason && e.reason.message && e.reason.message.includes('ResizeObserver')) {
    e.preventDefault();
    return false;
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
