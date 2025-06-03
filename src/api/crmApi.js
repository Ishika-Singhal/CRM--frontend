import axios from 'axios';
const BACKEND_URL = import.meta.VITE_BACKEND_URL || 'http://localhost:5000';

const crmApi = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, 
});

const auth = {
  

  logout: () => crmApi.get('/auth/logout'),
  getCurrentUser: () => crmApi.get('/auth/current_user'),
};

const customers = {
  createCustomer: (customerData) => crmApi.post('/api/customers', customerData),
  getCustomers: () => crmApi.get('/api/customers', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  }),
  getCustomerById: (id) => crmApi.get(`/api/customers/${id}`, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  }),
  updateCustomer: (id, customerData) => crmApi.put(`/api/customers/${id}`, customerData),
  deleteCustomer: (id) => crmApi.delete(`/api/customers/${id}`),
};

const orders = {
  createOrder: (orderData) => crmApi.post('/api/orders', orderData),
  getOrders: () => crmApi.get('/api/orders', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  }),
  getOrderById: (id) => crmApi.get(`/api/orders/${id}`, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  }),
  updateOrder: (id, orderData) => crmApi.put(`/api/orders/${id}`, orderData),
  deleteOrder: (id) => crmApi.delete(`/api/orders/${id}`),
};

const campaigns = {
  createCampaign: (campaignData) => crmApi.post('/api/campaigns', campaignData),
  getCampaigns: () => crmApi.get('/api/campaigns', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  }),
  getCampaignById: (id) => crmApi.get(`/api/campaigns/${id}`, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  }),
  updateCampaign: (id, campaignData) => crmApi.put(`/api/campaigns/${id}`, campaignData),
  deleteCampaign: (id) => crmApi.delete(`/api/campaigns/${id}`),
  getAudiencePreview: (segmentRules) => crmApi.post('/api/campaigns/audience-preview', { segmentRules }),
};

const communicationLogs = {
  getCommunicationLogsForCampaign: (campaignId) => crmApi.get(`/api/communication-logs/campaign/${campaignId}`, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  }),
};

const ai = {
  generateSegmentRulesFromAI: (naturalLanguageQuery) => crmApi.post('/api/ai/segment-rules', { naturalLanguageQuery }),
};

const api = {
  ...auth,
  ...customers,
  ...orders,
  ...campaigns,
  ...communicationLogs,
  ...ai,
};

export default api;