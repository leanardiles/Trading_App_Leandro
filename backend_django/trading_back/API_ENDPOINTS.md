# Trading Platform API Endpoints

## Base URL
```
http://localhost:8000/api/
```

## Authentication
The API uses token-based authentication. Include the token in the Authorization header:
```
Authorization: Token <your_token_here>
```

## User Endpoints

### User Registration
```
POST /api/users/register/
```
**Body:**
```json
{
    "email": "user@example.com",
    "username": "username",
    "name": "Full Name",
    "userid": "unique_id",
    "password": "password123",
    "password_confirm": "password123"
}
```

### User Login
```
POST /api/users/login/
```
**Body:**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

### User Logout
```
POST /api/users/logout/
```
**Headers:** Authorization token required

### Get User Profile
```
GET /api/users/profile/
```
**Headers:** Authorization token required

### Update User Profile
```
PUT/PATCH /api/users/update_profile/
```
**Headers:** Authorization token required

### User CRUD Operations
```
GET /api/users/                    # List users (staff only)
POST /api/users/                   # Create user (staff only)
GET /api/users/{id}/               # Get user details
PUT /api/users/{id}/               # Update user
PATCH /api/users/{id}/             # Partial update user
DELETE /api/users/{id}/            # Delete user (staff only)
```

## Transaction Endpoints

### Transaction CRUD Operations
```
GET /api/transactions/             # List user's transactions
POST /api/transactions/            # Create transaction
GET /api/transactions/{id}/        # Get transaction details
PUT /api/transactions/{id}/        # Update transaction
PATCH /api/transactions/{id}/      # Partial update transaction
DELETE /api/transactions/{id}/     # Delete transaction
```

### Transaction Filtering
```
GET /api/transactions/by_type/?type=deposit    # Filter by transaction type
GET /api/transactions/recent/                  # Get recent transactions (last 10)
GET /api/transactions/summary/                 # Get transaction summary
```

**Transaction Types:**
- `deposit` - Deposit money
- `withdrawal` - Withdraw money
- `buy` - Buy stock
- `sell` - Sell stock
- `dividend` - Dividend payment
- `fee` - Fee payment

## Holding Endpoints

### Holding CRUD Operations
```
GET /api/holdings/                 # List user's holdings
POST /api/holdings/                # Create holding
GET /api/holdings/{id}/            # Get holding details
PUT /api/holdings/{id}/            # Update holding
PATCH /api/holdings/{id}/          # Partial update holding
DELETE /api/holdings/{id}/         # Delete holding
```

### Holding Filtering
```
GET /api/holdings/by_stock/?stock=AAPL    # Filter by stock symbol
GET /api/holdings/profitable/             # Get only profitable holdings
GET /api/holdings/losing/                 # Get only losing holdings
GET /api/holdings/summary/                # Get holdings summary
```

## Portfolio Endpoints

### Portfolio Summary
```
GET /api/portfolio/summary/        # Complete portfolio overview
```
**Response includes:**
- Total balance
- Total invested amount
- Total current value
- Total profit/loss
- Profit/loss percentage
- Holdings count
- Transactions count

### Portfolio Performance
```
GET /api/portfolio/performance/    # Performance metrics
```
**Response includes:**
- Total return
- Best performing stock
- Worst performing stock
- All stock performances

## Example API Usage

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

### 2. Login
```bash
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "trader@example.com",
    "password": "securepass123"
  }'
```

### 3. Create a transaction (deposit)
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

### 4. Create a holding
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

## Response Format
All API responses follow this format:
```json
{
  "field1": "value1",
  "field2": "value2",
  ...
}
```

Error responses:
```json
{
  "field_name": ["Error message"],
  "non_field_errors": ["General error message"]
}
```

## Pagination
List endpoints support pagination:
- `?page=1` - Page number
- `?page_size=20` - Items per page (default: 20)

## Filtering and Search
- Use query parameters for filtering
- Most list endpoints support search functionality
- Date ranges can be filtered using Django's date filtering syntax
---

## ML Strategy Endpoints

### Pivot Point Analysis
POST /api/ml/pivot/
**Body:**
{
"high": 150.5,
"low": 145.2,
"close": 148.7
}
**Response:**
{
"signal": "HOLD_BULLISH",
"description": "Price $148.7 above pivot ($148.13)",
"current_price": 148.7,
"pivot_points": {
"pivot_point": 148.13,
"support_1": 145.77,
"resistance_1": 151.07
},
"strategy": "Pivot Point Analysis"
}

### Next-Day Price Prediction
POST /api/ml/predict/
**Body:**
{
"stock_symbol": "AAPL",
"open_price": 145.0,
"high": 150.0,
"low": 144.0,
"close": 148.0,
"volume": 1000000
}
**Response:**
{
"stock_symbol": "AAPL",
"prediction": "UP",
"confidence": 85,
"recommendation": "Expect price to move UP with 85% confidence"
}

### Stock Screener for Index Addition
POST /api/ml/screener/
**Body:**
{
"market_cap": 15000000000,
"volume": 1200000,
"sector": "Technology"
}
**Response:**
{
"recommendation": "STRONG_CANDIDATE",
"score": 80,
"reasons": [
"✓ Market cap meets S&P 500 threshold",
"✓ High trading volume",
"✓ In high-growth sector"
]
}

### Index Reconstitution Event Analysis
POST /api/ml/index-event/
**Body:**
{
"stock_symbol": "NVDA",
"event_type": "ADD",
"announcement_date": "2025-10-21",
"effective_date": "2025-10-30",
"current_price": 450.0,
"index_name": "SP500"
}
**Response:**
{
"stock_symbol": "NVDA",
"action": "BUY",
"rationale": "Just announced! Index funds must buy NVDA. Expected 5.0% gain.",
"target_price": 472.5,
"expected_return_pct": 5.0,
"position_size_pct": 5,
"risk_rating": "MEDIUM"
}
undefined
