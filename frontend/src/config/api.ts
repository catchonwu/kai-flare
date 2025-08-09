// API Configuration
// Controls the base URL for API requests

export const API_CONFIG = {
  // Base URL for API requests
  // In development: '/api' will proxy to the backend
  // In production: '/api' will be the same origin
  baseUrl: '/api',
  
  // Request timeout in milliseconds
  timeout: 10000,
  
  // Enable request logging for development
  enableLogging: process.env.NODE_ENV === 'development'
} as const;

export default API_CONFIG;