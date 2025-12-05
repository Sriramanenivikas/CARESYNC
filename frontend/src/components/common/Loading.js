import React from 'react';

const Loading = ({ size = 'md', text = '', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-2',
    xl: 'w-10 h-10 border-2',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={`${sizeClasses[size]} border-slate-200 border-t-slate-600 dark:border-slate-700 dark:border-t-slate-400 rounded-full animate-spin`}
      />
      {text && (
        <p className="text-slate-500 text-sm">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 dark:bg-slate-900/90 z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loading;
