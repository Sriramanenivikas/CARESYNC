import api from './api';

// Helper to extract data from wrapped API response { success, message, data }
const extractData = (response) => response.data?.data ?? response.data;

/**
 * Doctor Service
 */
const doctorService = {
  /**
   * Get all doctors
   */
  getAll: async (params = {}) => {
    try {
      // Default to larger page size to get more data
      const queryParams = { size: 100, ...params };
      const response = await api.get('/doctors', { params: queryParams });
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch doctors';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get doctor by ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/doctors/${id}`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch doctor';
      return { success: false, error: message };
    }
  },

  /**
   * Get doctor by user ID (for logged-in doctor)
   */
  getByUserId: async (userId) => {
    try {
      const response = await api.get(`/doctors/user/${userId}`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch doctor';
      return { success: false, error: message };
    }
  },

  /**
   * Create new doctor
   */
  create: async (doctorData) => {
    try {
      const response = await api.post('/doctors', doctorData);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create doctor';
      return { success: false, error: message };
    }
  },

  /**
   * Update doctor
   */
  update: async (id, doctorData) => {
    try {
      const response = await api.put(`/doctors/${id}`, doctorData);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update doctor';
      return { success: false, error: message };
    }
  },

  /**
   * Delete doctor
   */
  delete: async (id) => {
    try {
      await api.delete(`/doctors/${id}`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete doctor';
      return { success: false, error: message };
    }
  },

  /**
   * Search doctors
   */
  search: async (query) => {
    try {
      const response = await api.get('/doctors/search', { params: { query } });
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to search doctors';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get doctors by specialization
   */
  getBySpecialization: async (specialization) => {
    try {
      const response = await api.get('/doctors/specialization', { 
        params: { specialization } 
      });
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch doctors';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get doctor appointments
   */
  getAppointments: async (doctorId) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/appointments`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch appointments';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get doctor prescriptions
   */
  getPrescriptions: async (doctorId) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/prescriptions`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch prescriptions';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get available time slots
   */
  getAvailableSlots: async (doctorId, date) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/available-slots`, {
        params: { date }
      });
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch available slots';
      return { success: false, error: message, data: [] };
    }
  },
};

export default doctorService;
