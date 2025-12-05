import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({
  trigger,
  children,
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div 
          className={`
            absolute mt-2 w-48 bg-white dark:bg-zinc-900 shadow-lg rounded-lg
            border border-zinc-200 dark:border-zinc-800 py-1 z-50 animate-fade-in
            ${align === 'left' ? 'left-0 right-auto' : 'right-0 left-auto'}
          `}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ 
  onClick, 
  children, 
  icon: Icon, 
  danger = false,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        block w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors
        ${danger 
          ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' 
          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export { Dropdown, DropdownItem };
export default Dropdown;
