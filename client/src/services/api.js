import axios from 'axios';

// Create Axios instance with base URL (proxied by Vite to backend or customized via VITE_API_URL)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Standardize API error messages
 */
export const formatErrorMessage = (error) => {
  if (error.response) {
    // Backend returned a response with an error status
    return error.response.data?.message || `Server error (${error.response.status})`;
  } else if (error.request) {
    // Request was made but no response was received
    return 'Unable to reach backend server. Please verify that the server is running.';
  } else {
    // Setup error
    return error.message || 'An unexpected error occurred.';
  }
};

/**
 * Employee API Methods
 */
export const employeeApi = {
  // Get all employees with optional search and department filters
  getAll: async (params = {}) => {
    const response = await api.get('/employees', { params });
    return response.data;
  },

  // Get a single employee by ID
  getById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // Create a new employee
  create: async (data) => {
    const response = await api.post('/employees', data);
    return response.data;
  },

  // Update existing employee
  update: async (id, data) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  // Delete an employee
  delete: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  // Get employee statistics
  getStats: async () => {
    const response = await api.get('/employees/stats/summary');
    return response.data;
  },

  // Check backend health and DB status
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
