import axios from 'axios';
import apiClient from './apiService';

// Use a single source of truth for base URL; apiService uses REACT_APP_API_BASE_URL
const AUTH_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:2222';

const authService = {
  // Login with username and password - use full URL to /auth/login
  login: async (credentials) => {
    try {
      const url = `${AUTH_BASE_URL}/auth/login`;
      const response = await axios.post(url, credentials);
      const data = response.data;

      if (data?.jwtToken) {
        localStorage.setItem('jwtToken', data.jwtToken);
        if (data.role) localStorage.setItem('userRole', data.role);
        if (data.userId) localStorage.setItem('userId', data.userId);
        if (data.username) localStorage.setItem('username', data.username);
        if (data.email) localStorage.setItem('email', data.email);
        if (data.dashboardUrl) localStorage.setItem('dashboardUrl', data.dashboardUrl);
      }

      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  },

  // Logout via /auth/logout (no /api prefix)
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // ignore
    } finally {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('dashboardUrl');
    }
  },

  // Get current user info from /api/dashboard/me
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/api/dashboard/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get user info' };
    }
  },

  // Request OTP
  requestOtp: async (otpRequest) => {
    try {
      const response = await axios.post(`${AUTH_BASE_URL}/auth/otp/request`, otpRequest);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'OTP request failed' };
    }
  },

  // Verify OTP
  verifyOtp: async (otpVerify) => {
    try {
      const response = await axios.post(`${AUTH_BASE_URL}/auth/otp/verify`, otpVerify);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'OTP verification failed' };
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await axios.post(`${AUTH_BASE_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  isAuthenticated: () => !!localStorage.getItem('jwtToken'),
  getUserRole: () => localStorage.getItem('userRole'),
  getDashboardUrl: () => localStorage.getItem('dashboardUrl') || '/dashboard',
};

export default authService;
