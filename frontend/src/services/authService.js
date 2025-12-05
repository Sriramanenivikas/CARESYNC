import api from './api';
import { storage } from '../utils/helpers';

const AUTH_TOKEN_KEY = 'token';
const USER_KEY = 'user';

/**
 * Authentication Service
 */
const authService = {
  /**
   * Login user
   */
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      // Backend returns wrapped response: { success, message, data: { token, user } }
      const { data } = response.data;
      const { token, user } = data;
      
      // Store token and user data
      storage.set(AUTH_TOKEN_KEY, token);
      storage.set(USER_KEY, user);
      
      return { success: true, user, token };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, error: message };
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    storage.remove(AUTH_TOKEN_KEY);
    storage.remove(USER_KEY);
  },

  /**
   * Get current user
   */
  getCurrentUser: () => {
    return storage.get(USER_KEY);
  },

  /**
   * Get auth token
   */
  getToken: () => {
    return storage.get(AUTH_TOKEN_KEY);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    const token = storage.get(AUTH_TOKEN_KEY);
    return !!token;
  },

  /**
   * Get user role
   */
  getUserRole: () => {
    const user = storage.get(USER_KEY);
    return user?.role || null;
  },

  /**
   * Check if user has specific role
   */
  hasRole: (requiredRole) => {
    const user = storage.get(USER_KEY);
    if (!user) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    return user.role === requiredRole;
  },

  /**
   * Validate token (check with server)
   */
  validateToken: async () => {
    try {
      const response = await api.get('/auth/validate');
      return response.data.valid;
    } catch {
      return false;
    }
  },

  /**
   * Refresh token
   */
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      const { token } = response.data;
      storage.set(AUTH_TOKEN_KEY, token);
      return { success: true, token };
    } catch (error) {
      return { success: false, error: 'Failed to refresh token' };
    }
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      return { success: false, error: message };
    }
  },
};

export default authService;
