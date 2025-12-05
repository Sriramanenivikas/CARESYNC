import React from 'react';
import { getInitials } from '../../utils/helpers';

const Avatar = ({ 
  firstName, 
  lastName, 
  src, 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
    xl: 'w-14 h-14 text-base',
  };

  const initials = getInitials(firstName, lastName);

  if (src) {
    return (
      <img
        src={src}
        alt={`${firstName} ${lastName}`}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`
        ${sizeClasses[size]} rounded-full flex items-center justify-center
        font-medium text-white bg-gradient-to-br from-blue-500 to-cyan-400 ${className}
      `}
    >
      {initials}
    </div>
  );
};

export default Avatar;
