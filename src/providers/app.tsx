import React from 'react';
import { ThemeProvider } from './theme-provider';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { store } from '@/store';

type FallbackProps = {
  error: Error;
  resetErrorBoundary: (...args: Array<unknown>) => void;
};
const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div role='alert'>
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

const LoadingScreen = () => {
  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900'></div>
    </div>
  );
};
type AppProviderProps = {
  children: React.ReactNode;
};
export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <React.Suspense fallback={<LoadingScreen />}>
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
          <Provider store={store}>{children}</Provider>
        </ThemeProvider>
      </React.Suspense>
    </ErrorBoundary>
  );
};
