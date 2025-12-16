# Hermes AI Trading Bot - Backtest Documentation

## Overview

The Hermes AI Trading Bot backtest system simulates 1 week of automated trading using all ML strategies:
- **Pivot Point Analysis**: Technical analysis for support/resistance levels
- **Next-Day Price Prediction**: ML-based price movement forecasting
- **Stock Screener**: Index addition eligibility analysis
- **Index Rebalancing**: Track index reconstitution events

## Features

- ✅ Real-time stock data fetching using yfinance
- ✅ Risk-based position sizing (LOW/MEDIUM/HIGH)
- ✅ Stop loss and take profit management
- ✅ Multi-strategy signal aggregation
- ✅ Performance metrics tracking (ROI, win rate, P/L)
- ✅ Detailed trade logging

## Usage

### Method 1: Django Management Command (Recommended)

```bash
cd backend_django/trading_back
source ../venv/bin/activate  # Activate virtual environment
python manage.py backtest_hermes
```

**Options:**
```bash
# Backtest with specific risk level
python manage.py backtest_hermes --risk-level HIGH --investment 5000

# Backtest existing bot
python manage.py backtest_hermes --bot-id 1

# Default: MEDIUM risk, $1000 investment
python manage.py backtest_hermes
```

### Method 2: Direct Python Script

```bash
cd backend_django/trading_back
source ../venv/bin/activate
python test_hermes_backtest.py
```

### Method 3: Programmatic Usage

```python
from trading_app.backtest_hermes_bot import run_backtest_for_bot

# Run backtest
results = run_backtest_for_bot(
    bot_id=None,  # None to create new test bot
    risk_level='MEDIUM',  # LOW, MEDIUM, or HIGH
    investment_amount=1000
)

print(f"ROI: {results['roi']:.2f}%")
print(f"Win Rate: {results['win_rate']:.2f}%")
```

## Risk Profiles

### LOW Risk
- Expected Monthly Return: 2%
- Stop Loss: 5%
- Take Profit: 10%
- Max Position Size: 20% of capital
- Watchlist: AAPL, MSFT, GOOGL, AMZN, TSLA, META, NVDA, JPM, V, JNJ

### MEDIUM Risk
- Expected Monthly Return: 5%
- Stop Loss: 8%
- Take Profit: 15%
- Max Position Size: 30% of capital
- Watchlist: AAPL, MSFT, GOOGL, AMZN, TSLA, META, NVDA, AMD, NFLX, DIS

### HIGH Risk
- Expected Monthly Return: 10%
- Stop Loss: 15%
- Take Profit: 25%
- Max Position Size: 40% of capital
- Watchlist: TSLA, NVDA, AMD, META, NFLX, PLTR, RIVN, LCID, SOFI, HOOD

## How It Works

1. **Data Fetching**: Downloads historical stock data for the past week using yfinance
2. **Daily Analysis**: For each trading day:
   - Analyzes all stocks in watchlist using ML strategies
   - Generates buy/sell signals based on strategy consensus
   - Checks stop loss/take profit for existing positions
   - Executes trades based on risk parameters
3. **Position Management**: 
   - Calculates position sizes based on risk level
   - Applies stop loss and take profit automatically
   - Closes all positions at end of backtest
4. **Performance Tracking**: 
   - Records all trades with entry/exit prices
   - Calculates ROI, win rate, total P/L
   - Generates daily portfolio value snapshots

## Output

The backtest generates:
- **Console Output**: Real-time trading activity and final report
- **Bot Update**: Updates the bot's performance metrics in database
- **Results Dictionary**: Returns detailed results including:
  - `final_value`: Final portfolio value
  - `total_return`: Total profit/loss
  - `roi`: Return on investment percentage
  - `total_trades`: Number of trades executed
  - `winning_trades`: Number of profitable trades
  - `losing_trades`: Number of losing trades
  - `win_rate`: Win rate percentage
  - `trades`: List of all trades with details
  - `daily_values`: Daily portfolio value snapshots

## Example Output

```
================================================================================
HERMES BOT BACKTEST
================================================================================
Bot: Backtest_Bot_MEDIUM
Risk Level: MEDIUM
Initial Capital: $1,000.00
Period: 2025-01-09 to 2025-01-16
Watchlist: AAPL, MSFT, GOOGL, AMZN, TSLA...
================================================================================

Fetching stock data...
  ✓ AAPL: 5 days of data
  ✓ MSFT: 5 days of data
  ✓ GOOGL: 5 days of data
  ...

Running backtest for 5 trading days...

Day 1/5: 2025-01-09
  ✓ BUY AAPL @ $150.25 - ML Signals: PIVOT(BUY), PREDICTION(UP)
  ✓ BUY NVDA @ $450.50 - ML Signals: PIVOT(STRONG_BUY), PREDICTION(UP)

Day 2/5: 2025-01-10
  ✓ SELL AAPL @ $152.30 - Take Profit triggered (1.37%)
  ✓ BUY TSLA @ $250.75 - ML Signals: PIVOT(BUY), PREDICTION(UP)

...

================================================================================
BACKTEST RESULTS
================================================================================
Initial Capital:     $       1,000.00
Final Value:         $       1,045.30
Total Return:        $          45.30
ROI:                     4.53%

Trading Statistics:
  Total Trades:                 8
  Winning Trades:                5
  Losing Trades:                3
  Win Rate:                62.50%

Risk Settings:
  Stop Loss:                  8.0%
  Take Profit:               15.0%
  Max Position Size:         30.0%
================================================================================
```

## Notes

- The backtest uses **real historical data** from yfinance
- Trading only occurs on **weekdays** (Monday-Friday)
- All positions are **closed at the end** of the backtest period
- The bot uses **consensus scoring** from multiple ML strategies
- **Stop loss and take profit** are automatically enforced
- Position sizes are **risk-adjusted** based on the selected risk level

## Troubleshooting

**Error: "No stock data available"**
- Check internet connection (yfinance requires internet)
- Verify stock symbols are valid
- Try a different date range

**Error: "ModuleNotFoundError: No module named 'yfinance'"**
- Install: `pip install yfinance`

**Error: "Django not found"**
- Make sure virtual environment is activated
- Run from `trading_back` directory

## Future Enhancements

- [ ] Support for custom date ranges
- [ ] Multiple bot comparison
- [ ] Export results to CSV/JSON
- [ ] Visualization charts
- [ ] Monte Carlo simulation
- [ ] Walk-forward optimization

