import React from 'react';

const statusStyles = {
  SCHEDULED: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  CONFIRMED: 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  COMPLETED: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  CANCELLED: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  NO_SHOW: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  PENDING: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  PARTIAL: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  PAID: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  OVERDUE: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  ACTIVE: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  INACTIVE: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
};

const StatusBadge = ({ status, className = '' }) => {
  const style = statusStyles[status] || 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400';
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${style} ${className}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
};

export default StatusBadge;
