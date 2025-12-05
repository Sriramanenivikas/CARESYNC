import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';
import { useNotification } from '../../context/NotificationContext';

const Toast = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-5 h-5" />;
      case 'error':
        return <FiAlertCircle className="w-5 h-5" />;
      case 'warning':
        return <FiAlertTriangle className="w-5 h-5" />;
      default:
        return <FiInfo className="w-5 h-5" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIconStyles = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            flex items-start gap-3 p-4 rounded-lg border shadow-lg
            animate-slide-down ${getStyles(notification.type)}
          `}
        >
          <span className={getIconStyles(notification.type)}>
            {getIcon(notification.type)}
          </span>
          <div className="flex-1">
            {notification.title && (
              <p className="font-semibold mb-1">{notification.title}</p>
            )}
            <p className="text-sm">{notification.message}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="p-1 hover:bg-black/5 rounded transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
