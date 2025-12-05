import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchInput = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className = '',
  autoFocus = false,
}) => {
  return (
    <div className={`relative ${className}`}>
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="input-field pl-10 pr-10"
      />
      {value && (
        <button
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
