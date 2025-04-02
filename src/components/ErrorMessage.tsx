import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  variant?: 'error' | 'warning' | 'info';
}

const variantClasses = {
  error: 'bg-red-50 border-red-400 text-red-700',
  warning: 'bg-yellow-50 border-yellow-400 text-yellow-700',
  info: 'bg-blue-50 border-blue-400 text-blue-700',
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  variant = 'error',
}) => {
  return (
    <div
      className={`p-4 rounded-lg border ${variantClasses[variant]}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {variant === 'error' && (
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {variant === 'warning' && (
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {variant === 'info' && (
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-medium underline hover:text-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
