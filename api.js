import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getProfile: () => api.get('/auth/profile'),
};

// Forms API calls
export const formsAPI = {
  createForm: (formData) => api.post('/forms', formData),
  getForms: () => api.get('/forms'),
  getForm: (id) => api.get(`/forms/${id}`),
  updateForm: (id, formData) => api.put(`/forms/${id}`, formData),
  deleteForm: (id) => api.delete(`/forms/${id}`),
  getPublicForm: (id) => api.get(`/forms/public/${id}`),
  toggleFormStatus: (id) => api.patch(`/forms/${id}/toggle`),
};

// Responses API calls
export const responsesAPI = {
  submitResponse: (formId, responseData) => api.post(`/responses/${formId}`, responseData),
  getResponses: (formId) => api.get(`/responses/${formId}`),
  deleteResponse: (responseId) => api.delete(`/responses/${responseId}`),
  exportResponses: (formId) => api.get(`/responses/${formId}/export`, {
    responseType: 'blob',
  }),
};

// Utility function to handle API errors
export const handleAPIError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default api;