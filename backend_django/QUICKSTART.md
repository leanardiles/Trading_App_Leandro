# Quick Start Guide

## Complete Setup Instructions

### Backend Setup (Django)

1. **Navigate to backend directory**
   ```bash
   cd trading_back
   ```

2. **Activate virtual environment**
   ```bash
   # On macOS/Linux:
   source ../venv/bin/activate
   
   # On Windows:
   # ..\venv\Scripts\activate
   ```

3. **Run migrations**
   ```bash
   python manage.py migrate
   ```

4. **Start Django server**
   ```bash
   python manage.py runserver
   ```
   
   Backend will be available at `http://localhost:8000`

### Frontend Setup (React)

1. **Open a new terminal and navigate to frontend**
   ```bash
   cd frontend
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

4. **Add a holding**
   - Go to Holdings page
   - Click "Add Holding"
   - Enter stock symbol, quantity, buying price, and current price

5. **Try ML Strategies**
   - Go to ML Strategies page
   - Try the different strategy tabs:
     - Pivot Point Analysis
     - Next-Day Prediction
     - Stock Screener
     - Index Rebalancing

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
index_rebalancing_trading_platiform_backend/
├── trading_back/          # Django backend
│   ├── trading_app/      # Main app
│   └── trading_back/     # Django settings
├── frontend/             # React frontend
│   └── src/             # React source code
├── requirements.txt      # Python dependencies
└── README.md            # Main documentation
```

### Key Features

✅ **User Management**: Registration, login, profile management
✅ **Portfolio Tracking**: View holdings, transactions, and performance
✅ **Transaction Management**: Create deposits, withdrawals, trades
✅ **ML Trading Strategies**: 
   - Pivot Point Analysis
   - Next-Day Price Prediction
   - Stock Screener
   - Index Rebalancing Strategy
✅ **Performance Analytics**: Track portfolio performance metrics

### API Endpoints

All API endpoints are documented in `trading_back/API_ENDPOINTS.md`

Main endpoints:
- `/api/users/` - User management
- `/api/transactions/` - Transaction operations
- `/api/holdings/` - Holdings management
- `/api/portfolio/` - Portfolio analytics
- `/api/ml/` - ML strategy endpoints

### Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review [frontend/README.md](frontend/README.md) for frontend-specific info
- Check Django backend logs for API errors
- Check browser console for frontend errors

