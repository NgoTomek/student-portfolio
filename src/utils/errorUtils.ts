/**
 * Error Handling Utilities
 * 
 * This file contains utility functions for consistent error handling
 * across the application.
 */
import { showErrorToast } from '../components/Toast';
import { isObject } from './typeUtils';

/**
 * Enhanced Error class with additional properties
 */
export class AppError extends Error {
  code?: string;
  status?: number;
  originalError?: unknown;

  constructor(message: string, options?: { 
    code?: string;
    status?: number;
    originalError?: unknown;
  }) {
    super(message);
    this.name = 'AppError';
    this.code = options?.code;
    this.status = options?.status;
    this.originalError = options?.originalError;
    
    // Maintains proper stack trace for where error was thrown (only in V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Extracts a user-friendly error message from various error types
 * 
 * @param error The error to extract a message from
 * @returns A user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (isObject(error) && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
}

/**
 * Formats a Firebase error code into a user-friendly message
 * 
 * @param errorCode Firebase error code
 * @returns User-friendly error message
 */
export function formatFirebaseError(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please use a different email or try logging in.';
    case 'auth/weak-password':
      return 'Your password is too weak. Please use a stronger password.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please try again.';
    case 'auth/invalid-email':
      return 'The email address is not valid. Please enter a valid email.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful login attempts. Please try again later.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/requires-recent-login':
      return 'This operation requires a recent login. Please log out and log back in.';
    case 'permission-denied':
      return 'You do not have permission to perform this action.';
    default:
      return `Error: ${errorCode.replace('auth/', '')}`;
  }
}

/**
 * Handles errors in a consistent way across the application
 * 
 * @param error The error to handle
 * @param logLabel Optional label to identify error in logs
 */
export function handleError(error: unknown, logLabel?: string): void {
  const errorMessage = getErrorMessage(error);
  
  // Log error to console with optional label
  console.error(`${logLabel ? `[${logLabel}] ` : ''}Error:`, error);
  
  // Show error toast to user
  showErrorToast(errorMessage);
}

/**
 * Creates an async function that handles its own errors
 * 
 * @param fn The async function to wrap
 * @param options Error handling options
 * @returns A wrapped function that handles its own errors
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    errorMessage?: string;
    logLabel?: string;
    rethrow?: boolean;
  } = {}
): (...args: Parameters<T>) => Promise<ReturnType<T> | null> {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      const errorMsg = options.errorMessage || getErrorMessage(error);
      
      // Log and display error
      handleError(error, options.logLabel);
      
      // Optionally rethrow
      if (options.rethrow) {
        throw error;
      }
      
      return null;
    }
  };
} 