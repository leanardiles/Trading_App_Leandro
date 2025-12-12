# Configuration Guide

This guide explains how to configure the backend URL for the trading platform.

## Configuration Files

### 1. `src/config.js` - Frontend API Configuration
This file controls how the frontend connects to the backend API.

**Default Configuration:**
```javascript
API_BASE_URL: '/api'  // Uses proxy in development
BACKEND_URL: 'http://localhost:8000'
```

**To change the backend URL:**
1. Open `frontend/src/config.js`
2. Modify the `API_BASE_URL` or `BACKEND_URL` values
3. For production, set `API_BASE_URL` to the full URL: `'http://your-backend-url:8000/api'`

### 2. `src/config.proxy.js` - Development Proxy Configuration
This file controls the proxy settings for the React development server.

**Default Configuration:**
```javascript
target: 'http://localhost:8000'  // Backend server URL
path: '/api'  // API path prefix
```

**To change the proxy target:**
1. Open `frontend/src/config.proxy.js`
2. Modify the `target` value to your backend server URL

## Environment Variables

You can also use environment variables to configure the URLs:

### Create `.env` file in `frontend/` directory:

```env
# Backend API Base URL
# For development (with proxy): leave empty or use '/api'
# For production: use full URL like 'http://your-backend-url:8000/api'
REACT_APP_API_URL=/api

# Backend Server URL (for proxy configuration)
REACT_APP_BACKEND_URL=http://localhost:8000
```

## Configuration Scenarios

### Development (with Proxy - Default)
- Frontend runs on: `http://localhost:3000`
- Backend runs on: `http://localhost:8000`
- Proxy forwards `/api/*` requests to backend
- **Config:** `API_BASE_URL: '/api'` (default)

### Production (Direct Connection)
- Frontend deployed separately
- Backend at: `https://api.yourdomain.com`
- **Config:** `API_BASE_URL: 'https://api.yourdomain.com/api'`

### Development (Different Backend Port)
- Backend runs on: `http://localhost:8080`
- **Config:** 
  - `config.js`: `API_BASE_URL: 'http://localhost:8080/api'`
  - `config.proxy.js`: `target: 'http://localhost:8080'`

## Quick Configuration Examples

### Change Backend Port to 8080

**In `frontend/src/config.js`:**
```javascript
API_BASE_URL: 'http://localhost:8080/api',
BACKEND_URL: 'http://localhost:8080',
```

**In `frontend/src/config.proxy.js`:**
```javascript
target: 'http://localhost:8080',
```

### Use Production Backend

**In `frontend/src/config.js`:**
```javascript
API_BASE_URL: 'https://api.yourdomain.com/api',
```

**Note:** When using full URLs, the proxy is bypassed. Make sure CORS is configured on your backend.

## Troubleshooting

### Issue: "Network Error" or "CORS Error"
- Check that the backend URL in `config.js` is correct
- Verify the backend server is running
- Check CORS settings in Django `settings.py`

### Issue: Proxy not working
- Restart the React development server after changing `config.proxy.js`
- Check that `setupProxy.js` is correctly importing the config
- Verify the backend is running on the configured port

### Issue: API calls going to wrong URL
- Check browser DevTools Network tab to see the actual request URL
- Verify `config.js` is being imported correctly in `api.js`
- Clear browser cache and restart the dev server

