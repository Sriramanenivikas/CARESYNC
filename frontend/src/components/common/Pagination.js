import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  showInfo = true,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);
    
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
      {showInfo && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing <span className="font-medium text-slate-700 dark:text-slate-300">{startItem}</span> to{' '}
          <span className="font-medium text-slate-700 dark:text-slate-300">{endItem}</span> of{' '}
          <span className="font-medium text-slate-700 dark:text-slate-300">{totalItems}</span> results
        </p>
      )}

      <nav className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              min-w-[40px] h-10 px-3 rounded-lg font-medium text-sm transition-colors
              ${currentPage === page 
                ? 'bg-primary-500 text-white' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }
            `}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
