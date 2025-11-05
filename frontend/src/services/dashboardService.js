import apiClient from './apiService';

const dashboardService = {
  // Get dashboard data for current user (auto-detect role)
  getDashboard: async () => {
    try {
      const response = await apiClient.get('/api/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard data' };
    }
  },

  // Get admin dashboard
  getAdminDashboard: async () => {
    try {
      const response = await apiClient.get('/api/dashboard/admin');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch admin dashboard' };
    }
  },

  // Get doctor dashboard
  getDoctorDashboard: async () => {
    try {
      const response = await apiClient.get('/api/dashboard/doctor');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch doctor dashboard' };
    }
  },

  // Get patient dashboard
  getPatientDashboard: async () => {
    try {
      const response = await apiClient.get('/api/dashboard/patient');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch patient dashboard' };
    }
  },

  // Get receptionist dashboard
  getReceptionistDashboard: async () => {
    try {
      const response = await apiClient.get('/api/dashboard/receptionist');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch receptionist dashboard' };
    }
  },

  // Get nurse dashboard
  getNurseDashboard: async () => {
    try {
      const response = await apiClient.get('/api/dashboard/nurse');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch nurse dashboard' };
    }
  },

  // Get pharmacist dashboard
  getPharmacistDashboard: async () => {
    try {
      const response = await apiClient.get('/api/dashboard/pharmacist');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch pharmacist dashboard' };
    }
  },

  // Get lab technician dashboard
  getLabTechnicianDashboard: async () => {
    try {
      const response = await apiClient.get('/api/dashboard/lab-technician');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch lab technician dashboard' };
    }
  },
};

export default dashboardService;
