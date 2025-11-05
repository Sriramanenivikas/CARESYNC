import apiClient from './apiService';

const prescriptionService = {
  // Get all prescriptions
  getAllPrescriptions: async () => {
    const response = await apiClient.get('/api/prescriptions');
    return response.data;
  },

  // Get prescription by ID
  getPrescriptionById: async (id) => {
    const response = await apiClient.get(`/api/prescriptions/${id}`);
    return response.data;
  },

  // Get prescriptions by patient ID
  getPrescriptionsByPatient: async (patientId) => {
    const response = await apiClient.get(`/api/prescriptions/patient/${patientId}`);
    return response.data;
  },

  // Get prescriptions by doctor ID
  getPrescriptionsByDoctor: async (doctorId) => {
    const response = await apiClient.get(`/api/prescriptions/doctor/${doctorId}`);
    return response.data;
  },

  // Create prescription
  createPrescription: async (prescriptionData) => {
    const response = await apiClient.post('/api/prescriptions', prescriptionData);
    return response.data;
  },

  // Update prescription
  updatePrescription: async (id, prescriptionData) => {
    const response = await apiClient.put(`/api/prescriptions/${id}`, prescriptionData);
    return response.data;
  },

  // Delete prescription
  deletePrescription: async (id) => {
    const response = await apiClient.delete(`/api/prescriptions/${id}`);
    return response.data;
  }
};

export default prescriptionService;
