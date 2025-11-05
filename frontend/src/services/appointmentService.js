import apiClient from './apiService';

const appointmentService = {
  // Get all appointments
  getAllAppointments: async () => {
    const response = await apiClient.get('/api/appointments');
    return response.data;
  },

  // Get appointment by ID
  getAppointmentById: async (id) => {
    const response = await apiClient.get(`/api/appointments/${id}`);
    return response.data;
  },

  // Get appointments by patient ID
  getAppointmentsByPatient: async (patientId) => {
    const response = await apiClient.get(`/api/appointments/patient/${patientId}`);
    return response.data;
  },

  // Get appointments by doctor ID
  getAppointmentsByDoctor: async (doctorId) => {
    const response = await apiClient.get(`/api/appointments/doctor/${doctorId}`);
    return response.data;
  },

  // Create appointment
  createAppointment: async (appointmentData) => {
    const response = await apiClient.post('/api/appointments', appointmentData);
    return response.data;
  },

  // Update appointment
  updateAppointment: async (id, appointmentData) => {
    const response = await apiClient.put(`/api/appointments/${id}`, appointmentData);
    return response.data;
  },

  // Update appointment status (backend uses PUT cancel endpoint; keeping a generic status would require backend support)
  updateAppointmentStatus: async (id, status) => {
    const response = await apiClient.put(`/api/appointments/${id}`, { status });
    return response.data;
  },

  // Cancel appointment (backend defines PUT /{id}/cancel)
  cancelAppointment: async (id) => {
    const response = await apiClient.put(`/api/appointments/${id}/cancel`);
    return response.data;
  },

  // Delete appointment
  deleteAppointment: async (id) => {
    const response = await apiClient.delete(`/api/appointments/${id}`);
    return response.data;
  }
};

export default appointmentService;
