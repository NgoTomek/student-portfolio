import { showErrorToast, showWarningToast } from '../components/Toast';

/**
 * Handle Firebase and application errors in a user-friendly way
 */
export const handleError = (error, friendlyMessage = 'An error occurred') => {
  console.error(error);
  
  // Extract message from various error formats
  const errorMessage = error?.message || 
                      (typeof error === 'string' ? error : 'Unknown error');
  
  // Handle specific error cases
  if (errorMessage.includes('offline') || errorMessage.includes('network')) {
    showWarningToast('You appear to be offline. Please check your internet connection and try again.');
    return;
  }
  
  if (errorMessage.includes('permission-denied') || errorMessage.includes('unauthorized')) {
    showErrorToast('You don\'t have permission to perform this action.');
    return;
  }
  
  if (errorMessage.includes('not-found')) {
    showErrorToast('The requested data could not be found.');
    return;
  }
  
  if (errorMessage.includes('already-exists')) {
    showErrorToast('This data already exists.');
    return;
  }
  
  if (errorMessage.includes('invalid-argument') || errorMessage.includes('validation')) {
    showErrorToast('Invalid data provided. Please check your inputs and try again.');
    return;
  }
  
  // Default case
  showErrorToast(`${friendlyMessage}: ${errorMessage}`);
};

/**
 * Wrap an async function with error handling
 */
export const withErrorHandling = (asyncFn, friendlyMessage) => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      handleError(error, friendlyMessage);
      throw error; // Rethrow for caller to handle if needed
    }
  };
}; 