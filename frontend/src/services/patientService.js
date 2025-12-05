import api from './api';

// Helper to extract data from wrapped API response { success, message, data }
const extractData = (response) => response.data?.data ?? response.data;

/**
 * Patient Service
 */
const patientService = {
  /**
   * Get all patients
   */
  getAll: async (params = {}) => {
    try {
      // Default to larger page size to get more data
      const queryParams = { size: 100, ...params };
      const response = await api.get('/patients', { params: queryParams });
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch patients';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get patient by ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/patients/${id}`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch patient';
      return { success: false, error: message };
    }
  },

  /**
   * Create new patient
   */
  create: async (patientData) => {
    try {
      const response = await api.post('/patients', patientData);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create patient';
      return { success: false, error: message };
    }
  },

  /**
   * Update patient
   */
  update: async (id, patientData) => {
    try {
      const response = await api.put(`/patients/${id}`, patientData);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update patient';
      return { success: false, error: message };
    }
  },

  /**
   * Get patient by user ID (for logged-in patient)
   */
  getByUserId: async (userId) => {
    try {
      const response = await api.get(`/patients/user/${userId}`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch patient';
      return { success: false, error: message };
    }
  },

  /**
   * Delete patient
   */
  delete: async (id) => {
    try {
      await api.delete(`/patients/${id}`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete patient';
      return { success: false, error: message };
    }
  },

  /**
   * Search patients
   */
  search: async (query) => {
    try {
      const response = await api.get('/patients/search', { params: { query } });
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to search patients';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get patient appointments
   */
  getAppointments: async (patientId) => {
    try {
      const response = await api.get(`/patients/${patientId}/appointments`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch appointments';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get patient prescriptions
   */
  getPrescriptions: async (patientId) => {
    try {
      const response = await api.get(`/patients/${patientId}/prescriptions`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch prescriptions';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get patient bills
   */
  getBills: async (patientId) => {
    try {
      const response = await api.get(`/patients/${patientId}/bills`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch bills';
      return { success: false, error: message, data: [] };
    }
  },
};

export default patientService;
