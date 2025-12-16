# Trading Platform Frontend

React.js frontend dashboard for the Index Rebalancing Trading Platform.

Built with **Create React App**.

## Features

- **User Authentication**: Login and registration with token-based authentication
- **Dashboard**: Portfolio overview with key metrics and recent transactions
- **Portfolio Management**: Detailed portfolio view with holdings and performance
- **Transaction Management**: Create and track all financial transactions
- **Holdings Management**: Manage stock holdings with real-time P/L tracking
- **Hermes AI Trading Bot** **[NEW]**: Create and manage automated trading bots
- **ML Trading Strategies**: 
  - Pivot Point Analysis
  - Next-Day Price Prediction
  - Stock Screener for Index Addition
  - Index Rebalancing Strategy Analysis
- **Performance Analytics**: Track portfolio performance with detailed metrics
- **Trading Signals**: Receive and manage trading alerts

## Prerequisites

- Node.js 16+ and npm/yarn
- Django backend running on `http://localhost:8000`

## Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend_react
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
frontend_react/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/          # Reusable components
│   │   └── Layout.jsx       # Main layout with navigation
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx  # Authentication context
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx    # Portfolio overview
│   │   ├── Portfolio.jsx    # Detailed portfolio
│   │   ├── Transactions.jsx # Transaction history
│   │   ├── Holdings.jsx     # Stock holdings
│   │   ├── Trading.jsx      # Buy/sell stocks
│   │   ├── MLStrategies.jsx # ML strategy tools
│   │   ├── Performance.jsx  # Performance charts
│   │   ├── HermesAgent.jsx  # AI trading bot [NEW]
│   │   ├── Signals.jsx      # Trading signals
│   │   ├── Profile.jsx      # User profile
│   │   ├── Login.jsx        # Login page
│   │   └── Register.jsx     # Registration page
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
- Session persistence

### Dashboard
- Real-time portfolio metrics:
  - Total Balance (cash)
  - Current Value (holdings)
  - Unrealized P/L (open positions)
  - Realized P/L (closed positions)
- Recent transactions display
- Quick stats overview

### Hermes AI Trading Bot **[NEW]**
- **Create Bot Tab**:
  - Investment amount input
  - Risk level selector (LOW/MEDIUM/HIGH)
  - Duration in weeks
  - Risk profile information panel
- **My Bots Tab**:
  - List of all created bots
  - Performance metrics (ROI, win rate, P/L)
  - Status indicators (ACTIVE, PAUSED, STOPPED)
  - Trade statistics
- Real-time bot performance tracking
- Color-coded status and risk indicators

### Trading
- Buy/Sell interface with real-time price fetching
- Interactive price charts (1D, 1W, 1M, 3M, 1Y, 5Y)
- Historical price visualization
- Automatic price updates

### ML Strategies
1. **Pivot Point Analysis**: Calculate pivot points and generate trading signals
2. **Next-Day Prediction**: ML-based price movement prediction
3. **Stock Screener**: Screen stocks for index addition eligibility
4. **Index Rebalancing**: Analyze index reconstitution events with trading recommendations

### Portfolio & Performance
- Detailed holdings breakdown
- Profit/loss tracking (realized and unrealized)
- Performance rankings
- Best/worst performers
- Historical performance charts
- Individual stock analysis

### Trading Signals
- Index addition/removal alerts
- Buy/Sell/Hold/Watch recommendations
- Filter by type (All, Unread, Buy, Sell, Watch)
- Quick action buttons
- Unread badge notifications

## API Integration

All API calls are handled through the `api.js` service file. The service includes:
- Automatic token injection
- Error handling
- Request/response interceptors
- API methods for:
  - Authentication (`authAPI`)
  - Users (`userAPI`)
  - Transactions (`transactionAPI`)
  - Holdings (`holdingAPI`)
  - Portfolio (`portfolioAPI`)
  - Trading (`tradingAPI`)
  - ML Strategies (`mlAPI`)
  - Signals (`signalAPI`)
  - Hermes Bot (`hermAPI`) **[NEW]**

## Technologies Used

- **React 18** - UI library
- **Create React App** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **React Router** - Routing
- **Axios** - HTTP client
- **Recharts** - Chart library
- **React Toastify** - Notifications
- **http-proxy-middleware** - API proxy for development

## Hermes Bot Usage

### Creating a Bot
1. Navigate to "Hermes Agent" tab
2. Fill in investment amount (minimum $100)
3. Select risk level (LOW, MEDIUM, or HIGH)
4. Set duration in weeks
5. Click "Create Hermes_trades Bot"

### Viewing Bot Performance
1. Go to "My Bots" tab
2. View all created bots with:
   - Current value vs initial investment
   - Profit/Loss and ROI
   - Total trades and win rate
   - Status (ACTIVE, PAUSED, STOPPED, COMPLETED)

### Risk Profiles
- **LOW**: 2% monthly return, conservative stocks
- **MEDIUM**: 5% monthly return, balanced approach
- **HIGH**: 10% monthly return, aggressive growth stocks

## Troubleshooting

### CORS Errors
Make sure the Django backend has CORS configured correctly in `settings.py`:
- `corsheaders` middleware is enabled
- `CORS_ALLOWED_ORIGINS` includes `http://localhost:3000`

### Authentication Issues
- Check that the backend is running
- Verify token is being stored in localStorage
- Check browser console for API errors
- Clear localStorage and login again

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

### API Connection Errors
- Verify backend is running on `http://localhost:8000`
- Check `src/setupProxy.js` exists
- Verify API endpoints in `src/services/api.js`

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
- Material-UI theme is customized in `src/theme.js`

## Recent Updates

**December 2025:**
- ✅ Hermes AI Trading Bot interface
- ✅ Bot creation and management dashboard
- ✅ Real-time bot performance tracking
- ✅ Risk profile visualization
- ✅ Trading signals page
- ✅ Enhanced navigation with Hermes Agent tab
- ✅ Improved dashboard metrics
- ✅ Real-time price charts

## Contributing

1. Follow the existing code structure
2. Use Material-UI components for consistency
3. Implement proper error handling
4. Add loading states for async operations
5. Follow React best practices
6. Use the existing API service patterns

## License

Same as the main project.
