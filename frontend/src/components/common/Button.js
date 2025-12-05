import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  fullWidth = false,
}) => {
  const variants = {
    primary: 'bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-500 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100',
    secondary: 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 focus:ring-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700',
    outline: 'bg-transparent border border-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400 focus:ring-zinc-400 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:border-zinc-500',
    ghost: 'bg-transparent text-zinc-600 hover:bg-zinc-100 focus:ring-zinc-300 dark:text-zinc-400 dark:hover:bg-zinc-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-1.5 font-medium rounded-lg
        transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}
      `}
    >
      {loading ? (
        <>
          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
};

export default Button;
