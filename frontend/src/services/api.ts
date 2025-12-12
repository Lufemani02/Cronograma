// frontend/src/services/api.ts
import axios from 'axios';

// Base URL del backend
const API_BASE = 'http://localhost:3001/api';

// Creamos una instancia de axios con configuración predeterminada
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: agrega el token automáticamente si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;