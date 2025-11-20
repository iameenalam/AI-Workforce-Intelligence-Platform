import toast from 'react-hot-toast';

// Keep track of recent toasts to prevent duplicates
const recentToasts = new Set();
const TOAST_COOLDOWN = 3000; // 3 seconds

// Helper function to prevent duplicate toasts
const preventDuplicate = (message, type) => {
  const key = `${type}:${message}`;
  
  if (recentToasts.has(key)) {
    return false; // Don't show duplicate
  }
  
  recentToasts.add(key);
  
  // Remove from set after cooldown period
  setTimeout(() => {
    recentToasts.delete(key);
  }, TOAST_COOLDOWN);
  
  return true; // Show toast
};

// Enhanced toast functions that prevent duplicates
export const showSuccessToast = (message) => {
  if (preventDuplicate(message, 'success')) {
    return toast.success(message);
  }
};

export const showErrorToast = (message) => {
  if (preventDuplicate(message, 'error')) {
    return toast.error(message);
  }
};

export const showInfoToast = (message) => {
  if (preventDuplicate(message, 'info')) {
    return toast(message);
  }
};

export const showLoadingToast = (message) => {
  return toast.loading(message);
};

// Clear all toasts
export const clearAllToasts = () => {
  toast.dismiss();
  recentToasts.clear();
};
