import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './providers/theme-provider.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

postMessage({ payload: 'removeLoading' }, '*');