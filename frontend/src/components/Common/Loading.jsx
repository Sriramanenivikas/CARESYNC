import React from 'react';
import { FaHeartbeat } from 'react-icons/fa';

/**
 * Loading Component
 * @param {string} size - 'sm', 'md', 'lg', 'xl' - Size of the loader
 * @param {string} text - Optional loading text
 * @param {boolean} fullScreen - Whether to show full screen overlay
 * @param {string} variant - 'spinner', 'pulse', 'dots', 'heartbeat' - Loading animation style
 */
const Loading = ({
  size = 'md',
  text = '',
  fullScreen = false,
  variant = 'spinner',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  // Spinner variant
  const SpinnerLoader = () => (
    <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin`}></div>
  );

  // Pulse variant
  const PulseLoader = () => (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full animate-pulse`}></div>
  );

  // Dots variant
  const DotsLoader = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-3 h-3 bg-teal-500 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        ></div>
      ))}
    </div>
  );

  // Heartbeat variant (medical themed)
  const HeartbeatLoader = () => (
    <div className={`${sizeClasses[size]} relative`}>
      <FaHeartbeat className="w-full h-full text-teal-500 animate-pulse" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1/2 h-1/2 border-2 border-teal-500 rounded-full animate-ping"></div>
      </div>
    </div>
  );

  // Select loader based on variant
  const renderLoader = () => {
    switch (variant) {
      case 'pulse':
        return <PulseLoader />;
      case 'dots':
        return <DotsLoader />;
      case 'heartbeat':
        return <HeartbeatLoader />;
      case 'spinner':
      default:
        return <SpinnerLoader />;
    }
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {renderLoader()}
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-300 font-medium animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

/**
 * Skeleton Loading Component for content placeholders
 */
export const Skeleton = ({
  className = '',
  variant = 'text',
  width,
  height,
  count = 1
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700 animate-pulse rounded';

  const variantClasses = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'w-12 h-12 rounded-full',
    thumbnail: 'w-20 h-20 rounded-lg',
    button: 'h-10 w-24 rounded-lg',
    card: 'h-48 w-full rounded-xl'
  };

  const style = {
    ...(width && { width }),
    ...(height && { height })
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${baseClasses} ${variantClasses[variant]} ${className}`}
          style={style}
        />
      ))}
    </>
  );
};

/**
 * Page Loading Component - Full page loader with CareSync branding
 */
export const PageLoading = ({ message = 'Loading...' }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
    <div className="text-center">
      {/* Logo */}
      <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-500/30 animate-pulse">
        <FaHeartbeat className="text-white text-5xl" />
      </div>

      {/* Brand Name */}
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">CareSync</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Hospital Management System</p>

      {/* Loading Indicator */}
      <div className="flex justify-center mb-4">
        <Loading size="lg" variant="spinner" />
      </div>

      {/* Loading Message */}
      <p className="text-gray-600 dark:text-gray-300 animate-pulse">{message}</p>
    </div>
  </div>
);

/**
 * Button Loading State - Shows loading state inside buttons
 */
export const ButtonLoading = ({ text = 'Loading...' }) => (
  <span className="flex items-center gap-2">
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span>{text}</span>
  </span>
);

/**
 * Table Loading - Shows skeleton rows for table loading states
 */
export const TableLoading = ({ rows = 5, columns = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4 py-3 border-b border-gray-100 dark:border-gray-800">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export default Loading;
