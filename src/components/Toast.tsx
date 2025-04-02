import React from 'react';
import { createPortal } from 'react-dom';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastProps {
  position?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left';
  autoClose?: number;
  hideProgressBar?: boolean;
  newestOnTop?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  pauseOnFocusLoss?: boolean;
}

export function Toast({
  position = 'top-right',
  autoClose = 5000,
  hideProgressBar = false,
  newestOnTop = false,
  closeOnClick = true,
  pauseOnHover = true,
  draggable = true,
  pauseOnFocusLoss = true,
}: ToastProps) {
  return createPortal(
    <ToastContainer
      position={position}
      autoClose={autoClose}
      hideProgressBar={hideProgressBar}
      newestOnTop={newestOnTop}
      closeOnClick={closeOnClick}
      pauseOnHover={pauseOnHover}
      draggable={draggable}
      pauseOnFocusLoss={pauseOnFocusLoss}
      theme="light"
    />,
    document.body
  );
}

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  type: ToastType;
  message: string;
  options?: ToastOptions;
}

const toastIcons = {
  success: (
    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
};

const toastStyles = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
};

export function showToast({ type, message, options = {} }: ToastMessage) {
  const defaultOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  };

  const toastContent = (
    <div className={`flex items-center p-4 rounded-lg border ${toastStyles[type]}`}>
      <div className="flex-shrink-0">{toastIcons[type]}</div>
      <div className="ml-3">
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );

  toast(toastContent, { ...defaultOptions, ...options });
}

export const showSuccessToast = (message: string, options?: ToastOptions) =>
  showToast({ type: 'success', message, options });

export const showErrorToast = (message: string, options?: ToastOptions) =>
  showToast({ type: 'error', message, options });

export const showInfoToast = (message: string, options?: ToastOptions) =>
  showToast({ type: 'info', message, options });

export const showWarningToast = (message: string, options?: ToastOptions) =>
  showToast({ type: 'warning', message, options });
