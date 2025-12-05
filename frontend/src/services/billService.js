import api from './api';

// Helper to extract data from wrapped API response { success, message, data }
const extractData = (response) => response.data?.data ?? response.data;

/**
 * Bill Service
 */
const billService = {
  /**
   * Get all bills
   */
  getAll: async (params = {}) => {
    try {
      // Default to larger page size to get more data
      const queryParams = { size: 100, ...params };
      const response = await api.get('/bills', { params: queryParams });
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch bills';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get bill by ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/bills/${id}`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch bill';
      return { success: false, error: message };
    }
  },

  /**
   * Create new bill
   */
  create: async (billData) => {
    try {
      const response = await api.post('/bills', billData);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create bill';
      return { success: false, error: message };
    }
  },

  /**
   * Update bill
   */
  update: async (id, billData) => {
    try {
      const response = await api.put(`/bills/${id}`, billData);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update bill';
      return { success: false, error: message };
    }
  },

  /**
   * Delete bill
   */
  delete: async (id) => {
    try {
      await api.delete(`/bills/${id}`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete bill';
      return { success: false, error: message };
    }
  },

  /**
   * Update bill status
   */
  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/bills/${id}/status`, { status });
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update status';
      return { success: false, error: message };
    }
  },

  /**
   * Mark bill as paid
   */
  markAsPaid: async (id) => {
    try {
      const response = await api.patch(`/bills/${id}/pay`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to mark as paid';
      return { success: false, error: message };
    }
  },

  /**
   * Get bills by patient
   */
  getByPatient: async (patientId) => {
    try {
      const response = await api.get(`/bills/patient/${patientId}`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch bills';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get pending bills
   */
  getPending: async () => {
    try {
      const response = await api.get('/bills/pending');
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch pending bills';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get overdue bills
   */
  getOverdue: async () => {
    try {
      const response = await api.get('/bills/overdue');
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch overdue bills';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get bill statistics
   */
  getStatistics: async () => {
    try {
      const response = await api.get('/bills/statistics');
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch statistics';
      return { success: false, error: message };
    }
  },
};

export default billService;
