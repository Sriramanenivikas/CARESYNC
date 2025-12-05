import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = true,
  onClick,
}) => {
  return (
    <div 
      className={`
        bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg
        ${hover ? 'hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer transition-all duration-200 hover:shadow-md' : ''}
        ${padding ? 'p-5' : ''} 
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
