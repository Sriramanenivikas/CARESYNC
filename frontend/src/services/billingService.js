import apiClient from './apiService';

const billingService = {
  // Create bill
  createBill: async (billData) => {
    const response = await apiClient.post('/api/billing/bills', billData);
    return response.data;
  },

  // Get bill by ID
  getBillById: async (id) => {
    const response = await apiClient.get(`/api/billing/bills/${id}`);
    return response.data;
  },

  // Get bills by patient ID
  getBillsByPatient: async (patientId) => {
    const response = await apiClient.get(`/api/billing/bills/patient/${patientId}`);
    return response.data;
  },

  // Add bill item
  addBillItem: async (billId, itemData) => {
    const response = await apiClient.post(`/api/billing/bills/${billId}/items`, itemData);
    return response.data;
  },

  // Record payment
  recordPayment: async (paymentData) => {
    const response = await apiClient.post('/api/billing/payments', paymentData);
    return response.data;
  }
};

export default billingService;
