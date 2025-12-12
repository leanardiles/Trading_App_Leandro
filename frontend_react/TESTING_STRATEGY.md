# Trading Platform Testing Strategy

This document outlines a comprehensive testing strategy for the Index Rebalancing Trading Platform. Follow this guide to ensure all features work correctly before deployment.

## Table of Contents

1. [Pre-Testing Setup](#pre-testing-setup)
2. [User Account Testing](#user-account-testing)
3. [Transaction Testing](#transaction-testing)
4. [Trading Operations Testing](#trading-operations-testing)
5. [Portfolio Management Testing](#portfolio-management-testing)
6. [ML Strategies Testing](#ml-strategies-testing)
7. [Performance & Analytics Testing](#performance--analytics-testing)
8. [Error Handling & Edge Cases](#error-handling--edge-cases)
9. [Backend Verification](#backend-verification)
10. [Frontend Verification](#frontend-verification)

---

## Pre-Testing Setup

### Prerequisites
- [ ] Backend server running on `http://localhost:8000`
- [ ] Frontend server running on `http://localhost:3000`
- [ ] Database is clean (or use test data)
- [ ] Browser DevTools open (Console and Network tabs)

### Tools Needed
- Browser DevTools (Chrome/Firefox)
- Postman or curl (for direct API testing)
- Django admin access (`http://localhost:8000/admin/`)

---

## User Account Testing

### Test Case 1: User Registration

**Actions:**
1. Navigate to `/register`
2. Fill in all required fields:
   - Email: `test@example.com`
   - Username: `testuser`
   - Full Name: `Test User`
   - User ID: `test001`
   - Password: `testpass123`
   - Confirm Password: `testpass123`
3. Click "Sign Up"

**What to Check:**
- [ ] User is redirected to `/dashboard` after successful registration
- [ ] Token is stored in localStorage
- [ ] User data is stored in localStorage
- [ ] No console errors

**Backend Verification:**
- [ ] Check Django admin: `http://localhost:8000/admin/trading_app/user/`
- [ ] Verify user exists with correct email, username, name, userid
- [ ] Verify balance is `0.00`
- [ ] Check database: `SELECT * FROM trading_user WHERE email='test@example.com'`

**Why:** Ensures user registration flow works end-to-end and data is persisted correctly.

---

### Test Case 2: User Login

**Actions:**
1. Navigate to `/login`
2. Enter registered email and password
3. Click "Sign In"

**What to Check:**
- [ ] User is redirected to `/dashboard`
- [ ] Token is stored in localStorage
- [ ] User data is loaded correctly
- [ ] No console errors

**Backend Verification:**
- [ ] Check Django logs for successful authentication
- [ ] Verify token was created in `authtoken_token` table

**Why:** Verifies authentication mechanism works and tokens are generated correctly.

---

### Test Case 3: Invalid Login Attempts

**Actions:**
1. Try logging in with wrong password
2. Try logging in with non-existent email
3. Try logging in with empty fields

**What to Check:**
- [ ] Appropriate error messages are displayed
- [ ] User is NOT redirected to dashboard
- [ ] No token is stored
- [ ] Error messages are user-friendly

**Why:** Ensures security - invalid credentials should not grant access.

---

## Transaction Testing

### Test Case 4: Create Deposit

**Actions:**
1. Login as a user
2. Navigate to `/transactions`
3. Click "New Transaction"
4. Select "Deposit" as transaction type
5. Enter Credit Amount: `1000.00`
6. Enter Description: `Initial deposit`
7. Click "Create"

**What to Check:**
- [ ] Transaction appears in the transactions list
- [ ] User balance increases by $1000
- [ ] Transaction shows correct type, amount, and description
- [ ] Balance After field is correct
- [ ] Dashboard shows updated balance

**Backend Verification:**
- [ ] Check Django admin: `http://localhost:8000/admin/trading_app/transaction/`
- [ ] Verify transaction record exists with:
  - `transaction_type = 'deposit'`
  - `credit = 1000.00`
  - `debit = 0.00`
  - `balance_after = 1000.00`
- [ ] Verify user balance updated: `SELECT balance FROM trading_user WHERE email='test@example.com'`
- [ ] Check database: `SELECT * FROM trading_transaction WHERE transaction_type='deposit'`

**Why:** Deposits are fundamental - users need to add money before trading. Verify balance updates correctly.

---

### Test Case 5: Create Withdrawal

**Actions:**
1. Ensure user has balance > $0
2. Navigate to `/transactions`
3. Click "New Transaction"
4. Select "Withdrawal" as transaction type
5. Enter Debit Amount: `200.00`
6. Enter Description: `Cash withdrawal`
7. Click "Create"

**What to Check:**
- [ ] Transaction appears in the list
- [ ] User balance decreases by $200
- [ ] Transaction shows correct type and amount
- [ ] Balance After field is correct

**Backend Verification:**
- [ ] Verify transaction record with:
  - `transaction_type = 'withdrawal'`
  - `debit = 200.00`
  - `credit = 0.00`
  - `balance_after = (previous_balance - 200.00)`
- [ ] Verify user balance decreased correctly

**Why:** Withdrawals must reduce balance correctly and prevent negative balances.

---

### Test Case 6: Insufficient Balance Withdrawal

**Actions:**
1. Ensure user balance is less than withdrawal amount
2. Try to create withdrawal for more than available balance

**What to Check:**
- [ ] Error message: "Insufficient balance"
- [ ] Transaction is NOT created
- [ ] User balance remains unchanged
- [ ] Error message shows current balance and required amount

**Backend Verification:**
- [ ] No transaction record created
- [ ] User balance unchanged in database

**Why:** Prevents users from withdrawing more than they have.

---

### Test Case 7: Transaction Summary

**Actions:**
1. Create multiple transactions (deposits, withdrawals)
2. Navigate to `/transactions`
3. Check the summary cards at the top

**What to Check:**
- [ ] Total Credits shows sum of all credits
- [ ] Total Debits shows sum of all debits
- [ ] Net Amount is correct (credits - debits)
- [ ] Numbers match individual transactions

**Backend Verification:**
- [ ] Call API: `GET /api/transactions/summary/`
- [ ] Verify calculations match database:
  ```sql
  SELECT 
    SUM(credit) as total_credits,
    SUM(debit) as total_debits,
    SUM(credit) - SUM(debit) as net_amount
  FROM trading_transaction
  WHERE user_id = <user_id>
  ```

**Why:** Ensures financial calculations are accurate - critical for a trading platform.

---

## Trading Operations Testing

### Test Case 8: Buy Stock

**Actions:**
1. Ensure user has sufficient balance
2. Navigate to `/trading`
3. Select "Buy Stock" tab
4. Enter:
   - Stock Symbol: `AAPL`
   - Quantity: `10`
   - Price per Share: `150.00`
5. Click "Buy Stock"

**What to Check:**
- [ ] Success message appears
- [ ] User balance decreases by (10 × $150 = $1500)
- [ ] Holding appears in Holdings page
- [ ] Transaction is created automatically
- [ ] Holding shows correct stock, quantity, buying price

**Backend Verification:**
- [ ] Check holdings table: `SELECT * FROM trading_holding WHERE stock='AAPL'`
- [ ] Verify:
  - `quantity = 10`
  - `buying_price = 150.00`
  - `current_price = 150.00`
- [ ] Check transaction was created:
  - `transaction_type = 'buy'`
  - `debit = 1500.00`
  - `credit = 0.00`
- [ ] Verify user balance decreased: `SELECT balance FROM trading_user WHERE id=<user_id>`

**Why:** Buy operations must create holdings, update balance, and create transaction records correctly.

---

### Test Case 9: Buy Stock with Insufficient Balance

**Actions:**
1. Ensure user balance is less than purchase cost
2. Try to buy stock that costs more than available balance

**What to Check:**
- [ ] Error message: "Insufficient balance"
- [ ] Error shows required amount and available balance
- [ ] No holding is created
- [ ] No transaction is created
- [ ] User balance remains unchanged

**Backend Verification:**
- [ ] No holding record created
- [ ] No transaction record created
- [ ] User balance unchanged

**Why:** Prevents users from buying stocks they can't afford.

---

### Test Case 10: Sell Stock

**Actions:**
1. Ensure user has at least one holding
2. Navigate to `/trading`
3. Select "Sell Stock" tab
4. Enter:
   - Stock Symbol: `AAPL`
   - Quantity to Sell: `5`
   - Price per Share: `155.00`
5. Click "Sell Stock"

**What to Check:**
- [ ] Success message appears
- [ ] User balance increases by (5 × $155 = $775)
- [ ] Holding quantity decreases (or is removed if selling all)
- [ ] Transaction is created automatically
- [ ] Transaction shows correct type and amount

**Backend Verification:**
- [ ] Check holding was updated:
  - If partial sell: `quantity` decreased
  - If full sell: holding record deleted
- [ ] Check transaction was created:
  - `transaction_type = 'sell'`
  - `debit = 0.00`
  - `credit = 775.00`
- [ ] Verify user balance increased correctly

**Why:** Sell operations must update holdings, increase balance, and create transaction records.

---

### Test Case 11: Sell More Shares Than Owned

**Actions:**
1. User owns 10 shares of AAPL
2. Try to sell 15 shares

**What to Check:**
- [ ] Error message: "Insufficient shares"
- [ ] Error shows required quantity and available quantity
- [ ] No transaction is created
- [ ] Holding remains unchanged
- [ ] User balance unchanged

**Backend Verification:**
- [ ] No transaction record created
- [ ] Holding quantity unchanged
- [ ] User balance unchanged

**Why:** Prevents users from selling shares they don't own.

---

### Test Case 12: Multiple Buys of Same Stock (Weighted Average)

**Actions:**
1. Buy 10 shares of AAPL at $150
2. Buy 5 more shares of AAPL at $160
3. Check the holding

**What to Check:**
- [ ] Holding shows quantity = 15
- [ ] Buying price is weighted average: `(10×150 + 5×160) / 15 = $153.33`
- [ ] Two separate buy transactions exist
- [ ] Total invested is correct

**Backend Verification:**
- [ ] Check holding:
  ```sql
  SELECT quantity, buying_price 
  FROM trading_holding 
  WHERE stock='AAPL' AND user_id=<user_id>
  ```
- [ ] Verify weighted average calculation
- [ ] Check both transactions exist

**Why:** Ensures multiple purchases of the same stock calculate average price correctly.

---

## Portfolio Management Testing

### Test Case 13: Portfolio Summary

**Actions:**
1. Create deposits and buy some stocks
2. Navigate to `/portfolio`

**What to Check:**
- [ ] Total Balance shows current cash balance
- [ ] Total Invested shows sum of all holdings' buying prices
- [ ] Current Value shows sum of all holdings' current values
- [ ] Total P/L shows profit/loss amount and percentage
- [ ] Holdings Count is correct
- [ ] All calculations are accurate

**Backend Verification:**
- [ ] Call API: `GET /api/portfolio/summary/`
- [ ] Verify calculations:
  ```sql
  -- Total Invested
  SELECT SUM(quantity * buying_price) FROM trading_holding WHERE user_id=<user_id>
  
  -- Current Value
  SELECT SUM(quantity * current_price) FROM trading_holding WHERE user_id=<user_id>
  
  -- Total P/L
  SELECT SUM((quantity * current_price) - (quantity * buying_price)) FROM trading_holding WHERE user_id=<user_id>
  ```

**Why:** Portfolio summary is the main dashboard - must show accurate financial data.

---

### Test Case 14: Holdings List

**Actions:**
1. Create multiple holdings
2. Navigate to `/holdings`

**What to Check:**
- [ ] All holdings are displayed
- [ ] Each holding shows:
  - Stock symbol
  - Quantity
  - Buying price
  - Current price
  - Total invested
  - Current value
  - P/L amount
  - P/L percentage
- [ ] P/L colors are correct (green for profit, red for loss)
- [ ] Summary cards show correct totals

**Backend Verification:**
- [ ] Call API: `GET /api/holdings/`
- [ ] Verify all holdings returned
- [ ] Check calculated fields (total_invested, current_value, profit_loss) are correct

**Why:** Users need to see all their holdings with accurate P/L calculations.

---

### Test Case 15: Update Holding Current Price

**Actions:**
1. Create a holding
2. Update the current_price field (via API or admin)
3. Check the holding again

**What to Check:**
- [ ] P/L recalculates automatically
- [ ] Current value updates
- [ ] P/L percentage updates
- [ ] Portfolio summary reflects new values

**Backend Verification:**
- [ ] Update holding in database:
  ```sql
  UPDATE trading_holding 
  SET current_price = 160.00 
  WHERE stock='AAPL' AND user_id=<user_id>
  ```
- [ ] Verify P/L calculations update correctly

**Why:** Current prices change - system must recalculate P/L dynamically.

---

## ML Strategies Testing

### Test Case 16: Pivot Point Analysis

**Actions:**
1. Navigate to `/ml-strategies`
2. Select "Pivot Point Analysis" tab
3. Enter:
   - High: `150.00`
   - Low: `145.00`
   - Close: `148.00`
4. Click "Analyze"

**What to Check:**
- [ ] Results display correctly
- [ ] Signal is shown (BUY/SELL/HOLD)
- [ ] Pivot points are calculated (Pivot, S1, S2, R1, R2)
- [ ] Description explains the analysis
- [ ] No errors in console

**Backend Verification:**
- [ ] Check API response: `POST /api/ml/pivot/`
- [ ] Verify pivot point calculations are correct
- [ ] Check Django logs for any errors

**Why:** ML strategies must provide accurate trading signals.

---

### Test Case 17: Next-Day Price Prediction

**Actions:**
1. Navigate to `/ml-strategies`
2. Select "Next-Day Prediction" tab
3. Enter stock data:
   - Stock Symbol: `AAPL`
   - Open: `145.00`
   - High: `150.00`
   - Low: `144.00`
   - Close: `148.00`
   - Volume: `1000000`
4. Click "Predict"

**What to Check:**
- [ ] Prediction is displayed (UP/DOWN/NEUTRAL)
- [ ] Confidence percentage is shown
- [ ] Recommendation is provided
- [ ] No errors

**Backend Verification:**
- [ ] Check API response: `POST /api/ml/predict/`
- [ ] Verify ML model processes the data
- [ ] Check response structure is correct

**Why:** Price predictions help users make trading decisions.

---

### Test Case 18: Stock Screener

**Actions:**
1. Navigate to `/ml-strategies`
2. Select "Stock Screener" tab
3. Enter:
   - Market Cap: `15000000000`
   - Volume: `1200000`
   - Sector: `Technology`
4. Click "Screen Stock"

**What to Check:**
- [ ] Recommendation is displayed (STRONG_CANDIDATE/POTENTIAL_CANDIDATE/REJECT)
- [ ] Score out of 100 is shown
- [ ] Reasons are listed
- [ ] No errors

**Backend Verification:**
- [ ] Check API response: `POST /api/ml/screener/`
- [ ] Verify scoring logic works correctly

**Why:** Stock screener helps identify potential index additions.

---

### Test Case 19: Index Rebalancing Analysis

**Actions:**
1. Navigate to `/ml-strategies`
2. Select "Index Rebalancing" tab
3. Enter:
   - Stock Symbol: `AAPL`
   - Event Type: `ADD`
   - Announcement Date: `2025-12-01`
   - Effective Date: `2025-12-15`
   - Current Price: `150.00`
   - Index Name: `SP500`
4. Click "Analyze Event"

**What to Check:**
- [ ] Action recommendation is shown (BUY/HOLD/SELL/AVOID)
- [ ] Rationale is provided
- [ ] Target price is calculated
- [ ] Expected return percentage is shown
- [ ] Days to effective is calculated
- [ ] Position size recommendation is provided

**Backend Verification:**
- [ ] Check API response: `POST /api/ml/index-event/`
- [ ] Verify date calculations are correct
- [ ] Check recommendation logic

**Why:** Index rebalancing events create trading opportunities - analysis must be accurate.

---

## Performance & Analytics Testing

### Test Case 20: Performance Metrics

**Actions:**
1. Create multiple holdings with different P/L
2. Navigate to `/performance`

**What to Check:**
- [ ] Total return is calculated correctly
- [ ] Best performer is identified correctly
- [ ] Worst performer is identified correctly
- [ ] All holdings are listed with P/L
- [ ] Performance is sorted correctly

**Backend Verification:**
- [ ] Call API: `GET /api/portfolio/performance/`
- [ ] Verify calculations:
  ```sql
  SELECT 
    stock,
    (quantity * current_price) - (quantity * buying_price) as profit_loss,
    ((quantity * current_price) - (quantity * buying_price)) / (quantity * buying_price) * 100 as profit_loss_pct
  FROM trading_holding
  WHERE user_id=<user_id>
  ORDER BY profit_loss_pct DESC
  ```

**Why:** Performance metrics help users understand their trading results.

---

### Test Case 21: Dashboard Data Accuracy

**Actions:**
1. Create transactions and holdings
2. Navigate to `/dashboard`

**What to Check:**
- [ ] Total Balance matches user balance
- [ ] Total Invested matches sum of holdings
- [ ] Current Value matches sum of current values
- [ ] Total P/L is correct
- [ ] Recent transactions are displayed
- [ ] Holdings summary is correct

**Backend Verification:**
- [ ] Compare dashboard values with database:
  ```sql
  -- User balance
  SELECT balance FROM trading_user WHERE id=<user_id>
  
  -- Total invested
  SELECT SUM(quantity * buying_price) FROM trading_holding WHERE user_id=<user_id>
  
  -- Current value
  SELECT SUM(quantity * current_price) FROM trading_holding WHERE user_id=<user_id>
  ```

**Why:** Dashboard is the first thing users see - must be accurate.

---

## Error Handling & Edge Cases

### Test Case 22: Empty States

**Actions:**
1. Create a new user account
2. Check all pages without any data

**What to Check:**
- [ ] Dashboard shows 0 values (not errors)
- [ ] Transactions page shows "No transactions found"
- [ ] Holdings page shows "No holdings found"
- [ ] Portfolio page handles empty state gracefully
- [ ] No console errors

**Why:** New users should see helpful empty states, not errors.

---

### Test Case 23: Invalid Data Input

**Actions:**
1. Try to create transaction with negative amounts
2. Try to create holding with invalid stock symbol
3. Try to buy stock with 0 quantity
4. Try to enter text in number fields

**What to Check:**
- [ ] Appropriate validation errors are shown
- [ ] Forms prevent invalid submissions
- [ ] Error messages are clear and helpful
- [ ] No data is saved with invalid input

**Why:** Prevents data corruption and provides good user experience.

---

### Test Case 24: Network Errors

**Actions:**
1. Stop the backend server
2. Try to perform various operations (create transaction, buy stock, etc.)

**What to Check:**
- [ ] Error messages are displayed to user
- [ ] No application crashes
- [ ] User can retry after backend is restarted
- [ ] Loading states are shown appropriately

**Why:** Application must handle network failures gracefully.

---

### Test Case 25: Concurrent Operations

**Actions:**
1. Open two browser tabs with the same user
2. Create a transaction in one tab
3. Check if the other tab updates

**What to Check:**
- [ ] Data consistency is maintained
- [ ] Balance updates correctly in both tabs
- [ ] No race conditions cause incorrect balances

**Backend Verification:**
- [ ] Check database for duplicate or incorrect transactions
- [ ] Verify balance is correct after concurrent operations

**Why:** Multiple sessions should not cause data corruption.

---

## Backend Verification

### Database Integrity Checks

**Run these SQL queries to verify data integrity:**

```sql
-- Check user balances match transaction history
SELECT 
    u.id,
    u.email,
    u.balance as current_balance,
    COALESCE(SUM(t.credit - t.debit), 0) as calculated_balance
FROM trading_user u
LEFT JOIN trading_transaction t ON t.user_id = u.id
GROUP BY u.id, u.email, u.balance
HAVING u.balance != COALESCE(SUM(t.credit - t.debit), 0);

-- Check holdings calculations
SELECT 
    id,
    stock,
    quantity,
    buying_price,
    current_price,
    (quantity * buying_price) as total_invested,
    (quantity * current_price) as current_value,
    (quantity * current_price) - (quantity * buying_price) as profit_loss
FROM trading_holding
WHERE user_id = <user_id>;

-- Check transaction balance_after matches user balance
SELECT 
    t.id,
    t.transaction_type,
    t.balance_after,
    u.balance as user_current_balance
FROM trading_transaction t
JOIN trading_user u ON u.id = t.user_id
WHERE t.balance_after != u.balance
ORDER BY t.date DESC;
```

**Why:** Ensures data consistency and catches calculation errors.

---

### API Response Validation

**Test all endpoints return correct status codes:**

- [ ] `POST /api/users/register/` → 201 Created
- [ ] `POST /api/users/login/` → 200 OK
- [ ] `GET /api/users/profile/` → 200 OK (with auth)
- [ ] `POST /api/transactions/` → 201 Created (with auth)
- [ ] `GET /api/transactions/` → 200 OK (with auth)
- [ ] `POST /api/trading/buy/` → 201 Created (with auth)
- [ ] `POST /api/trading/sell/` → 200 OK (with auth)
- [ ] `GET /api/portfolio/summary/` → 200 OK (with auth)
- [ ] `POST /api/ml/pivot/` → 200 OK

**Why:** Correct HTTP status codes indicate proper API behavior.

---

## Frontend Verification

### Browser Console Checks

**What to Look For:**
- [ ] No JavaScript errors
- [ ] No 404 errors for assets
- [ ] API requests are being made correctly
- [ ] API responses are being handled correctly
- [ ] No CORS errors
- [ ] No authentication errors

**Why:** Console errors indicate problems that need fixing.

---

### Network Tab Verification

**Check Each API Call:**
- [ ] Request URL is correct
- [ ] Request method is correct (GET/POST/PATCH/DELETE)
- [ ] Request headers include Authorization token (for protected routes)
- [ ] Request payload is correct (for POST/PATCH)
- [ ] Response status is 200/201 (not 400/401/500)
- [ ] Response data structure matches expectations

**Why:** Network tab shows exactly what's being sent/received.

---

### UI/UX Verification

**Visual Checks:**
- [ ] Colors match design (Yellow #febc4c, Blue #0c0f27, White text)
- [ ] All text is readable (white on blue background)
- [ ] Buttons are clickable and show hover states
- [ ] Forms are properly aligned
- [ ] Tables display data correctly
- [ ] Loading states appear during API calls
- [ ] Success/error messages are visible

**Why:** Good UI/UX ensures users can actually use the application.

---

## Testing Checklist Summary

### Critical Path Testing (Must Pass)
- [ ] User can register
- [ ] User can login
- [ ] User can deposit money
- [ ] User can buy stock
- [ ] User can sell stock
- [ ] Portfolio shows correct values
- [ ] Balance updates correctly after all operations

### Data Integrity (Must Pass)
- [ ] User balance = sum of all transaction net amounts
- [ ] Holdings calculations are correct
- [ ] Portfolio totals match individual holdings
- [ ] Transaction balance_after matches user balance

### Error Handling (Must Pass)
- [ ] Insufficient balance errors work
- [ ] Invalid input validation works
- [ ] Network errors are handled gracefully
- [ ] Empty states display correctly

### ML Strategies (Should Pass)
- [ ] All ML endpoints return valid responses
- [ ] Calculations are reasonable
- [ ] No crashes or errors

---

## Reporting Issues

When you find a bug, document:

1. **Steps to Reproduce:** What actions led to the issue?
2. **Expected Behavior:** What should have happened?
3. **Actual Behavior:** What actually happened?
4. **Screenshots/Logs:** Console errors, network errors, database state
5. **Environment:** Browser, OS, backend/frontend versions

---

## Automated Testing Recommendations

For future development, consider adding:

1. **Unit Tests:** Test individual functions (calculations, validations)
2. **Integration Tests:** Test API endpoints with test database
3. **E2E Tests:** Use Cypress or Selenium to automate user flows
4. **Load Tests:** Test with multiple concurrent users

---

## Quick Test Script

Run this to quickly verify the system:

```bash
# 1. Test registration
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"test","name":"Test","userid":"test001","password":"testpass123","password_confirm":"testpass123"}'

# 2. Test login (get token from above)
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"testpass123"}'

# 3. Test deposit (use token from login)
curl -X POST http://localhost:8000/api/transactions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token <your_token>" \
  -d '{"transaction_type":"deposit","debit":0,"credit":1000,"description":"Test deposit"}'

# 4. Test buy stock
curl -X POST http://localhost:8000/api/trading/buy/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token <your_token>" \
  -d '{"stock":"AAPL","quantity":10,"price":150}'

# 5. Check portfolio
curl -X GET http://localhost:8000/api/portfolio/summary/ \
  -H "Authorization: Token <your_token>"
```

---

## Notes

- Always test with a clean database or test user account
- Verify calculations manually for critical financial operations
- Check both frontend UI and backend database for consistency
- Test edge cases (zero values, negative values, very large numbers)
- Verify error messages are user-friendly and helpful

---

**Last Updated:** December 2025

