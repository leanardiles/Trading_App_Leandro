# Index Rebalancing Trading Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Django](https://img.shields.io/badge/django-4.2-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/react-18-blue.svg)](https://reactjs.org/)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()

## 📊 Overview

A full-stack trading simulation platform with **real-time market data integration**, portfolio management, and ML-powered trading strategies. Built with Django REST Framework (backend) and React (frontend), this platform provides a realistic trading experience with automatic price updates and comprehensive performance tracking.

---

## ✨ Key Features

### 🎯 Core Trading Functionality
- **Real-Time Stock Prices** - Integration with Yahoo Finance API for live market data
- **Automatic Price Updates** - Holdings refresh every 30 seconds with current market prices
- **Interactive Price Charts** - Historical price visualization with multiple time periods (1D, 1W, 1M, 3M, 1Y, 5Y)
- **Smart Buy/Sell Interface** - Auto-fetch current prices before trading
- **Portfolio Management** - Track holdings, calculate P/L, monitor performance

### 📈 Performance Tracking
- **Historical Performance Charts** - Track portfolio value from purchase date forward
- **Individual Stock Analysis** - View performance of specific stocks
- **Automatic Snapshots** - System saves portfolio state every 30 seconds
- **Multiple Time Periods** - Analyze performance across different timeframes
- **Best/Worst Performers** - Identify top and bottom performing stocks

### 🤖 ML Trading Strategies
- **Pivot Point Analysis** - Technical analysis for support/resistance levels
- **Next-Day Price Prediction** - ML-based price movement forecasting
- **Stock Screener** - Analyze stocks for index addition eligibility
- **Index Rebalancing Analysis** - Track index reconstitution events

### 👤 User Management
- **Custom User Authentication** - Token-based secure authentication
- **Account Balance Tracking** - Real-time balance updates
- **Transaction History** - Complete audit trail of all activities
- **Profile Management** - Update user information and preferences

---

## 🏗️ Project Structure

```
Trading_App_Leandro/
├── backend_django/
│   └── trading_back/
│       ├── trading_app/
│       │   ├── models.py              # Database models (User, Transaction, Holding, Snapshots)
│       │   ├── views.py               # API endpoints and business logic
│       │   ├── serializers.py         # Data validation and serialization
│       │   ├── urls.py                # API routing
│       │   ├── ml_models/             # Machine learning strategies
│       │   │   ├── pivot.py
│       │   │   ├── nextday_prediction.py
│       │   │   ├── stock_screener.py
│       │   │   └── index_rebalancing.py
│       │   └── migrations/            # Database migrations
│       ├── trading_back/              # Django project settings
│       │   ├── settings.py
│       │   ├── urls.py
│       │   └── wsgi.py
│       ├── manage.py
│       └── db.sqlite3
├── frontend_react/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx             # Main layout with navigation
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx        # Authentication state management
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx          # Portfolio overview
│   │   │   ├── Trading.jsx            # Buy/sell interface with charts
│   │   │   ├── Holdings.jsx           # Current holdings with auto-refresh
│   │   │   ├── Transactions.jsx       # Transaction history
│   │   │   ├── Performance.jsx        # Performance charts and analysis
│   │   │   ├── MLStrategies.jsx       # ML trading strategies
│   │   │   ├── Login.jsx              # User authentication
│   │   │   └── Register.jsx           # User registration
│   │   ├── services/
│   │   │   └── api.js                 # Axios API client
│   │   ├── utils/
│   │   │   └── format.js              # Formatting utilities
│   │   ├── App.jsx
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── README.md
├── venv/                               # Python virtual environment
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **npm or yarn**
- **Git**

### Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/leanardiles/Trading_App_Leandro.git
cd Trading_App_Leandro
```

#### 2️⃣ Backend Setup (Django)

```bash
# Create and activate virtual environment
python -m venv venv

# On Windows (Git Bash):
source venv/Scripts/activate

# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Or install manually:
pip install Django==4.2.0 djangorestframework==3.14.0 django-cors-headers==4.0.0 pandas==2.0.0 numpy==1.24.0 scikit-learn==1.2.2 xgboost==1.7.5 joblib==1.2.0 python-dotenv==1.0.0 yfinance

# Navigate to Django project
cd backend_django/trading_back

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

Backend will run at: **http://127.0.0.1:8000/**

#### 3️⃣ Frontend Setup (React)

Open a **new terminal**:

```bash
cd frontend_react

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will open at: **http://localhost:3000/**

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8000/api/
```

### Authentication
All protected endpoints require token authentication:
```
Authorization: Token <your_token_here>
```

### User Endpoints
- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login (returns token)
- `POST /api/users/logout/` - User logout
- `GET /api/users/profile/` - Get user profile
- `PUT/PATCH /api/users/update_profile/` - Update profile

### Trading Endpoints
- `POST /api/trading/buy/` - Buy stock
- `POST /api/trading/sell/` - Sell stock
- `POST /api/trading/get_stock_price/` - **[NEW]** Fetch real-time stock price with historical data

### Holdings Endpoints
- `GET /api/holdings/` - List all holdings
- `POST /api/holdings/` - Create holding
- `GET /api/holdings/by_stock/?stock=AAPL` - Filter by stock
- `GET /api/holdings/profitable/` - Get profitable holdings
- `GET /api/holdings/losing/` - Get losing holdings
- `GET /api/holdings/summary/` - Holdings summary
- `POST /api/holdings/refresh_prices/` - **[NEW]** Refresh current prices for all holdings

### Transaction Endpoints
- `GET /api/transactions/` - List transactions
- `POST /api/transactions/` - Create transaction
- `GET /api/transactions/by_type/?type=deposit` - Filter by type
- `GET /api/transactions/recent/` - Recent transactions
- `GET /api/transactions/summary/` - Transaction summary

### Portfolio Endpoints
- `GET /api/portfolio/summary/` - Complete portfolio overview
- `GET /api/portfolio/performance/` - Performance metrics

### Performance Tracking Endpoints **[NEW]**
- `POST /api/portfolio-snapshots/save_snapshot/` - Save current portfolio snapshot
- `GET /api/portfolio-snapshots/portfolio_history/?period=1M` - Get portfolio performance history
- `GET /api/portfolio-snapshots/stock_history/?stock=AAPL&period=1M` - Get individual stock history

### ML Strategy Endpoints
- `POST /api/ml/pivot/` - Pivot point analysis
- `POST /api/ml/predict/` - Next-day price prediction
- `POST /api/ml/screener/` - Stock screener analysis
- `POST /api/ml/index-event/` - Index rebalancing analysis

---

## 💡 How to Use

### 1. Register & Login
- Navigate to **http://localhost:3000**
- Click "Register" to create an account
- Login with your credentials
- You'll receive a balance to start trading

### 2. Make a Deposit
- Go to **Transactions** page
- Click "Add Transaction"
- Select "Deposit" and enter amount
- Your balance will be updated

### 3. Buy Stocks
- Go to **Trading** page
- Enter stock symbol (e.g., "AAPL", "GOOGL", "TSLA")
- Click **"Get Current Price"** to fetch real-time market price
- View historical price chart
- Enter quantity of shares
- Review total cost
- Click "Buy Stock"

### 4. Track Performance
- Go to **Holdings** page to see all your stocks
- Prices update automatically every 30 seconds
- View real-time profit/loss for each holding

### 5. Analyze Performance
- Go to **Performance** page
- Toggle between "Complete Portfolio" and "Individual Stock"
- Select time period (1D, 1W, 1M, 3M, 1Y, 5Y)
- View interactive performance charts
- See best/worst performing stocks

### 6. Sell Stocks
- Go to **Trading** → **Sell** tab
- Select stock from your holdings
- System shows current price
- Enter quantity to sell
- Proceeds are added to your balance

---

## 📚 Database Models

### User Model
- Custom user extending Django's AbstractUser
- Fields: email (username), name, balance, userid
- Email-based authentication

### Transaction Model
- Types: deposit, withdrawal, buy, sell, dividend, fee
- Tracks: amount, type, description, timestamp, balance_after
- Automatic balance updates

### Holding Model
- Tracks: stock symbol, quantity, buying_price, current_price
- Calculated properties: total_invested, current_value, profit_loss, profit_loss_percentage
- Unique constraint: one holding per user-stock pair

### PortfolioSnapshot Model **[NEW]**
- Tracks portfolio value over time
- Fields: user, timestamp, total_value, cash_balance, holdings_value
- Used for performance charts

### StockSnapshot Model **[NEW]**
- Tracks individual stock performance over time
- Fields: user, stock, timestamp, quantity, current_price, current_value
- Used for stock-specific performance analysis

---

## 🔧 Configuration

### Environment Variables
For production deployment, configure:
- `DEBUG=False`
- `SECRET_KEY` (generate a new secure key)
- `ALLOWED_HOSTS` (add your domain)
- Database configuration (PostgreSQL recommended)

### Database
- **Development:** SQLite (included)
- **Production:** PostgreSQL or MySQL recommended

### CORS Settings
Backend is configured to accept requests from `http://localhost:3000` by default.

To modify, edit `backend_django/trading_back/trading_back/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://your-domain.com",
]
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend_django/trading_back
python manage.py test
```

### Frontend Tests
```bash
cd frontend_react
npm test
```

---

## 🆕 Recent Improvements

### December 2025 Updates:
✅ **Real-Time Stock Prices** - Integrated Yahoo Finance API  
✅ **Interactive Charts** - Historical price visualization on Trading page  
✅ **Auto-Refresh Holdings** - Prices update every 30 seconds  
✅ **Performance Tracking** - Historical portfolio performance charts  
✅ **Stock Analysis** - Individual stock performance visualization  
✅ **Automatic Snapshots** - System saves portfolio state for historical tracking  

See [CHANGES_BY_LEANDRO.md](CHANGES_BY_LEANDRO.md) for detailed change log.

---

## 🛣️ Roadmap

### Planned Features:
- [ ] Price alerts and notifications
- [ ] Fractional share buying
- [ ] Advanced charting with technical indicators
- [ ] Stock news feed integration
- [ ] Watchlist functionality
- [ ] Portfolio export (PDF reports)
- [ ] Mobile responsive design improvements
- [ ] Dark mode theme
- [ ] Multi-currency support
- [ ] Social trading features

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit with clear messages (`git commit -m 'Add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines:
- Follow PEP 8 style guide for Python code
- Use ESLint configuration for JavaScript/React code
- Write tests for new features
- Update documentation for API changes
- Keep commits atomic and well-described

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support & Documentation

### Resources:
- **Backend API Docs:** Check `/api/` endpoint when server is running
- **Django Documentation:** https://docs.djangoproject.com/
- **Django REST Framework:** https://www.django-rest-framework.org/
- **React Documentation:** https://reactjs.org/
- **Material-UI:** https://mui.com/

### Common Issues:

**Port already in use?**
```bash
# Backend
python manage.py runserver 8001

# Frontend
PORT=3001 npm start
```

**CORS errors?**
- Verify `django-cors-headers` is installed
- Check `CORS_ALLOWED_ORIGINS` in settings.py

**Database errors?**
```bash
# Reset database
rm db.sqlite3
python manage.py migrate
```

**Node modules issues?**
```bash
cd frontend_react
rm -rf node_modules package-lock.json
npm install
```

---

## 👥 Team

**Project Lead:** Leandro Ardiles  
**GitHub:** https://github.com/leanardiles/Trading_App_Leandro

---

## 🙏 Acknowledgments

- Yahoo Finance for providing free stock market data via yfinance
- Material-UI for the beautiful React components
- Recharts for the interactive charting library
- Django and React communities for excellent documentation

---

## 📊 Tech Stack

### Backend:
- **Django 4.2** - Web framework
- **Django REST Framework 3.14** - API framework
- **yfinance** - Real-time stock data
- **pandas** - Data analysis
- **numpy** - Numerical computing
- **scikit-learn** - Machine learning
- **xgboost** - ML gradient boosting
- **SQLite** - Database (development)

### Frontend:
- **React 18** - UI library
- **Material-UI (MUI)** - Component library
- **Recharts** - Charting library
- **React Router** - Routing
- **Axios** - HTTP client
- **React Toastify** - Notifications

---

## 📞 Contact

For questions, suggestions, or collaboration:
- **GitHub Issues:** https://github.com/leanardiles/Trading_App_Leandro/issues
- **Email:** [Your email if you want to include it]

---

**Built with ❤️ for learning and simulating real trading experiences**

*Disclaimer: This is a simulation platform for educational purposes. Not financial advice. Always consult with a licensed financial advisor before making real investment decisions.*
