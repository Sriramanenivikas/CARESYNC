import api from './api';

// Helper to extract data from wrapped API response { success, message, data }
const extractData = (response) => response.data?.data ?? response.data;

// Transform appointment data to match backend API expectations
const transformAppointmentData = (data) => {
  const transformed = { ...data };
  
  // If appointmentDateTime is provided, split into date and time
  if (data.appointmentDateTime) {
    const dateTime = new Date(data.appointmentDateTime);
    transformed.appointmentDate = dateTime.toISOString().split('T')[0];
    transformed.appointmentTime = dateTime.toTimeString().slice(0, 8);
    delete transformed.appointmentDateTime;
  }
  
  return transformed;
};

/**
 * Appointment Service
 */
const appointmentService = {
  /**
   * Get all appointments
   */
  getAll: async (params = {}) => {
    try {
      // Default to larger page size to get more data
      const queryParams = { size: 100, ...params };
      const response = await api.get('/appointments', { params: queryParams });
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch appointments';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get appointment by ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/appointments/${id}`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch appointment';
      return { success: false, error: message };
    }
  },

  /**
   * Create new appointment
   */
  create: async (appointmentData) => {
    try {
      // Transform appointmentDateTime to separate date and time if needed
      const transformedData = transformAppointmentData(appointmentData);
      const response = await api.post('/appointments', transformedData);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create appointment';
      return { success: false, error: message };
    }
  },

  /**
   * Update appointment
   */
  update: async (id, appointmentData) => {
    try {
      // Transform appointmentDateTime to separate date and time if needed
      const transformedData = transformAppointmentData(appointmentData);
      const response = await api.put(`/appointments/${id}`, transformedData);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update appointment';
      return { success: false, error: message };
    }
  },

  /**
   * Delete appointment
   */
  delete: async (id) => {
    try {
      await api.delete(`/appointments/${id}`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete appointment';
      return { success: false, error: message };
    }
  },

  /**
   * Update appointment status
   */
  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/appointments/${id}/status`, { status });
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update status';
      return { success: false, error: message };
    }
  },

  /**
   * Get appointments by date range
   */
  getByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get('/appointments/range', {
        params: { startDate, endDate }
      });
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch appointments';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get today's appointments
   */
  getToday: async () => {
    try {
      const response = await api.get('/appointments/today');
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch today\'s appointments';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get upcoming appointments
   */
  getUpcoming: async () => {
    try {
      const response = await api.get('/appointments/upcoming');
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch upcoming appointments';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get appointments by patient
   */
  getByPatient: async (patientId) => {
    try {
      const response = await api.get(`/appointments/patient/${patientId}`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch appointments';
      return { success: false, error: message, data: [] };
    }
  },

  /**
   * Get appointments by doctor
   */
  getByDoctor: async (doctorId) => {
    try {
      const response = await api.get(`/appointments/doctor/${doctorId}`);
      return { success: true, data: extractData(response) };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch appointments';
      return { success: false, error: message, data: [] };
    }
  },
};

export default appointmentService;
