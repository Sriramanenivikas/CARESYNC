import React from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  hint,
  required = false,
  disabled = false,
  className = '',
  icon: Icon,
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
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            input-field
            ${Icon ? 'pl-10' : ''}
            ${error ? 'input-error' : ''}
          `}
          {...props}
        />
      </div>
      {error && <p className="error-text">{error}</p>}
      {hint && !error && <p className="text-sm text-gray-400 mt-1">{hint}</p>}
    </div>
  );
};

export default Input;
