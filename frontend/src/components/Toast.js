import React, { createContext, useContext, useState, useCallback } from 'react';
import { FiX, FiCheckCircle, FiAlertTriangle, FiXCircle, FiInfo } from 'react-icons/fi';

// Toast Context
const ToastContext = createContext(null);

// Toast types configuration
const toastConfig = {
  success: {
    icon: FiCheckCircle,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconColor: 'text-emerald-500',
    textColor: 'text-emerald-800',
  },
  error: {
    icon: FiXCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-500',
    textColor: 'text-red-800',
  },
  warning: {
    icon: FiAlertTriangle,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-500',
    textColor: 'text-amber-800',
  },
  info: {
    icon: FiInfo,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500',
    textColor: 'text-blue-800',
  },
};

// Individual Toast Component
const Toast = ({ id, type = 'info', title, message, onClose, duration = 5000 }) => {
  const config = toastConfig[type] || toastConfig.info;
  const Icon = config.icon;

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${config.bgColor} ${config.borderColor} 
        animate-slide-up max-w-sm`}
      role="alert"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1 min-w-0">
        {title && (
          <p className={`font-semibold text-sm ${config.textColor}`}>{title}</p>
        )}
        {message && (
          <p className={`text-sm mt-0.5 ${config.textColor} opacity-90`}>{message}</p>
        )}
      </div>
      <button
        onClick={() => onClose(id)}
        className={`flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors ${config.textColor}`}
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  );
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((options) => {
    const id = Date.now() + Math.random();
    const toast = { id, ...options };
    setToasts((prev) => [...prev, toast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback((message, title = 'Success') => {
    return addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((message, title = 'Error') => {
    return addToast({ type: 'error', title, message, duration: 8000 });
  }, [addToast]);

  const warning = useCallback((message, title = 'Warning') => {
    return addToast({ type: 'warning', title, message });
  }, [addToast]);

  const info = useCallback((message, title = 'Info') => {
    return addToast({ type: 'info', title, message });
  }, [addToast]);

  const value = {
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default Toast;
