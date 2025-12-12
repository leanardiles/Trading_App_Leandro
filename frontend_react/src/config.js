// Backend API Configuration
// Change this URL to point to your backend server
const config = {
  // Backend API Base URL
  // For development with proxy: use '/api' (proxy will forward to http://localhost:8000)
  // For production or direct connection: use full URL like 'http://localhost:8000/api'
  API_BASE_URL: process.env.REACT_APP_API_URL || '/api',
  
  // Backend server URL (for direct connections, if not using proxy)
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000',
  
  // Full API URL (combines backend URL with API path)
  get API_URL() {
    // If API_BASE_URL starts with http, use it directly (production)
    if (this.API_BASE_URL.startsWith('http')) {
      return this.API_BASE_URL;
    }
    // Otherwise, use the proxy path (development)
    return this.API_BASE_URL;
  },
};

// Log configuration on load (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 API Configuration:', {
    API_BASE_URL: config.API_BASE_URL,
    BACKEND_URL: config.BACKEND_URL,
    API_URL: config.API_URL,
    NODE_ENV: process.env.NODE_ENV,
  });
}

export default config;

