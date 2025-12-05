import axios from 'axios';
import { storage } from '../utils/helpers';
import { sanitizeObject } from '../utils/security';

// API Base URL - ensure /api suffix is present
const getApiBaseUrl = () => {
  let url = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
  // Remove trailing slash if present
  url = url.replace(/\/$/, '');
  // Add /api suffix if not present
  if (!url.endsWith('/api')) {
    url = url + '/api';
  }
  return url;
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = storage.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Sanitize request data
    if (config.data && typeof config.data === 'object') {
      config.data = sanitizeObject(config.data);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response) {
      // Handle 401 - Unauthorized
      if (response.status === 401) {
        storage.remove('token');
        storage.remove('user');
        window.location.href = '/login';
      }
      
      // Handle 403 - Forbidden
      if (response.status === 403) {
        console.error('Access denied');
      }
      
      // Handle 429 - Rate limited
      if (response.status === 429) {
        console.error('Too many requests. Please try again later.');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
