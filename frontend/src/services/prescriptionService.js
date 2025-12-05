import api from './api';

// Helper to extract data from wrapped API response { success, message, data }
const extractData = (response) => response.data?.data ?? response.data;

/**
 * Prescription Service
 */
const prescriptionService = {
  /**
   * Get all prescriptions
   */
  getAll: async (params = {}) => {
    try {
      // Default to larger page size to get more data
      const queryParams = { size: 100, ...params };
      const response = await api.get('/prescriptions', { params: queryParams });
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch prescriptions';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get prescription by ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/prescriptions/${id}`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch prescription';
      return { success: false, error: message };
    }
  },

  /**
   * Create new prescription
   */
  create: async (prescriptionData) => {
    try {
      const response = await api.post('/prescriptions', prescriptionData);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create prescription';
      return { success: false, error: message };
    }
  },

  /**
   * Update prescription
   */
  update: async (id, prescriptionData) => {
    try {
      const response = await api.put(`/prescriptions/${id}`, prescriptionData);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update prescription';
      return { success: false, error: message };
    }
  },

  /**
   * Delete prescription
   */
  delete: async (id) => {
    try {
      await api.delete(`/prescriptions/${id}`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete prescription';
      return { success: false, error: message };
    }
  },

  /**
   * Get prescriptions by patient
   */
  getByPatient: async (patientId) => {
    try {
      const response = await api.get(`/prescriptions/patient/${patientId}`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch prescriptions';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get prescriptions by doctor
   */
  getByDoctor: async (doctorId) => {
    try {
      const response = await api.get(`/prescriptions/doctor/${doctorId}`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch prescriptions';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get active prescriptions
   */
  getActive: async (patientId) => {
    try {
      const response = await api.get(`/prescriptions/active/${patientId}`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch active prescriptions';
      return { success: false, error: message, data: [] };
    }
  },
};

export default prescriptionService;
