const ACCESS_CODES_STORAGE_KEY = 'caresync_access_codes';

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

export const createAccessCode = (createdBy, note = '') => {
  const code = generateAccessCode();
  const accessCode = {
    id: Date.now(),
    code,
    createdBy,
    createdAt: new Date().toISOString(),
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
    return { valid: false, message: 'Invalid or expired access code' };
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

export const hasAdminBypass = (user) => {
  return user?.role === 'ADMIN';
};

export const requiresAccessCode = (user, operation) => {
  const writeOperations = ['CREATE', 'UPDATE', 'DELETE'];
  if (writeOperations.includes(operation)) return true;
  return false;
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
  requiresAccessCode
};
