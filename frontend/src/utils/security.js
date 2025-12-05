import DOMPurify from 'dompurify';

// SQL Injection patterns
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|EXEC|EXECUTE|UNION|SCRIPT)\b)/gi,
  /(['";]--|\/\*|\*\/|@@|@)/gi,
  /(OR|AND)\s+\d+\s*=\s*\d+/gi,
  /(\bOR\b|\bAND\b)\s*['"]?\w*['"]?\s*=\s*['"]?\w*['"]?/gi,
  /CONCAT\s*\(/gi,
  /CHAR\s*\(/gi,
  /BENCHMARK\s*\(/gi,
  /SLEEP\s*\(/gi,
  /WAITFOR\s+DELAY/gi,
];

// XSS patterns
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:/gi,
  /vbscript:/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
  /<link/gi,
  /<meta/gi,
  /expression\s*\(/gi,
  /url\s*\(/gi,
];

// Command injection patterns
const COMMAND_INJECTION_PATTERNS = [
  /[;&|`$]/g,
  /\$\(/g,
  /`[^`]*`/g,
  /\|\|/g,
  /&&/g,
];

// Path traversal patterns
const PATH_TRAVERSAL_PATTERNS = [
  /\.\.\//g,
  /\.\.\\/, 
  /%2e%2e%2f/gi,
  /%252e%252e%252f/gi,
];

// Rate limiting storage
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 100; // Max requests per window

/**
 * Sanitize HTML content to prevent XSS
 */
export const sanitizeHTML = (dirty) => {
  if (typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span', 'p', 'br'],
    ALLOWED_ATTR: ['class'],
  });
};

/**
 * Sanitize input string - removes dangerous characters
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  // Trim and normalize whitespace
  let sanitized = input.trim().replace(/\s+/g, ' ');
  
  // HTML entity encoding for special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
  
  return sanitized;
};

/**
 * Check for SQL injection attempts
 */
export const detectSQLInjection = (input) => {
  if (typeof input !== 'string') return false;
  return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input));
};

/**
 * Check for XSS attempts
 */
export const detectXSS = (input) => {
  if (typeof input !== 'string') return false;
  return XSS_PATTERNS.some(pattern => pattern.test(input));
};

/**
 * Check for command injection attempts
 */
export const detectCommandInjection = (input) => {
  if (typeof input !== 'string') return false;
  return COMMAND_INJECTION_PATTERNS.some(pattern => pattern.test(input));
};

/**
 * Check for path traversal attempts
 */
export const detectPathTraversal = (input) => {
  if (typeof input !== 'string') return false;
  return PATH_TRAVERSAL_PATTERNS.some(pattern => pattern.test(input));
};

/**
 * Comprehensive security validation for form inputs
 */
export const validateSecureInput = (input, fieldName = 'input') => {
  const errors = [];
  
  if (typeof input !== 'string') {
    return { isValid: true, errors: [], sanitized: input };
  }

  if (detectSQLInjection(input)) {
    errors.push(`${fieldName} contains potentially harmful characters`);
  }

  if (detectXSS(input)) {
    errors.push(`${fieldName} contains invalid content`);
  }

  if (detectCommandInjection(input)) {
    errors.push(`${fieldName} contains restricted characters`);
  }

  if (detectPathTraversal(input)) {
    errors.push(`${fieldName} contains invalid path characters`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: sanitizeInput(input),
  };
};

/**
 * Validate email format securely
 */
export const validateEmail = (email) => {
  const securityCheck = validateSecureInput(email, 'Email');
  if (!securityCheck.isValid) {
    return { isValid: false, error: securityCheck.errors[0] };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  if (email.length > 254) {
    return { isValid: false, error: 'Email address is too long' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
  const securityCheck = validateSecureInput(phone, 'Phone');
  if (!securityCheck.isValid) {
    return { isValid: false, error: securityCheck.errors[0] };
  }

  const phoneRegex = /^[\d\s\-+()]{10,20}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: errors.length === 0 ? 'strong' : errors.length <= 2 ? 'medium' : 'weak',
  };
};

/**
 * Validate username
 */
export const validateUsername = (username) => {
  const securityCheck = validateSecureInput(username, 'Username');
  if (!securityCheck.isValid) {
    return { isValid: false, error: securityCheck.errors[0] };
  }

  if (username.length < 3 || username.length > 50) {
    return { isValid: false, error: 'Username must be between 3 and 50 characters' };
  }

  const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, dots, underscores, and hyphens' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate name (first name, last name)
 */
export const validateName = (name, fieldName = 'Name') => {
  const securityCheck = validateSecureInput(name, fieldName);
  if (!securityCheck.isValid) {
    return { isValid: false, error: securityCheck.errors[0] };
  }

  if (name.length < 2 || name.length > 100) {
    return { isValid: false, error: `${fieldName} must be between 2 and 100 characters` };
  }

  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }

  return { isValid: true, error: null };
};

/**
 * Validate date
 */
export const validateDate = (dateString) => {
  if (!dateString) {
    return { isValid: false, error: 'Date is required' };
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Please enter a valid date' };
  }

  return { isValid: true, error: null, date };
};

/**
 * Validate future date
 */
export const validateFutureDate = (dateString) => {
  const result = validateDate(dateString);
  if (!result.isValid) return result;

  if (result.date <= new Date()) {
    return { isValid: false, error: 'Date must be in the future' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate past date
 */
export const validatePastDate = (dateString) => {
  const result = validateDate(dateString);
  if (!result.isValid) return result;

  if (result.date >= new Date()) {
    return { isValid: false, error: 'Date must be in the past' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate numeric input
 */
export const validateNumber = (value, options = {}) => {
  const { min, max, integer = false, fieldName = 'Value' } = options;
  
  const num = Number(value);
  
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }

  if (integer && !Number.isInteger(num)) {
    return { isValid: false, error: `${fieldName} must be a whole number` };
  }

  if (min !== undefined && num < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }

  if (max !== undefined && num > max) {
    return { isValid: false, error: `${fieldName} must be at most ${max}` };
  }

  return { isValid: true, error: null, value: num };
};

/**
 * Rate limiting check
 */
export const checkRateLimit = (identifier) => {
  const now = Date.now();
  const userRequests = rateLimitStore.get(identifier) || [];
  
  // Remove expired requests
  const validRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (validRequests.length >= MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((validRequests[0] + RATE_LIMIT_WINDOW - now) / 1000) };
  }

  validRequests.push(now);
  rateLimitStore.set(identifier, validRequests);
  
  return { allowed: true };
};

/**
 * Generate CSRF token
 */
export const generateCSRFToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate file upload
 */
export const validateFileUpload = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'],
  } = options;

  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File type not allowed' };
  }

  const extension = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return { isValid: false, error: 'File extension not allowed' };
  }

  // Check for double extensions (potential bypass attempt)
  const parts = file.name.split('.');
  if (parts.length > 2) {
    return { isValid: false, error: 'Invalid file name' };
  }

  return { isValid: true, error: null };
};

/**
 * Escape special regex characters
 */
export const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Sanitize object recursively
 */
export const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    return sanitizeInput(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key of Object.keys(obj)) {
      sanitized[sanitizeInput(key)] = sanitizeObject(obj[key]);
    }
    return sanitized;
  }
  
  return obj;
};

export default {
  sanitizeHTML,
  sanitizeInput,
  validateSecureInput,
  validateEmail,
  validatePhone,
  validatePassword,
  validateUsername,
  validateName,
  validateDate,
  validateFutureDate,
  validatePastDate,
  validateNumber,
  validateFileUpload,
  checkRateLimit,
  generateCSRFToken,
  sanitizeObject,
  detectSQLInjection,
  detectXSS,
  detectCommandInjection,
  detectPathTraversal,
};
