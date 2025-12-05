const ACCESS_CODES_STORAGE_KEY = 'caresync_access_codes';
const ACCESS_CODE_EXPIRY_HOURS = 1; // Codes expire after 1 hour

const getAdminCredentials = () => {
  return {
    username: process.env.REACT_APP_ADMIN_USER || 'admin',
    password: process.env.REACT_APP_ADMIN_PASS || 'admin'
  };
};

export const generateAccessCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = [];
  
  for (let i = 0; i < 3; i++) {
    let segment = '';
    for (let j = 0; j < 4; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    segments.push(segment);
  }
  
  return segments.join('-');
};

export const getAccessCodes = () => {
  try {
    const stored = localStorage.getItem(ACCESS_CODES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveAccessCodes = (codes) => {
  localStorage.setItem(ACCESS_CODES_STORAGE_KEY, JSON.stringify(codes));
};

// Check if a code has expired (1 hour expiry)
const isCodeExpired = (code) => {
  if (!code.createdAt) return true;
  const createdTime = new Date(code.createdAt).getTime();
  const now = Date.now();
  const expiryTime = ACCESS_CODE_EXPIRY_HOURS * 60 * 60 * 1000; // 1 hour in ms
  return (now - createdTime) > expiryTime;
};

export const createAccessCode = (createdBy, note = '') => {
  const code = generateAccessCode();
  const accessCode = {
    id: Date.now(),
    code,
    createdBy,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + ACCESS_CODE_EXPIRY_HOURS * 60 * 60 * 1000).toISOString(),
    note,
    usageCount: 0,
    isActive: true,
    lastUsed: null
  };
  
  const codes = getAccessCodes();
  codes.push(accessCode);
  saveAccessCodes(codes);
  
  return accessCode;
};

export const validateAccessCode = (inputCode) => {
  if (!inputCode) return { valid: false, message: 'Access code is required' };
  
  const normalizedCode = inputCode.toUpperCase().trim();
  const codes = getAccessCodes();
  
  const foundCode = codes.find(c => c.code === normalizedCode && c.isActive);
  
  if (!foundCode) {
    return { valid: false, message: 'Invalid access code. Contact administrator.' };
  }

  // Check if code has expired (1 hour expiry)
  if (isCodeExpired(foundCode)) {
    // Deactivate expired code
    foundCode.isActive = false;
    saveAccessCodes(codes);
    return { valid: false, message: 'Access code has expired. Codes are valid for 1 hour only.' };
  }
  
  foundCode.usageCount += 1;
  foundCode.lastUsed = new Date().toISOString();
  saveAccessCodes(codes);
  
  return { valid: true, message: 'Access granted', codeInfo: foundCode };
};

export const deactivateAccessCode = (codeId) => {
  const codes = getAccessCodes();
  const codeIndex = codes.findIndex(c => c.id === codeId);
  
  if (codeIndex !== -1) {
    codes[codeIndex].isActive = false;
    saveAccessCodes(codes);
    return true;
  }
  
  return false;
};

export const deleteAccessCode = (codeId) => {
  const codes = getAccessCodes();
  const filteredCodes = codes.filter(c => c.id !== codeId);
  saveAccessCodes(filteredCodes);
  return true;
};

export const verifyAdminCredentials = (username, password) => {
  const credentials = getAdminCredentials();
  const normalizedUsername = username?.toLowerCase().trim();
  return normalizedUsername === credentials.username.toLowerCase() && password === credentials.password;
};

// No admin bypass - EVERYONE needs access code for write operations
// This ensures hospital data security - only you can generate codes
export const hasAdminBypass = (user) => {
  return false; // No bypass allowed - access codes are mandatory
};

// All write operations require access code - NO EXCEPTIONS
export const requiresAccessCode = (user, operation) => {
  const writeOperations = ['CREATE', 'UPDATE', 'DELETE'];
  // Always require access code for write operations
  // Even admins need access codes to modify hospital data
  if (writeOperations.includes(operation)) {
    return true;
  }
  return false;
};

// Get remaining time for a code (for display purposes)
export const getCodeRemainingTime = (code) => {
  if (!code.createdAt) return 0;
  const createdTime = new Date(code.createdAt).getTime();
  const expiryTime = 1 * 60 * 60 * 1000; // 1 hour
  const remaining = (createdTime + expiryTime) - Date.now();
  return Math.max(0, remaining);
};

// Clean up expired codes
export const cleanupExpiredCodes = () => {
  const codes = getAccessCodes();
  const now = Date.now();
  const validCodes = codes.filter(code => {
    const createdTime = new Date(code.createdAt).getTime();
    const expiryTime = 1 * 60 * 60 * 1000;
    return (now - createdTime) <= expiryTime && code.isActive;
  });
  saveAccessCodes(validCodes);
  return validCodes;
};

export default {
  generateAccessCode,
  createAccessCode,
  validateAccessCode,
  deactivateAccessCode,
  deleteAccessCode,
  verifyAdminCredentials,
  getAccessCodes,
  hasAdminBypass,
  requiresAccessCode,
  getCodeRemainingTime,
  cleanupExpiredCodes
};
