# Index Rebalancing Trading Platform Backend

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Django](https://img.shields.io/badge/django-4.2-green.svg)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/DRF-3.14+-orange.svg)](https://www.django-rest-framework.org/)
[![Status](https://img.shields.io/badge/status-active--development-orange.svg)]()

## 📊 Overview

A Django REST API backend for a comprehensive stock trading platform focused on index rebalancing strategies. This application provides user management, transaction tracking, portfolio management, trading functionality, **AI-powered automated trading bots**, and **backtesting capabilities** designed for algorithmic trading systems.

## 🏗️ Project Architecture

| Directory | Purpose |
|-----------|---------|
| **📁 Root Level** | |
| `requirements.txt` | Python dependencies |
| `README.md` | Project documentation |
| **⚙️ trading_back/** | Django project configuration |
| `├─ settings.py` | Core Django settings |
| `├─ urls.py` | Root URL routing |
| `├─ wsgi.py` | Production server config |
| `├─ asgi.py` | Async server config |
| `└─ db.sqlite3` | SQLite database |
| **📱 trading_app/** | Main Django application |
| `├─ models.py` | Database models (User, Transaction, Holding, AutoTradingBot, Signal) |
| `├─ views.py` | API endpoint handlers |
| `├─ serializers.py` | Request/response validation |
| `├─ herm_trades.py` | Hermes AI bot API endpoints |
| `├─ backtest_hermes_bot.py` | Backtesting engine |
| `├─ auto_trading_engine.py` | Risk configuration engine |
| `├─ urls.py` | App URL routing |
| `├─ ml_models/` | ML strategy implementations |
| `└─ migrations/` | Database migration files |

## 🚀 Features

### Core Functionality

#### 1. **User Management**
- Custom user model with balance tracking
- User registration and authentication
- Token-based API authentication
- Profile management
- Realized profit/loss tracking

#### 2. **Transaction Management**
- Complete transaction history tracking
- Support for deposits, withdrawals, buy/sell orders
- Automatic balance updates
- Transaction filtering and summaries

#### 3. **Portfolio Management**
- Stock holdings tracking
- Real-time profit/loss calculations
- Portfolio performance analytics
- Holding summaries and filtering
- Automatic price refresh (every 30 seconds)
- Portfolio snapshots for historical tracking

#### 4. **Trading Signals**
- Index addition/removal alerts
- Buy/Sell/Hold/Watch recommendations
- Signal filtering and management
- Unread notification tracking

#### 5. **Hermes AI Trading Bot** **[NEW]**
- Automated trading bot creation
- Multi-strategy ML integration:
  - Pivot Point Analysis
  - Next-Day Price Prediction
  - Stock Screener
  - Index Rebalancing
- Risk-based configuration (LOW/MEDIUM/HIGH)
- Automatic stop loss and take profit
- Position sizing based on risk level
- Performance tracking (ROI, win rate, P/L)
- Backtesting system for strategy validation

#### 6. **ML Trading Strategies**
- Pivot Point Analysis
- Next-Day Price Prediction
- Stock Screener for Index Addition
- Index Rebalancing Strategy

#### 7. **Backtesting System** **[NEW]**
- 1-week historical backtesting
- Real stock data using yfinance
- Performance metrics calculation
- Trade logging and analysis
- Risk management validation

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8000/api/
```

### Authentication
The API uses token-based authentication. Include the token in the Authorization header:
```
Authorization: Token <your_token_here>
```

### Hermes Bot Endpoints **[NEW]**
- `POST /api/herm/create/` - Create new Hermes trading bot
  ```json
  {
    "investment_amount": 1000,
    "risk_level": "MEDIUM",
    "duration_weeks": 4
  }
  ```
- `GET /api/herm/list/` - List all user's bots
- `GET /api/herm/<bot_id>/status/` - Get bot performance metrics

### User Endpoints
- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login
- `POST /api/users/logout/` - User logout
- `GET /api/users/profile/` - Get user profile
- `PUT/PATCH /api/users/update_profile/` - Update profile

### Transaction Endpoints
- `GET /api/transactions/` - List transactions
- `POST /api/transactions/` - Create transaction
- `GET /api/transactions/by_type/?type=deposit` - Filter by type
- `GET /api/transactions/recent/` - Get recent transactions
- `GET /api/transactions/summary/` - Transaction summary

### Holding Endpoints
- `GET /api/holdings/` - List holdings
- `POST /api/holdings/` - Create holding
- `GET /api/holdings/by_stock/?stock=AAPL` - Filter by stock
- `GET /api/holdings/profitable/` - Get profitable holdings
- `GET /api/holdings/losing/` - Get losing holdings
- `GET /api/holdings/summary/` - Holdings summary
- `POST /api/holdings/refresh_prices/` - Refresh all holding prices

### Trading Endpoints
- `POST /api/trading/buy/` - Buy stock
- `POST /api/trading/sell/` - Sell stock
- `POST /api/trading/get_stock_price/` - Get real-time stock price with historical data

### Portfolio Endpoints
- `GET /api/portfolio/summary/` - Complete portfolio overview
- `GET /api/portfolio/performance/` - Performance metrics
- `POST /api/portfolio-snapshots/save_snapshot/` - Save portfolio snapshot
- `GET /api/portfolio-snapshots/portfolio_history/` - Get portfolio history
- `GET /api/portfolio-snapshots/stock_history/` - Get stock history

### Signal Endpoints
- `GET /api/signals/` - List all signals
- `GET /api/signals/active/` - Get active signals
- `GET /api/signals/unread_count/` - Get unread count
- `POST /api/signals/<id>/mark_read/` - Mark signal as read
- `POST /api/signals/<id>/dismiss/` - Dismiss signal

### ML Strategy Endpoints
- `POST /api/ml/pivot/` - Pivot point analysis
- `POST /api/ml/predict/` - Next-day price prediction
- `POST /api/ml/screener/` - Stock screener
- `POST /api/ml/index-event/` - Index rebalancing analysis

For detailed API documentation, see [API_ENDPOINTS.md](trading_back/API_ENDPOINTS.md)

---

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend_django
   ```

2. **Create and activate virtual environment**
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # On macOS/Linux:
   source venv/bin/activate
   # On Windows:
   # venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up the database**
   ```bash
   cd trading_back
   python manage.py migrate
   ```

5. **Create a superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/api/`

### Database Access
- **Admin Interface**: `http://localhost:8000/admin/`
- **Database File**: `trading_back/db.sqlite3`

---

## 🧪 Backtesting Hermes Bot

### Run Backtest
```bash
cd trading_back
source ../venv/bin/activate
python manage.py backtest_hermes
```

### Backtest Options
```bash
# Test with specific risk level
python manage.py backtest_hermes --risk-level HIGH --investment 5000

# Backtest existing bot
python manage.py backtest_hermes --bot-id 1

# Default: MEDIUM risk, $1000 investment
python manage.py backtest_hermes
```

### Programmatic Usage
```python
from trading_app.backtest_hermes_bot import run_backtest_for_bot

results = run_backtest_for_bot(
    bot_id=None,
    risk_level='MEDIUM',
    investment_amount=1000
)
```

See [BACKTEST_README.md](trading_back/BACKTEST_README.md) for detailed backtesting documentation.

---

## 📚 Database Models

### User Model
- Custom user model extending Django's AbstractUser
- Fields: balance, realized_profit_loss, name, email, userid
- Email-based authentication

### Transaction Model
- Tracks all financial transactions
- Types: deposit, withdrawal, buy, sell, dividend, fee
- Automatic balance updates

### Holding Model
- Tracks user's stock holdings
- Calculates profit/loss automatically
- Unique constraint per user-stock pair

### AutoTradingBot Model **[NEW]**
- Bot configuration and status
- Risk level, duration, capital tracking
- Performance metrics (ROI, win rate, trades)
- ML strategy flags (pivot, prediction, screener, index_rebalancing)

### Signal Model
- Trading signals for users
- Types: index_addition, index_removal, price_target, volume_spike
- Actions: buy, sell, hold, watch

### PortfolioSnapshot Model
- Historical portfolio value tracking
- Used for performance charts

### StockSnapshot Model
- Individual stock performance tracking
- Historical price and value data

---

## 🎯 Hermes Bot Risk Configuration

### LOW Risk
- Expected Monthly Return: 2%
- Stop Loss: 5%
- Take Profit: 10%
- Max Position Size: 20%
- Watchlist: AAPL, MSFT, GOOGL, AMZN, TSLA, META, NVDA, JPM, V, JNJ

### MEDIUM Risk
- Expected Monthly Return: 5%
- Stop Loss: 8%
- Take Profit: 15%
- Max Position Size: 30%
- Watchlist: AAPL, MSFT, GOOGL, AMZN, TSLA, META, NVDA, AMD, NFLX, DIS

### HIGH Risk
- Expected Monthly Return: 10%
- Stop Loss: 15%
- Take Profit: 25%
- Max Position Size: 40%
- Watchlist: TSLA, NVDA, AMD, META, NFLX, PLTR, RIVN, LCID, SOFI, HOOD

---

## 📝 Usage Examples

### 1. Create Hermes Trading Bot
```bash
curl -X POST http://localhost:8000/api/herm/create/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token <your_token>" \
  -d '{
    "investment_amount": 1000,
    "risk_level": "MEDIUM",
    "duration_weeks": 4
  }'
```

### 2. Get Bot Status
```bash
curl -X GET http://localhost:8000/api/herm/1/status/ \
  -H "Authorization: Token <your_token>"
```

### 3. List All Bots
```bash
curl -X GET http://localhost:8000/api/herm/list/ \
  -H "Authorization: Token <your_token>"
```

### 4. Buy Stock
```bash
curl -X POST http://localhost:8000/api/trading/buy/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token <your_token>" \
  -d '{
    "stock": "AAPL",
    "quantity": 10,
    "price": 150.00
  }'
```

### 5. Get Real-Time Stock Price
```bash
curl -X POST http://localhost:8000/api/trading/get_stock_price/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token <your_token>" \
  -d '{
    "stock": "AAPL"
  }'
```

---

## 🧪 Testing

### Run Django Tests
```bash
cd trading_back
python manage.py test
```

### Run Backtest
```bash
python manage.py backtest_hermes --risk-level MEDIUM
```

---

## 🔧 Configuration

### Environment Variables
The project uses Django's default settings. For production, consider setting:
- `DEBUG=False`
- `SECRET_KEY` (generate a new one)
- `ALLOWED_HOSTS` (add your domain)
- Database configuration (PostgreSQL recommended for production)

### Database
- **Development**: SQLite (included)
- **Production**: PostgreSQL or MySQL recommended

### Dependencies
Key packages:
- Django 4.2.0
- djangorestframework 3.14.0
- django-cors-headers 4.0.0
- pandas 2.0.0
- numpy 1.24.0
- scikit-learn 1.2.2
- yfinance 0.2.66 (for stock data)
- xgboost 1.7.5

---

## 📊 Recent Updates

**December 2025:**
- ✅ Hermes AI Trading Bot system
- ✅ Backtesting engine with historical data
- ✅ Risk-based bot configuration
- ✅ Multi-strategy ML integration
- ✅ Real-time stock price integration (yfinance)
- ✅ Trading signals system
- ✅ Portfolio performance tracking
- ✅ Realized P/L tracking

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the [API documentation](trading_back/API_ENDPOINTS.md)
- Review [Backtest documentation](trading_back/BACKTEST_README.md)
- Review Django and DRF documentation

---

## 🔮 Future Enhancements

- [ ] Real-time bot execution (currently backtest only)
- [ ] Scheduled bot runs (Celery)
- [ ] Advanced backtesting (walk-forward, Monte Carlo)
- [ ] Email notifications for bot events
- [ ] WebSocket support for real-time updates
- [ ] Advanced analytics and reporting
- [ ] Paper trading mode
- [ ] Multi-currency support
