# Index Rebalancing Trading Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Django](https://img.shields.io/badge/django-4.2-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/react-18-blue.svg)](https://reactjs.org/)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()

## 📊 Overview

A full-stack trading simulation platform with **real-time market data integration**, portfolio management, **trading signals**, **AI-powered automated trading bots**, and ML-powered trading strategies. Built with Django REST Framework (backend) and React (frontend), this platform provides a realistic trading experience with automatic price updates, comprehensive performance tracking, intelligent buy/sell signals, and fully automated trading bots.

---

## ✨ Key Features

### 🎯 Core Trading Functionality
- **Real-Time Stock Prices** - Integration with Yahoo Finance API for live market data
- **Automatic Price Updates** - Holdings refresh every 30 seconds with current market prices
- **Interactive Price Charts** - Historical price visualization with multiple time periods (1D, 1W, 1M, 3M, 1Y, 5Y)
- **Smart Buy/Sell Interface** - Auto-fetch current prices before trading
- **Portfolio Management** - Track holdings, calculate P/L, monitor performance
- **Realized P/L Tracking** - Track actual profits/losses from closed positions

### 🤖 Hermes AI Trading Bot **[NEW - Dec 2025]**
- **Automated Trading Bots** - Create AI-powered trading bots with customizable risk profiles
- **Multi-Strategy Integration** - Combines Pivot Point, Next-Day Prediction, Stock Screener, and Index Rebalancing
- **Risk-Based Configuration** - LOW, MEDIUM, and HIGH risk profiles with different return expectations
- **Automatic Position Management** - Stop loss, take profit, and position sizing based on risk level
- **Performance Tracking** - Real-time ROI, win rate, and trade statistics
- **Backtesting System** - Test bot strategies on historical data before live trading
- **Bot Management Dashboard** - Create, monitor, and manage multiple trading bots

### 🔔 Trading Signals
- **Index Addition Alerts** - Get notified when stocks enter NASDAQ 100 or S&P 500
- **Action Recommendations** - Buy, Sell, Watch, or Hold signals
- **Unread Badge Notifications** - Visual alerts in navigation menu
- **Signal Filtering** - Filter by All, Unread, Buy, Sell, Watch
- **Quick Trade Actions** - Buy directly from signal cards
- **Signal Management** - Mark as read or dismiss signals

### 📈 Performance Tracking
- **Historical Performance Charts** - Track portfolio value from purchase date forward
- **Individual Stock Analysis** - View performance of specific stocks
- **Automatic Snapshots** - System saves portfolio state every 30 seconds
- **Multiple Time Periods** - Analyze performance across different timeframes
- **Best/Worst Performers** - Identify top and bottom performing stocks
- **Unrealized vs Realized P/L** - Separate tracking for open and closed positions

### 🧠 ML Trading Strategies
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

## 🚀 Quick Start

### Backend Setup
```bash
cd backend_django
source venv/bin/activate  # or venv\Scripts\activate on Windows
cd trading_back
pip install -r ../requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend_react
npm install
npm start
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/

---

## 📚 Documentation

- **[Backend README](backend_django/README.md)** - Complete backend documentation
- **[Frontend README](frontend_react/README.md)** - Frontend setup and features
- **[Backtest Documentation](backend_django/trading_back/BACKTEST_README.md)** - Hermes Bot backtesting guide
- **[API Endpoints](backend_django/trading_back/API_ENDPOINTS.md)** - Complete API reference

---

## 🧪 Testing Hermes AI Bot

### Run Backtest
```bash
cd backend_django/trading_back
source ../venv/bin/activate
python manage.py backtest_hermes --risk-level MEDIUM --investment 1000
```

### Backtest Options
- `--bot-id` - Backtest existing bot
- `--risk-level` - LOW, MEDIUM, or HIGH
- `--investment` - Investment amount in dollars

See [Backtest README](backend_django/trading_back/BACKTEST_README.md) for detailed documentation.

---

## 📊 Recent Updates

**December 2025:**
- ✅ **Hermes AI Trading Bot** - Automated trading with multi-strategy ML integration
- ✅ **Backtesting System** - Test strategies on historical data
- ✅ **Risk-Based Bot Configuration** - LOW/MEDIUM/HIGH risk profiles
- ✅ **Bot Management Dashboard** - Create and monitor trading bots
- ✅ Trading Signals System with notifications
- ✅ Realized P/L tracking for closed positions
- ✅ Dashboard redesign with comprehensive metrics
- ✅ Improved navigation with better icons

---

## 🏗️ Project Structure

```
Trading_App_Leandro/
├── backend_django/          # Django REST API backend
│   ├── trading_back/        # Django project
│   │   ├── trading_app/     # Main application
│   │   │   ├── models.py    # Database models
│   │   │   ├── views.py     # API endpoints
│   │   │   ├── herm_trades.py  # Hermes bot API
│   │   │   ├── backtest_hermes_bot.py  # Backtesting engine
│   │   │   └── ml_models/   # ML strategies
│   │   └── manage.py
│   └── requirements.txt
├── frontend_react/          # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   └── HermesAgent.jsx  # Bot management UI
│   │   └── services/
│   │       └── api.js       # API client
│   └── package.json
└── README.md
```

---

## 🔌 Key API Endpoints

### Hermes Bot Endpoints
- `POST /api/herm/create/` - Create new trading bot
- `GET /api/herm/list/` - List all user's bots
- `GET /api/herm/<bot_id>/status/` - Get bot performance

### Trading Endpoints
- `POST /api/trading/buy/` - Buy stock
- `POST /api/trading/sell/` - Sell stock
- `POST /api/trading/get_stock_price/` - Get real-time price

### ML Strategy Endpoints
- `POST /api/ml/pivot/` - Pivot point analysis
- `POST /api/ml/predict/` - Next-day prediction
- `POST /api/ml/screener/` - Stock screener
- `POST /api/ml/index-event/` - Index rebalancing

See [API_ENDPOINTS.md](backend_django/trading_back/API_ENDPOINTS.md) for complete API documentation.

---

## 🎯 Hermes Bot Risk Profiles

### LOW Risk
- Expected Return: 2% per month
- Stop Loss: 5%
- Take Profit: 10%
- Max Position: 20% of capital
- Best for: Conservative investors

### MEDIUM Risk
- Expected Return: 5% per month
- Stop Loss: 8%
- Take Profit: 15%
- Max Position: 30% of capital
- Best for: Balanced approach

### HIGH Risk
- Expected Return: 10% per month
- Stop Loss: 15%
- Take Profit: 25%
- Max Position: 40% of capital
- Best for: Aggressive traders

---

## 🛠️ Technologies

### Backend
- Django 4.2
- Django REST Framework
- SQLite (development) / PostgreSQL (production)
- yfinance (stock data)
- pandas, numpy, scikit-learn (ML)

### Frontend
- React 18
- Material-UI (MUI)
- Recharts (charts)
- Axios (HTTP client)
- React Router

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Support

- **GitHub Issues**: [Create an issue](https://github.com/leanardiles/Trading_App_Leandro/issues)
- **Documentation**: See README files in each directory
- **API Docs**: [API_ENDPOINTS.md](backend_django/trading_back/API_ENDPOINTS.md)

---

## 🔮 Future Enhancements

- [ ] Real-time bot execution (currently backtest only)
- [ ] Paper trading mode
- [ ] Advanced charting with technical indicators
- [ ] Email notifications for bot events
- [ ] Mobile app (React Native)
- [ ] Social trading features
- [ ] Options trading simulation
- [ ] Multi-currency support

---

**GitHub:** https://github.com/leanardiles/Trading_App_Leandro
