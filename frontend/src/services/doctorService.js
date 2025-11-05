import apiClient from './apiService';

const doctorService = {
  // Get all doctors
  getAllDoctors: async () => {
    const response = await apiClient.get('/Doctors');
    return response.data;
  },

  // Get doctor by ID
  getDoctorById: async (id) => {
    const response = await apiClient.get(`/Doctors/${id}`);
    return response.data;
  },

  // Create doctor
  createDoctor: async (doctorData) => {
    const response = await apiClient.post('/Doctors', doctorData);
    return response.data;
  },

  // Update doctor
  updateDoctor: async (id, doctorData) => {
    const response = await apiClient.put(`/Doctors/${id}`, doctorData);
    return response.data;
  },

  // Delete doctor
  deleteDoctor: async (id) => {
    const response = await apiClient.delete(`/Doctors/${id}`);
    return response.data;
  }
};

export default doctorService;
