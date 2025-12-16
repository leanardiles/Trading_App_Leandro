# Quick Start Guide

## Complete Setup Instructions

### Backend Setup (Django)

1. **Navigate to backend directory**
   ```bash
   cd backend_django/trading_back
   ```

2. **Activate virtual environment**
   ```bash
   # On macOS/Linux:
   source ../venv/bin/activate
   
   # On Windows:
   # ..\venv\Scripts\activate
   ```

3. **Install dependencies (if not already done)**
   ```bash
   pip install -r ../requirements.txt
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Start Django server**
   ```bash
   python manage.py runserver
   ```
   
   Backend will be available at `http://localhost:8000`

### Frontend Setup (React)

1. **Open a new terminal and navigate to frontend**
   ```bash
   cd frontend_react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start React development server**
   ```bash
   npm start
   ```
   
   Frontend will automatically open at `http://localhost:3000`

### First Steps

1. **Register a new account**
   - Go to http://localhost:3000
   - Click "Sign Up"
   - Fill in the registration form

2. **Login**
   - Use your registered credentials to login

3. **Make a deposit**
   - Go to Transactions page
   - Click "New Transaction"
   - Select "Deposit" type
   - Enter amount and description

4. **Try Hermes AI Trading Bot** **[NEW]**
   - Go to "Hermes Agent" tab in navigation
   - Click "Create Bot" tab
   - Enter investment amount (minimum $100)
   - Select risk level (LOW, MEDIUM, or HIGH)
   - Set duration in weeks
   - Click "Create Hermes_trades Bot"
   - View your bots in "My Bots" tab

5. **Buy/Sell Stocks**
   - Go to Trading page
   - Enter stock symbol (e.g., "AAPL")
   - Click "Get Current Price" to fetch real-time price
   - View historical price chart
   - Enter quantity and buy/sell

6. **View Holdings**
   - Go to Holdings page
   - See all your stock positions
   - Prices auto-refresh every 30 seconds
   - View profit/loss for each holding

7. **Try ML Strategies**
   - Go to ML Strategies page
   - Try the different strategy tabs:
     - Pivot Point Analysis
     - Next-Day Prediction
     - Stock Screener
     - Index Rebalancing

8. **View Performance**
   - Go to Performance page
   - View portfolio performance charts
   - Toggle between "Complete Portfolio" and "Individual Stock"
   - Select different time periods (1D, 1W, 1M, 3M, 1Y, 5Y)

9. **Check Trading Signals**
   - Go to Signals page (bell icon in navigation)
   - View trading alerts and recommendations
   - Filter by type (All, Unread, Buy, Sell, Watch)
   - Click "Buy Now" to trade directly from signals

### Testing Hermes Bot with Backtest

1. **Run backtest from command line**
   ```bash
   cd backend_django/trading_back
   source ../venv/bin/activate
   python manage.py backtest_hermes --risk-level MEDIUM --investment 1000
   ```

2. **View backtest results**
   - The backtest will show:
     - Initial vs final capital
     - Total return and ROI
     - Number of trades
     - Win rate
     - Individual trade details

3. **Check bot status in frontend**
   - Go to Hermes Agent page
   - Click "My Bots" tab
   - View updated performance metrics

### Troubleshooting

#### Backend Issues

- **Module not found errors**: Make sure virtual environment is activated and dependencies are installed
  ```bash
  pip install -r requirements.txt
  ```

- **Migration errors**: Run migrations again
  ```bash
  python manage.py makemigrations
  python manage.py migrate
  ```

- **Port already in use**: Change the port
  ```bash
  python manage.py runserver 8001
  ```

- **yfinance errors**: Make sure yfinance is installed
  ```bash
  pip install yfinance
  ```

#### Frontend Issues

- **npm install fails**: Clear cache and try again
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

- **CORS errors**: Make sure Django backend is running and CORS is configured in `settings.py`

- **API connection errors**: Check that backend is running on `http://localhost:8000`

### Project Structure

```
Trading_App_Leandro/
├── backend_django/          # Django backend
│   ├── trading_back/        # Django project
│   │   ├── trading_app/     # Main app
│   │   │   ├── models.py     # Database models
│   │   │   ├── herm_trades.py  # Hermes bot API
│   │   │   ├── backtest_hermes_bot.py  # Backtesting
│   │   │   └── ml_models/   # ML strategies
│   │   └── manage.py
│   └── requirements.txt
├── frontend_react/          # React frontend
│   └── src/
│       ├── pages/
│       │   └── HermesAgent.jsx  # Bot management
│       └── services/
│           └── api.js       # API client
└── README.md
```

### Key Features

✅ **User Management**: Registration, login, profile management  
✅ **Portfolio Tracking**: View holdings, transactions, and performance  
✅ **Transaction Management**: Create deposits, withdrawals, trades  
✅ **Hermes AI Trading Bot**: Create and manage automated trading bots **[NEW]**  
✅ **Backtesting System**: Test bot strategies on historical data **[NEW]**  
✅ **ML Trading Strategies**: 
   - Pivot Point Analysis
   - Next-Day Price Prediction
   - Stock Screener
   - Index Rebalancing Strategy  
✅ **Performance Analytics**: Track portfolio performance metrics  
✅ **Trading Signals**: Receive and manage trading alerts  
✅ **Real-Time Prices**: Automatic price updates from Yahoo Finance

### API Endpoints

All API endpoints are documented in `trading_back/API_ENDPOINTS.md`

Main endpoints:
- `/api/users/` - User management
- `/api/transactions/` - Transaction operations
- `/api/holdings/` - Holdings management
- `/api/portfolio/` - Portfolio analytics
- `/api/trading/` - Buy/sell stocks
- `/api/herm/` - Hermes bot management **[NEW]**
- `/api/ml/` - ML strategy endpoints
- `/api/signals/` - Trading signals

### Hermes Bot Quick Reference

**Create Bot:**
- Minimum investment: $100
- Risk levels: LOW (2% monthly), MEDIUM (5% monthly), HIGH (10% monthly)
- Duration: Custom (in weeks)
- Strategies: All ML strategies enabled by default

**View Performance:**
- ROI percentage
- Total trades and win rate
- Current value vs initial investment
- Profit/Loss tracking

**Backtest:**
```bash
python manage.py backtest_hermes --risk-level MEDIUM --investment 1000
```

### Need Help?

- Check the main [README.md](../README.md) for detailed documentation
- Review [backend README.md](README.md) for backend-specific info
- Review [frontend README.md](../frontend_react/README.md) for frontend-specific info
- See [Backtest README.md](trading_back/BACKTEST_README.md) for backtesting guide
- Check Django backend logs for API errors
- Check browser console for frontend errors
