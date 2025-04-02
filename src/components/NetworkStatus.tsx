import React, { useEffect } from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { showErrorToast, showInfoToast } from './Toast';

interface NetworkStatusProps {
  offlineMessage?: string;
  onlineMessage?: string;
}

export function NetworkStatus({ 
  offlineMessage = 'You are currently offline. Some features may be unavailable until you reconnect.',
  onlineMessage = 'You are back online!'
}: NetworkStatusProps = {}) {
  const isOnline = useNetworkStatus();

  useEffect(() => {
    if (!isOnline) {
      showErrorToast(offlineMessage, { autoClose: false });
    } else {
      showInfoToast(onlineMessage, { autoClose: 3000 });
    }
  }, [isOnline, offlineMessage, onlineMessage]);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white p-4 text-center font-medium z-50">
      {offlineMessage}
    </div>
  );
} 