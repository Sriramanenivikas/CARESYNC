import api from './api';

const ACCESS_CODE_EXPIRY_HOURS = 1;

/**
 * Access Code Service - Uses Backend API
 * Codes are stored in the database, not localStorage
 */

// Verify admin credentials with backend
export const verifyAdminCredentials = async (username, password) => {
  try {
    const response = await api.post('/access-codes/verify-admin', { username, password });
    return response.data.success;
  } catch (error) {
    console.error('Admin verification failed:', error);
    return false;
  }
};

// Generate a new access code (admin only)
export const createAccessCode = async (createdBy, note = '') => {
  try {
    const response = await api.post('/access-codes/generate',
      { note },
      { headers: { 'X-Admin-User': createdBy } }
    );
    return response.data.data;
  } catch (error) {
    console.error('Failed to create access code:', error);
    throw error;
  }
};

// Validate an access code
export const validateAccessCode = async (inputCode) => {
  if (!inputCode) {
    return { valid: false, message: 'Access code is required' };
  }

  try {
    const response = await api.post('/access-codes/validate', { code: inputCode.toUpperCase().trim() });
    if (response.data.success) {
      return { valid: true, message: 'Access granted' };
    }
    return { valid: false, message: 'Invalid access code' };
  } catch (error) {
    const message = error.response?.data?.message || 'Invalid or expired access code';
    return { valid: false, message };
  }
};

// Get all access codes (admin only)
export const getAccessCodes = async () => {
  try {
    const response = await api.get('/access-codes');
    return response.data.data || [];
  } catch (error) {
    console.error('Failed to get access codes:', error);
    return [];
  }
};

// Get valid (active + not expired) codes
export const getValidCodes = async () => {
  try {
    const response = await api.get('/access-codes/valid');
    return response.data.data || [];
  } catch (error) {
    console.error('Failed to get valid codes:', error);
    return [];
  }
};

// Deactivate an access code
export const deactivateAccessCode = async (codeId) => {
  try {
    await api.put(`/access-codes/${codeId}/deactivate`);
    return true;
  } catch (error) {
    console.error('Failed to deactivate code:', error);
    return false;
  }
};

// Delete an access code
export const deleteAccessCode = async (codeId) => {
  try {
    await api.delete(`/access-codes/${codeId}`);
    return true;
  } catch (error) {
    console.error('Failed to delete code:', error);
    return false;
  }
};

// No admin bypass - EVERYONE needs access code for write operations
export const hasAdminBypass = () => {
  return false;
};

// All write operations require access code
export const requiresAccessCode = (user, operation) => {
  const writeOperations = ['CREATE', 'UPDATE', 'DELETE'];
  return writeOperations.includes(operation);
};

// Get remaining time for a code (in minutes)
export const getCodeRemainingTime = (code) => {
  if (code.remainingMinutes !== undefined) {
    return code.remainingMinutes * 60 * 1000; // Convert to ms
  }
  if (!code.expiresAt) return 0;
  const expiresAt = new Date(code.expiresAt).getTime();
  return Math.max(0, expiresAt - Date.now());
};

// Format remaining time for display
export const formatRemainingTime = (code) => {
  const remaining = getCodeRemainingTime(code);
  if (remaining <= 0) return 'EXPIRED';
  const minutes = Math.floor(remaining / 60000);
  if (minutes >= 60) {
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m left`;
  }
  return `${minutes}m left`;
};

export default {
  verifyAdminCredentials,
  createAccessCode,
  validateAccessCode,
  getAccessCodes,
  getValidCodes,
  deactivateAccessCode,
  deleteAccessCode,
  hasAdminBypass,
  requiresAccessCode,
  getCodeRemainingTime,
  formatRemainingTime
};

