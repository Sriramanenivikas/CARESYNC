import React from 'react';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({
  icon: Icon = FiInbox,
  title = 'No data found',
  description = 'There are no items to display.',
  action,
  actionText,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-1">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-4">{description}</p>
      {action && actionText && (
        <button onClick={action} className="btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
