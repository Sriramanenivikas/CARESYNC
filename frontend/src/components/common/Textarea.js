import React from 'react';

const Textarea = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  maxLength,
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={`
          input-field resize-none
          ${error ? 'input-error' : ''}
        `}
        {...props}
      />
      {maxLength && (
        <p className="text-xs text-slate-400 mt-1 text-right">
          {value?.length || 0} / {maxLength}
        </p>
      )}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default Textarea;
