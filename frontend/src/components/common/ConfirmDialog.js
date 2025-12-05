import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import Modal from './Modal';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // danger, warning, info
  loading = false,
}) => {
  const buttonStyles = {
    danger: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
    info: 'bg-primary-500 hover:bg-primary-600 focus:ring-primary-500',
  };

  const iconStyles = {
    danger: 'text-red-500 bg-red-100 dark:bg-red-900/30',
    warning: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
    info: 'text-primary-500 bg-primary-100 dark:bg-primary-900/30',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm" showCloseButton={false}>
      <div className="text-center py-4">
        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${iconStyles[type]}`}>
          <FiAlertTriangle className="w-8 h-8" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{message}</p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 bg-transparent text-slate-600 dark:text-slate-300 font-medium rounded-lg 
                     hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600
                     transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-6 py-2.5 text-white font-medium rounded-lg transition-all duration-200 
              focus:outline-none focus:ring-2 focus:ring-offset-2 min-w-[100px]
              disabled:opacity-50 disabled:cursor-not-allowed
              ${buttonStyles[type]}`}
          >
            {loading ? 'Loading...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
