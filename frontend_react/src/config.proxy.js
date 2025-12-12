// Proxy Configuration for Development
// This file configures the proxy middleware for the React development server
// Change the target URL to point to your backend server

const PROXY_CONFIG = {
  // Backend server URL (where Django is running)
  target: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000',
  
  // API path prefix that will be proxied
  path: '/api',
  
  // Additional proxy options
  changeOrigin: true,
  secure: false, // Set to true if using HTTPS
};

module.exports = PROXY_CONFIG;

