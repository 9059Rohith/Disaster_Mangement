// frontend/src/services/api.j
import axios from 'axios';

// Create base axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Auth
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  // Alerts
  getAlerts: async () => {
    const response = await api.get('/alerts');
    return response.data;
  },
  
  createAlert: async (alertData) => {
    const response = await api.post('/alerts', alertData);
    return response.data;
  },
  
  // Resources
  getResources: async () => {
    const response = await api.get('/resources');
    return response.data;
  },
  
  addResource: async (resourceData) => {
    const response = await api.post('/resources', resourceData);
    return response.data;
  },
  
  // Reports
  getReports: async () => {
    const response = await api.get('/reports');
    return response.data;
  },
  
  createReport: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },
  
  // Weather API (via our backend)
  getCurrentWeather: async (city) => {
    const response = await api.get(`/external/weather/${city}`);
    return response.data;
  },
  
  getWeatherForecast: async (city) => {
    const response = await api.get(`/external/weather/forecast/${city}`);
    return response.data;
  },
  
  getWeatherAlerts: async (lat, lon) => {
    const response = await api.get(`/external/weather/alerts/${lat}/${lon}`);
    return response.data;
  },
  
  // Earthquake Data (via our backend)
  getRecentEarthquakes: async () => {
    const response = await api.get('/external/earthquakes/recent');
    return response.data;
  },
  
  getSignificantEarthquakes: async () => {
    const response = await api.get('/external/earthquakes/significant');
    return response.data;
  },
  
  // News API (via our backend)
  getDisasterNews: async (page = 1) => {
    const response = await api.get(`/external/news/disasters?page=${page}`);
    return response.data;
  },
  
  getNewsByDisasterType: async (disasterType, page = 1) => {
    const response = await api.get(`/external/news/bydisaster/${disasterType}?page=${page}`);
    return response.data;
  }
};

export default api;
