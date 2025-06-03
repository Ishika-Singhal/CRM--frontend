import axios from 'axios';
const BACKEND_URL = import.meta.VITE_BACKEND_URL || 'http://localhost:5000';

const crmApi = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // Important for sending cookies (session/auth)
});

// --- Authentication APIs ---
const auth = {
  // Google OAuth login is handled by redirecting the browser, not an Axios call
  // login: () => crmApi.get('/auth/google'), // Not directly used here, browser handles redirect

  logout: () => crmApi.get('/auth/logout'),
  getCurrentUser: () => crmApi.get('/auth/current_user'),
};

// --- Customer APIs ---
const customers = {
  createCustomer: (customerData) => crmApi.post('/api/customers', customerData),
  getCustomers: () => crmApi.get('/api/customers', {
    // Added headers to prevent caching for GET requests
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

// --- Order APIs ---
const orders = {
  createOrder: (orderData) => crmApi.post('/api/orders', orderData),
  getOrders: () => crmApi.get('/api/orders', {
    // Added headers to prevent caching for GET requests
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

// --- Campaign APIs ---
const campaigns = {
  createCampaign: (campaignData) => crmApi.post('/api/campaigns', campaignData),
  getCampaigns: () => crmApi.get('/api/campaigns', {
    // Added headers to prevent caching for GET requests
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

// --- Communication Log APIs ---
const communicationLogs = {
  // handleDeliveryReceipt is called by the backend simulator, not directly by frontend
  getCommunicationLogsForCampaign: (campaignId) => crmApi.get(`/api/communication-logs/campaign/${campaignId}`, {
    // Added headers to prevent caching for GET requests
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  }),
};

// --- AI APIs ---
const ai = {
  generateSegmentRulesFromAI: (naturalLanguageQuery) => crmApi.post('/api/ai/segment-rules', { naturalLanguageQuery }),
};

// Combine all API modules into a single export
const api = {
  ...auth,
  ...customers,
  ...orders,
  ...campaigns,
  ...communicationLogs,
  ...ai,
};

export default api;