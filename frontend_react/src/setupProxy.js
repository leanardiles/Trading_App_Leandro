const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
  // Get backend URL from environment or use default
  // Use 127.0.0.1 instead of localhost to avoid IPv6 issues
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000'
  
  console.log('🔧 Proxy Configuration:', {
    path: '/api',
    target: backendUrl,
  })
  
  app.use(
    '/api',
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      // Fix IPv6 connection issues by forcing IPv4
      xfwd: true,
      onProxyReq: (proxyReq, req, res) => {
        console.log('🔄 Proxying request:', {
          method: req.method,
          url: req.url,
          target: backendUrl + req.url,
        })
      },
      onError: (err, req, res) => {
        console.error('❌ Proxy error:', err.message)
        console.error('Request details:', {
          method: req.method,
          url: req.url,
          target: backendUrl,
        })
        res.status(500).json({
          error: 'Proxy error',
          message: 'Could not connect to backend server. Make sure Django is running on port 8000.',
        })
      },
    })
  )
}

