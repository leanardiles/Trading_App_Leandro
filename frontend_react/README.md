# Trading Platform Frontend

React.js frontend dashboard for the Index Rebalancing Trading Platform.

Built with **Create React App**.

## Features

- **User Authentication**: Login and registration with token-based authentication
- **Dashboard**: Portfolio overview with key metrics and recent transactions
- **Portfolio Management**: Detailed portfolio view with holdings and performance
- **Transaction Management**: Create and track all financial transactions
- **Holdings Management**: Manage stock holdings with real-time P/L tracking
- **ML Trading Strategies**: 
  - Pivot Point Analysis
  - Next-Day Price Prediction
  - Stock Screener for Index Addition
  - Index Rebalancing Strategy Analysis
- **Performance Analytics**: Track portfolio performance with detailed metrics

## Prerequisites

- Node.js 16+ and npm/yarn
- Django backend running on `http://localhost:8000`

## Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open browser**
   The app will automatically open at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/          # Reusable components
│   │   └── Layout.jsx       # Main layout with navigation
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx  # Authentication context
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Portfolio.jsx
│   │   ├── Transactions.jsx
│   │   ├── Holdings.jsx
│   │   ├── MLStrategies.jsx
│   │   ├── Performance.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── services/            # API services
│   │   └── api.js           # Axios API client
│   ├── utils/               # Utility functions
│   │   └── format.js        # Formatting helpers
│   ├── App.jsx              # Main app component
│   ├── index.js             # Entry point
│   ├── index.css            # Global styles
│   └── setupProxy.js        # API proxy configuration
├── package.json
└── README.md
```

## Configuration

The frontend is configured to proxy API requests to the Django backend at `http://localhost:8000`. This is configured in `src/setupProxy.js`.

If you need to change the backend URL, update:
- `src/setupProxy.js` - proxy target
- `src/services/api.js` - `API_BASE_URL`

## Available Scripts

- `npm start` - Start development server (opens on port 3000)
- `npm run build` - Build for production (creates `build/` folder)
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)

## Features in Detail

### Authentication
- Secure token-based authentication
- Automatic token refresh
- Protected routes

### Dashboard
- Real-time portfolio metrics
- Recent transactions display
- Quick stats overview

### ML Strategies
1. **Pivot Point Analysis**: Calculate pivot points and generate trading signals
2. **Next-Day Prediction**: ML-based price movement prediction
3. **Stock Screener**: Screen stocks for index addition eligibility
4. **Index Rebalancing**: Analyze index reconstitution events with trading recommendations

### Portfolio & Performance
- Detailed holdings breakdown
- Profit/loss tracking
- Performance rankings
- Best/worst performers

## API Integration

All API calls are handled through the `api.js` service file. The service includes:
- Automatic token injection
- Error handling
- Request/response interceptors

## Technologies Used

- **React 18** - UI library
- **Create React App** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **React Router** - Routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **http-proxy-middleware** - API proxy for development

## Troubleshooting

### CORS Errors
Make sure the Django backend has CORS configured correctly in `settings.py`:
- `corsheaders` middleware is enabled
- `CORS_ALLOWED_ORIGINS` includes `http://localhost:3000`

### Authentication Issues
- Check that the backend is running
- Verify token is being stored in localStorage
- Check browser console for API errors

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 16+)
- Delete `package-lock.json` and reinstall if dependency conflicts occur

### Port Already in Use
If port 3000 is already in use:
```bash
# Set PORT environment variable
PORT=3001 npm start
```

## Production Build

To create a production build:

```bash
npm run build
```

The build output will be in the `build/` directory. You can serve it with:
- Any static file server (nginx, Apache)
- Integrate with Django backend
- Deploy to platforms like Vercel, Netlify, etc.

## Development Notes

- The app uses Create React App's proxy feature to avoid CORS issues during development
- Hot reload is enabled by default
- All environment variables should start with `REACT_APP_` prefix

## Contributing

1. Follow the existing code structure
2. Use Material-UI components for consistency
3. Implement proper error handling
4. Add loading states for async operations

## License

Same as the main project.
