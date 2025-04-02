import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  small: 'h-4 w-4',
  medium: 'h-8 w-8',
  large: 'h-12 w-12',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'blue',
  fullScreen = false,
}) => {
  const spinnerClasses = `animate-spin rounded-full border-t-2 border-b-2 border-${color}-500 ${sizeClasses[size]}`;
  const containerClasses = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center';

  return (
    <div className={containerClasses} role="status" aria-label="Loading">
      <div className={spinnerClasses} />
    </div>
  );
};
