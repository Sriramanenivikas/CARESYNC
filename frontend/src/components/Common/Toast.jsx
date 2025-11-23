import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

// Toast Context
const ToastContext = createContext(null);

// Toast types configuration
const toastConfig = {
  success: {
    icon: FaCheckCircle,
    bgColor: 'bg-green-50 dark:bg-green-900/30',
    borderColor: 'border-green-500',
    iconColor: 'text-green-500',
    textColor: 'text-green-800 dark:text-green-200'
  },
  error: {
    icon: FaExclamationCircle,
    bgColor: 'bg-red-50 dark:bg-red-900/30',
    borderColor: 'border-red-500',
    iconColor: 'text-red-500',
    textColor: 'text-red-800 dark:text-red-200'
  },
  warning: {
    icon: FaExclamationTriangle,
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
    borderColor: 'border-yellow-500',
    iconColor: 'text-yellow-500',
    textColor: 'text-yellow-800 dark:text-yellow-200'
  },
  info: {
    icon: FaInfoCircle,
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
    borderColor: 'border-blue-500',
    iconColor: 'text-blue-500',
    textColor: 'text-blue-800 dark:text-blue-200'
  }
};

// Individual Toast Component
const ToastItem = ({ id, message, type, title, duration, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);
  const config = toastConfig[type] || toastConfig.info;
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(id);
    }, 300);
  };

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-xl shadow-lg border-l-4
        ${config.bgColor} ${config.borderColor}
        transform transition-all duration-300 ease-out
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        animate-slide-in-right
      `}
      role="alert"
    >
      <Icon className={`${config.iconColor} text-xl flex-shrink-0 mt-0.5`} />

      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`font-semibold ${config.textColor} mb-1`}>{title}</h4>
        )}
        <p className={`text-sm ${config.textColor}`}>{message}</p>
      </div>

      <button
        onClick={handleClose}
        className={`${config.textColor} hover:opacity-70 transition-opacity p-1 flex-shrink-0`}
        aria-label="Close notification"
      >
        <FaTimes className="text-sm" />
      </button>
    </div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast, position = 'top-right' }) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none`}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem {...toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
};

// Toast Provider Component
export const ToastProvider = ({ children, position = 'top-right', maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((options) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message: typeof options === 'string' ? options : options.message,
      type: options.type || 'info',
      title: options.title || null,
      duration: options.duration !== undefined ? options.duration : 5000
    };

    setToasts((prev) => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const toast = useCallback((message, options = {}) => {
    return addToast({ message, ...options });
  }, [addToast]);

  toast.success = useCallback((message, options = {}) => {
    return addToast({ message, type: 'success', ...options });
  }, [addToast]);

  toast.error = useCallback((message, options = {}) => {
    return addToast({ message, type: 'error', ...options });
  }, [addToast]);

  toast.warning = useCallback((message, options = {}) => {
    return addToast({ message, type: 'warning', ...options });
  }, [addToast]);

  toast.info = useCallback((message, options = {}) => {
    return addToast({ message, type: 'info', ...options });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} position={position} />
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
