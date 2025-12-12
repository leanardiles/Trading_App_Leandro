# Index Rebalancing Trading Platform Backend

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Django](https://img.shields.io/badge/django-5.2+-green.svg)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/DRF-3.16+-orange.svg)](https://www.django-rest-framework.org/)
[![Status](https://img.shields.io/badge/status-active--development-orange.svg)]()

## 📊 Overview

A Django REST API backend for a comprehensive stock trading platform focused on index rebalancing strategies. This application provides user management, transaction tracking, portfolio management, and trading functionality designed for algorithmic trading systems.

## 🏗️ Project Architecture

| Directory | Purpose |
|-----------|---------|
| **📁 Root Level** | |
| `manage.py` | Django CLI utility |
| `requirements.txt` | Python dependencies |
| `README.md` | Project documentation |
| **⚙️ trading_back/** | Django project configuration |
| `├─ settings.py` | Core Django settings |
| `├─ urls.py` | Root URL routing |
| `├─ wsgi.py` | Production server config |
| `├─ asgi.py` | Async server config |
| `└─ db.sqlite3` | SQLite database |
| **📱 trading_app/** | Main Django application |
| `├─ models.py` | Database models (User, Transaction, Holding) |
| `├─ views.py` | API endpoint handlers |
| `├─ serializers.py` | Request/response validation |
| `├─ urls.py` | App URL routing |
| `├─ admin.py` | Django admin configuration |
| `├─ apps.py` | App configuration |
| `└─ migrations/` | Database migration files |

## 🚀 Features

### Core Functionality

#### 1. **User Management**
- Custom user model with balance tracking
- User registration and authentication
- Token-based API authentication
- Profile management

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

#### 4. **API Features**
- RESTful API design
- Comprehensive CRUD operations
- Advanced filtering and pagination
- Detailed API documentation

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

#### User Endpoints
- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login
- `POST /api/users/logout/` - User logout
- `GET /api/users/profile/` - Get user profile
- `PUT/PATCH /api/users/update_profile/` - Update profile

#### Transaction Endpoints
- `GET /api/transactions/` - List transactions
- `POST /api/transactions/` - Create transaction
- `GET /api/transactions/by_type/?type=deposit` - Filter by type
- `GET /api/transactions/recent/` - Get recent transactions
- `GET /api/transactions/summary/` - Transaction summary

#### Holding Endpoints
- `GET /api/holdings/` - List holdings
- `POST /api/holdings/` - Create holding
- `GET /api/holdings/by_stock/?stock=AAPL` - Filter by stock
- `GET /api/holdings/profitable/` - Get profitable holdings
- `GET /api/holdings/losing/` - Get losing holdings
- `GET /api/holdings/summary/` - Holdings summary

#### Portfolio Endpoints
- `GET /api/portfolio/summary/` - Complete portfolio overview
- `GET /api/portfolio/performance/` - Performance metrics

For detailed API documentation, see [API_ENDPOINTS.md](trading_back/API_ENDPOINTS.md)

---

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd index_rebalancing_trading_platiform_backend
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

## 🎨 Frontend Setup (React.js)

The project includes a comprehensive React.js frontend dashboard.

### Prerequisites
- Node.js 16+ and npm/yarn
- Django backend running (see above)

### Frontend Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Access the frontend**
   The app will automatically open at `http://localhost:3000`

### Frontend Features

- ✅ User Authentication (Login/Register)
- ✅ Dashboard with portfolio overview
- ✅ Portfolio Management
- ✅ Transaction Management
- ✅ Holdings Management
- ✅ ML Trading Strategies Interface:
  - Pivot Point Analysis
  - Next-Day Price Prediction
  - Stock Screener
  - Index Rebalancing Analysis
- ✅ Performance Analytics

For detailed frontend documentation, see [frontend/README.md](frontend/README.md)

---

## 🚀 Running the Full Application

### Terminal 1: Django Backend
```bash
cd trading_back
python manage.py runserver
```

### Terminal 2: React Frontend
```bash
cd frontend
npm start
```

Access:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/

---

## 📝 Usage Examples

### 1. Register a new user
```bash
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "trader@example.com",
    "username": "trader",
    "name": "John Trader",
    "userid": "trader001",
    "password": "securepass123",
    "password_confirm": "securepass123"
  }'
```

### 2. Login and get token
```bash
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "trader@example.com",
    "password": "securepass123"
  }'
```

### 3. Make a deposit
```bash
curl -X POST http://localhost:8000/api/transactions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token <your_token>" \
  -d '{
    "transaction_type": "deposit",
    "debit": 0.00,
    "credit": 1000.00,
    "description": "Initial deposit"
  }'
```

### 4. Add a stock holding
```bash
curl -X POST http://localhost:8000/api/holdings/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token <your_token>" \
  -d '{
    "stock": "AAPL",
    "quantity": 10,
    "buying_price": 150.00,
    "current_price": 155.00
  }'
```

### 5. Get portfolio summary
```bash
curl -X GET http://localhost:8000/api/portfolio/summary/ \
  -H "Authorization: Token <your_token>"
```

---

## 🧪 Testing

Run the Django test suite:
```bash
cd trading_back
python manage.py test
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

---

## 📚 Models

### User Model
- Custom user model extending Django's AbstractUser
- Includes balance, name, email, and userid fields
- Email-based authentication

### Transaction Model
- Tracks all financial transactions
- Types: deposit, withdrawal, buy, sell, dividend, fee
- Automatic balance updates

### Holding Model
- Tracks user's stock holdings
- Calculates profit/loss automatically
- Unique constraint per user-stock pair

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
- Review Django and DRF documentation

---

## 🔮 Future Enhancements

- Real-time stock price integration
- Advanced trading algorithms
- Risk management features
- Mobile app integration
- WebSocket support for real-time updates
- Advanced analytics and reporting
