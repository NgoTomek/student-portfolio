import React from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { showErrorToast, showInfoToast } from './Toast';

export function NetworkStatus() {
  const isOnline = useNetworkStatus();

  React.useEffect(() => {
    if (!isOnline) {
      showErrorToast(
        'You are currently offline. Some features may be unavailable until you reconnect.',
        { autoClose: false }
      );
    } else {
      showInfoToast('You are back online!', { autoClose: 3000 });
    }
  }, [isOnline]);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white p-4 text-center font-medium z-50">
      You are currently offline. Some features may be unavailable until you reconnect.
    </div>
  );
}
