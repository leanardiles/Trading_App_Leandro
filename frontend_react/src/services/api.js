import axios from 'axios'
import config from '../config'

// Create axios instance
const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests (moved after logging interceptor)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error details for debugging
    console.error('API Error:', {
      message: error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config?.baseURL + error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      code: error.code,
    })
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Log all requests for debugging and add token
api.interceptors.request.use(
  (config) => {
    // Add token if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Token ${token}`
    }
    
    // Log request details
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: config.baseURL + config.url,
      hasToken: !!token,
    })
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data) => api.post('/users/register/', data),
  login: (data) => api.post('/users/login/', data),
  logout: () => api.post('/users/logout/'),
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data) => api.patch('/users/update_profile/', data),
}

// User API
export const userAPI = {
  list: () => api.get('/users/'),
  get: (id) => api.get(`/users/${id}/`),
  update: (id, data) => api.patch(`/users/${id}/`, data),
}

// Transaction API
export const transactionAPI = {
  list: () => api.get('/transactions/'),
  get: (id) => api.get(`/transactions/${id}/`),
  create: (data) => api.post('/transactions/', data),
  update: (id, data) => api.patch(`/transactions/${id}/`, data),
  delete: (id) => api.delete(`/transactions/${id}/`),
  byType: (type) => api.get(`/transactions/by_type/?type=${type}`),
  recent: () => api.get('/transactions/recent/'),
  summary: () => api.get('/transactions/summary/'),
}

// Holding API
export const holdingAPI = {
  list: () => api.get('/holdings/'),
  get: (id) => api.get(`/holdings/${id}/`),
  create: (data) => api.post('/holdings/', data),
  update: (id, data) => api.patch(`/holdings/${id}/`, data),
  delete: (id) => api.delete(`/holdings/${id}/`),
  byStock: (stock) => api.get(`/holdings/by_stock/?stock=${stock}`),
  profitable: () => api.get('/holdings/profitable/'),
  losing: () => api.get('/holdings/losing/'),
  summary: () => api.get('/holdings/summary/'),
}

// Portfolio API
export const portfolioAPI = {
  summary: () => api.get('/portfolio/summary/'),
  performance: () => api.get('/portfolio/performance/'),
}

// Trading API
export const tradingAPI = {
  buy: (data) => api.post('/trading/buy/', data),
  sell: (data) => api.post('/trading/sell/', data),
}

// ML Strategy API
export const mlAPI = {
  pivotAnalysis: (data) => api.post('/ml/pivot/', data),
  nextDayPrediction: (data) => api.post('/ml/predict/', data),
  stockScreener: (data) => api.post('/ml/screener/', data),
  indexRebalancing: (data) => api.post('/ml/index-event/', data),
}

export default api

