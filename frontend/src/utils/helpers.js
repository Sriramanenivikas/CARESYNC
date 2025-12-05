/**
 * Utility helper functions
 */

/**
 * Format date to readable string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  
  return date.toLocaleDateString('en-US', defaultOptions);
};

/**
 * Format date and time
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format time only
 */
export const formatTime = (dateString) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format currency in Indian Rupees (₹)
 * Uses Indian number system: ₹15,00,000 for 1500000
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  
  const num = Number(amount);
  
  // Format using Indian locale for proper lakh/crore formatting
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Format number with Indian comma separators
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '-';
  return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return '-';
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  
  if (isNaN(birthDate.getTime())) return '-';
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Format enum to readable text
 */
export const formatEnum = (enumValue) => {
  if (!enumValue) return '';
  return enumValue
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Get initials from name
 */
export const getInitials = (firstName, lastName) => {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return first + last || '??';
};

/**
 * Get full name
 */
export const getFullName = (firstName, lastName) => {
  return [firstName, lastName].filter(Boolean).join(' ') || '-';
};

/**
 * Generate random color based on string
 */
export const stringToColor = (str) => {
  if (!str) return '#64748b';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#0891b2', '#059669', '#2563eb', '#7c3aed', '#db2777',
    '#ea580c', '#ca8a04', '#16a34a', '#0284c7', '#9333ea',
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Get status color class
 */
export const getStatusColor = (status) => {
  const statusColors = {
    // Appointments
    SCHEDULED: 'badge-info',
    CONFIRMED: 'badge-primary',
    COMPLETED: 'badge-success',
    CANCELLED: 'badge-error',
    NO_SHOW: 'badge-warning',
    
    // Bills
    PENDING: 'badge-warning',
    PAID: 'badge-success',
    OVERDUE: 'badge-error',
    
    // General
    ACTIVE: 'badge-success',
    INACTIVE: 'badge-error',
    
    // Default
    DEFAULT: 'badge-info',
  };
  
  return statusColors[status] || statusColors.DEFAULT;
};

/**
 * Get status background color (for custom styling)
 */
export const getStatusBgColor = (status) => {
  const colors = {
    SCHEDULED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    CONFIRMED: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    NO_SHOW: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    PAID: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    OVERDUE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    INACTIVE: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  };
  
  return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
};

/**
 * Debounce function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  if (typeof obj === 'string') return obj.trim().length === 0;
  return false;
};

/**
 * Group array by key
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {});
};

/**
 * Sort array by key
 */
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key];
    const bVal = typeof key === 'function' ? key(b) : b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Filter array by search term
 */
export const filterBySearch = (array, searchTerm, keys) => {
  if (!searchTerm) return array;
  
  const term = searchTerm.toLowerCase();
  return array.filter(item => 
    keys.some(key => {
      const value = key.split('.').reduce((obj, k) => obj?.[k], item);
      return value?.toString().toLowerCase().includes(term);
    })
  );
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(dateString);
};

/**
 * Download data as file
 */
export const downloadFile = (data, filename, type = 'application/json') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Export to CSV
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || !data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]?.toString() || '';
        return value.includes(',') ? `"${value}"` : value;
      }).join(',')
    )
  ].join('\n');
  
  downloadFile(csvContent, filename, 'text/csv');
};

/**
 * Parse query string to object
 */
export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};

/**
 * Build query string from object
 */
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
};

/**
 * Local storage helpers with error handling
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  },
};

/**
 * Generate unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Sleep/delay function
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default {
  formatDate,
  formatDateTime,
  formatTime,
  formatCurrency,
  formatNumber,
  calculateAge,
  truncateText,
  capitalize,
  formatEnum,
  getInitials,
  getFullName,
  stringToColor,
  getStatusColor,
  getStatusBgColor,
  debounce,
  throttle,
  deepClone,
  isEmpty,
  groupBy,
  sortBy,
  filterBySearch,
  getRelativeTime,
  downloadFile,
  exportToCSV,
  parseQueryString,
  buildQueryString,
  storage,
  generateId,
  sleep,
};
