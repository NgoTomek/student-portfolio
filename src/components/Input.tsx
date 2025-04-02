import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: InputProps) {
  const baseClasses =
    'block rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  const widthClass = fullWidth ? 'w-full' : '';
  const errorClasses = error
    ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : '';

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{leftIcon}</span>
          </div>
        )}
        <input
          className={`${baseClasses} ${widthClass} ${errorClasses} ${disabledClasses} ${
            leftIcon ? 'pl-10' : 'pl-3'
          } ${rightIcon ? 'pr-10' : 'pr-3'} py-2 ${className}`}
          disabled={disabled}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{rightIcon}</span>
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export function TextArea({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: TextAreaProps) {
  const baseClasses =
    'block rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  const widthClass = fullWidth ? 'w-full' : '';
  const errorClasses = error
    ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : '';

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <textarea
        className={`${baseClasses} ${widthClass} ${errorClasses} ${disabledClasses} px-3 py-2 ${className}`}
        disabled={disabled}
        {...props}
      />
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
