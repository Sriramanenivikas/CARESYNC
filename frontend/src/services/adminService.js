import api from './api';

// Helper to extract data from wrapped API response { success, message, data }
const extractData = (response) => response.data?.data ?? response.data;

/**
 * Admin/Dashboard Service
 */
const adminService = {
  /**
   * Get admin dashboard (real backend endpoint)
   */
  getAdminDashboard: async () => {
    try {
      const response = await api.get('/dashboard/admin');
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch dashboard';
      return { success: false, error: message };
    }
  },

  /**
   * Get doctor dashboard
   */
  getDoctorDashboard: async (doctorId) => {
    try {
      const response = await api.get(`/dashboard/doctor/${doctorId}`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch dashboard';
      return { success: false, error: message };
    }
  },

  /**
   * Get patient dashboard
   */
  getPatientDashboard: async (patientId) => {
    try {
      const response = await api.get(`/dashboard/patient/${patientId}`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch dashboard';
      return { success: false, error: message };
    }
  },

  /**
   * Get dashboard statistics (legacy - uses admin dashboard)
   */
  getDashboardStats: async () => {
    try {
      const response = await api.get('/dashboard/admin');
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch statistics';
      return { success: false, error: message };
    }
  },

  /**
   * Get all users
   */
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', { params });
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch users';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get user by ID
   */
  getUserById: async (id) => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch user';
      return { success: false, error: message };
    }
  },

  /**
   * Create user
   */
  createUser: async (userData) => {
    try {
      const response = await api.post('/admin/users', userData);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create user';
      return { success: false, error: message };
    }
  },

  /**
   * Update user
   */
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/admin/users/${id}`, userData);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update user';
      return { success: false, error: message };
    }
  },

  /**
   * Delete user
   */
  deleteUser: async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete user';
      return { success: false, error: message };
    }
  },

  /**
   * Update user role
   */
  updateUserRole: async (id, role) => {
    try {
      const response = await api.patch(`/admin/users/${id}/role`, { role });
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update role';
      return { success: false, error: message };
    }
  },

  /**
   * Get appointment analytics
   */
  getAppointmentAnalytics: async (period = 'month') => {
    try {
      const response = await api.get('/admin/analytics/appointments', {
        params: { period }
      });
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch analytics';
      return { success: false, error: message };
    }
  },

  /**
   * Get revenue analytics
   */
  getRevenueAnalytics: async (period = 'month') => {
    try {
      const response = await api.get('/admin/analytics/revenue', {
        params: { period }
      });
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch analytics';
      return { success: false, error: message };
    }
  },

  /**
   * Get patient demographics
   */
  getPatientDemographics: async () => {
    try {
      const response = await api.get('/admin/analytics/demographics');
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch demographics';
      return { success: false, error: message };
    }
  },

  /**
   * Get doctor performance
   */
  getDoctorPerformance: async () => {
    try {
      const response = await api.get('/admin/analytics/doctor-performance');
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch performance data';
      return { success: false, error: message };
    }
  },

  /**
   * Get system logs
   */
  getSystemLogs: async (params = {}) => {
    try {
      const response = await api.get('/admin/logs', { params });
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch logs';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Export data
   */
  exportData: async (type, format = 'csv') => {
    try {
      const response = await api.get(`/admin/export/${type}`, {
        params: { format },
        responseType: 'blob'
      });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to export data';
      return { success: false, error: message };
    }
  },
};

export default adminService;
