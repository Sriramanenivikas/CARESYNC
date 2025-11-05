// filepath: /Users/vikas/Downloads/CareSync/frontend/src/services/patientService.js
import apiClient from './apiService';

const patientService = {
  // Get all patients (controller mapped at /Patients with capital P)
  getAllPatients: async () => {
    const response = await apiClient.get('/Patients');
    return response.data;
  },

  // Get patient by ID
  getPatientById: async (id) => {
    const response = await apiClient.get(`/Patients/${id}`);
    return response.data;
  },

  // Detailed patient with insurance and appointments
  getPatientDetails: async (id) => {
    const response = await apiClient.get(`/Patients/${id}/details`);
    return response.data;
  },

  // Create patient
  createPatient: async (patientData) => {
    const response = await apiClient.post('/Patients', patientData);
    return response.data;
  },

  // Update patient
  updatePatient: async (id, patientData) => {
    const response = await apiClient.put(`/Patients/${id}`, patientData);
    return response.data;
  },

  // Delete patient
  deletePatient: async (id) => {
    const response = await apiClient.delete(`/Patients/${id}`);
    return response.data;
  },

  // Get blood group stats
  getBloodGroupStats: async () => {
    const response = await apiClient.get('/Patients/stats/blood-groups');
    return response.data;
  }
};

export default patientService;
