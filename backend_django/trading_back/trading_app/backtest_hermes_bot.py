"""
Backtest script for Hermes AI Trading Bot
Simulates 1 week of trading using all ML strategies
"""

import os
import sys
import django
from datetime import datetime, timedelta
from decimal import Decimal
import pandas as pd
import yfinance as yf

# Setup Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'trading_back.settings')
django.setup()

from trading_app.models import User, AutoTradingBot
from trading_app.auto_trading_engine import AutoTradingEngine
from trading_app.ml_models.pivot import PivotStrategy
from trading_app.ml_models.nextday_prediction import NextDayPredictor
from trading_app.ml_models.stock_screener import StockScreener
from trading_app.ml_models.index_rebalancing import IndexRebalancingStrategy


class HermesBotBacktester:
    """Backtest the Hermes AI Trading Bot"""
    
    def __init__(self, bot, start_date=None, end_date=None):
        self.bot = bot
        self.config = AutoTradingEngine.RISK_CONFIG[bot.risk_level]
        
        # Set default dates (1 week backtest)
        if not end_date:
            end_date = datetime.now().date()
        if not start_date:
            start_date = end_date - timedelta(days=7)
        
        self.start_date = start_date
        self.end_date = end_date
        
        # Initialize ML strategies
        self.pivot_strategy = PivotStrategy()
        self.predictor = NextDayPredictor()
        self.screener = StockScreener()
        self.index_strategy = IndexRebalancingStrategy()
        
        # Trading state
        self.cash = bot.initial_capital
        self.positions = {}  # {stock: {'quantity': int, 'entry_price': Decimal, 'entry_date': date}}
        self.trades = []
        self.daily_portfolio_values = []
        
        # Performance metrics
        self.total_trades = 0
        self.winning_trades = 0
        self.losing_trades = 0
        self.total_profit_loss = Decimal('0.00')
        
    def get_stock_data(self, symbol, start_date, end_date):
        """Fetch historical stock data using yfinance"""
        try:
            ticker = yf.Ticker(symbol)
            df = ticker.history(start=start_date, end=end_date + timedelta(days=1))
            if df.empty:
                return None
            
            df.reset_index(inplace=True)
            df['Date'] = pd.to_datetime(df['Date']).dt.date
            df = df[['Date', 'Open', 'High', 'Low', 'Close', 'Volume']]
            df.columns = ['date', 'open', 'high', 'low', 'close', 'volume']
            return df
        except Exception as e:
            print(f"Error fetching data for {symbol}: {e}")
            return None
    
    def calculate_position_size(self, price, signal_strength='NORMAL'):
        """Calculate position size based on risk config"""
        max_position_pct = self.config['max_position_size']
        max_position_value = self.cash * max_position_pct
        
        # Adjust based on signal strength
        if signal_strength == 'STRONG':
            position_multiplier = 1.0
        elif signal_strength == 'NORMAL':
            position_multiplier = 0.7
        else:
            position_multiplier = 0.5
        
        position_value = max_position_value * Decimal(str(position_multiplier))
        quantity = int(position_value / Decimal(str(price)))
        
        return max(1, quantity), position_value
    
    def execute_buy(self, symbol, price, date, reason):
        """Execute a buy order"""
        quantity, cost = self.calculate_position_size(price)
        
        if cost > self.cash:
            return False
        
        self.cash -= cost
        if symbol in self.positions:
            # Average the position
            old_qty = self.positions[symbol]['quantity']
            old_price = self.positions[symbol]['entry_price']
            total_qty = old_qty + quantity
            avg_price = ((old_qty * old_price) + (quantity * Decimal(str(price)))) / total_qty
            self.positions[symbol] = {
                'quantity': total_qty,
                'entry_price': avg_price,
                'entry_date': date
            }
        else:
            self.positions[symbol] = {
                'quantity': quantity,
                'entry_price': Decimal(str(price)),
                'entry_date': date
            }
        
        self.total_trades += 1
        self.trades.append({
            'date': date,
            'symbol': symbol,
            'action': 'BUY',
            'quantity': quantity,
            'price': Decimal(str(price)),
            'cost': cost,
            'reason': reason
        })
        
        return True
    
    def execute_sell(self, symbol, price, date, reason):
        """Execute a sell order"""
        if symbol not in self.positions:
            return False
        
        position = self.positions[symbol]
        quantity = position['quantity']
        entry_price = position['entry_price']
        
        proceeds = Decimal(str(price)) * quantity
        cost_basis = entry_price * quantity
        profit_loss = proceeds - cost_basis
        
        self.cash += proceeds
        del self.positions[symbol]
        
        self.total_trades += 1
        if profit_loss > 0:
            self.winning_trades += 1
        else:
            self.losing_trades += 1
        
        self.total_profit_loss += profit_loss
        
        self.trades.append({
            'date': date,
            'symbol': symbol,
            'action': 'SELL',
            'quantity': quantity,
            'price': Decimal(str(price)),
            'proceeds': proceeds,
            'entry_price': entry_price,
            'profit_loss': profit_loss,
            'reason': reason
        })
        
        return True
    
    def check_stop_loss_take_profit(self, symbol, current_price, date):
        """Check if stop loss or take profit should be triggered"""
        if symbol not in self.positions:
            return False
        
        position = self.positions[symbol]
        entry_price = position['entry_price']
        current_price_decimal = Decimal(str(current_price))
        
        # Calculate P/L percentage
        pnl_pct = ((current_price_decimal - entry_price) / entry_price) * 100
        
        stop_loss_pct = self.config['stop_loss'] * 100
        take_profit_pct = self.config['take_profit'] * 100
        
        if pnl_pct <= -stop_loss_pct:
            self.execute_sell(symbol, current_price, date, f'Stop Loss triggered ({pnl_pct:.2f}%)')
            return True
        elif pnl_pct >= take_profit_pct:
            self.execute_sell(symbol, current_price, date, f'Take Profit triggered ({pnl_pct:.2f}%)')
            return True
        
        return False
    
    def analyze_stock(self, symbol, data_row, date):
        """Analyze stock using all ML strategies"""
        signals = []
        scores = {'buy': 0, 'sell': 0, 'hold': 0}
        
        # 1. Pivot Point Analysis
        if self.bot.use_pivot:
            try:
                pivot_result = self.pivot_strategy.predict(
                    float(data_row['high']),
                    float(data_row['low']),
                    float(data_row['close'])
                )
                signal = pivot_result['signal']
                signals.append(('PIVOT', signal, pivot_result['description']))
                
                if signal in ['STRONG_BUY', 'BUY']:
                    scores['buy'] += 2 if signal == 'STRONG_BUY' else 1
                elif signal in ['STRONG_SELL', 'SELL']:
                    scores['sell'] += 2 if signal == 'STRONG_SELL' else 1
                else:
                    scores['hold'] += 1
            except Exception as e:
                print(f"Pivot analysis error for {symbol}: {e}")
        
        # 2. Next-Day Prediction
        if self.bot.use_prediction:
            try:
                pred_result = self.predictor.predict(
                    symbol,
                    float(data_row['open']),
                    float(data_row['high']),
                    float(data_row['low']),
                    float(data_row['close']),
                    int(data_row['volume'])
                )
                prediction = pred_result['prediction']
                confidence = pred_result['confidence']
                signals.append(('PREDICTION', prediction, f"{confidence}% confidence"))
                
                if prediction == 'UP' and confidence >= 70:
                    scores['buy'] += 2
                elif prediction == 'DOWN' and confidence >= 70:
                    scores['sell'] += 1
            except Exception as e:
                print(f"Prediction error for {symbol}: {e}")
        
        # 3. Stock Screener (simplified - check if stock is in watchlist)
        if self.bot.use_screener:
            if symbol in self.config['stocks']:
                scores['buy'] += 1
                signals.append(('SCREENER', 'PASS', 'In watchlist'))
        
        # 4. Index Rebalancing (simplified - random events for demo)
        if self.bot.use_index_rebalancing:
            # In real scenario, this would check for actual index events
            # For backtest, we'll skip this or use historical events
            pass
        
        return signals, scores
    
    def calculate_portfolio_value(self, current_prices):
        """Calculate total portfolio value"""
        positions_value = Decimal('0.00')
        for symbol, position in self.positions.items():
            if symbol in current_prices:
                positions_value += Decimal(str(current_prices[symbol])) * position['quantity']
        return self.cash + positions_value
    
    def run_backtest(self):
        """Run the backtest"""
        print(f"\n{'='*80}")
        print(f"HERMES BOT BACKTEST")
        print(f"{'='*80}")
        print(f"Bot: {self.bot.name}")
        print(f"Risk Level: {self.bot.risk_level}")
        print(f"Initial Capital: ${self.bot.initial_capital:,.2f}")
        print(f"Period: {self.start_date} to {self.end_date}")
        print(f"Watchlist: {', '.join(self.config['stocks'][:5])}...")
        print(f"{'='*80}\n")
        
        # Get trading dates (weekdays only)
        current_date = self.start_date
        trading_dates = []
        while current_date <= self.end_date:
            if current_date.weekday() < 5:  # Monday = 0, Friday = 4
                trading_dates.append(current_date)
            current_date += timedelta(days=1)
        
        # Fetch data for all stocks in watchlist
        stock_data = {}
        print("Fetching stock data...")
        for symbol in self.config['stocks']:
            data = self.get_stock_data(symbol, self.start_date, self.end_date)
            if data is not None and not data.empty:
                stock_data[symbol] = data
                print(f"  ✓ {symbol}: {len(data)} days of data")
        
        if not stock_data:
            print("ERROR: No stock data available for backtest")
            return None
        
        # Run backtest day by day
        print(f"\nRunning backtest for {len(trading_dates)} trading days...\n")
        
        for day_idx, date in enumerate(trading_dates):
            print(f"Day {day_idx + 1}/{len(trading_dates)}: {date}")
            
            # Get current prices for all stocks
            current_prices = {}
            daily_data = {}
            
            for symbol, df in stock_data.items():
                day_data = df[df['date'] == date]
                if not day_data.empty:
                    row = day_data.iloc[0]
                    current_prices[symbol] = float(row['close'])
                    daily_data[symbol] = row
            
            # Check stop loss / take profit for existing positions
            for symbol in list(self.positions.keys()):
                if symbol in current_prices:
                    self.check_stop_loss_take_profit(symbol, current_prices[symbol], date)
            
            # Analyze stocks and make trading decisions
            for symbol, row in daily_data.items():
                # Skip if we already have a position (unless strong sell signal)
                if symbol in self.positions:
                    continue
                
                # Analyze stock
                signals, scores = self.analyze_stock(symbol, row, date)
                
                # Make trading decision
                max_score = max(scores.values())
                action = max(scores, key=scores.get) if max_score > 0 else 'hold'
                
                if action == 'buy' and scores['buy'] >= 2:
                    signal_strength = 'STRONG' if scores['buy'] >= 3 else 'NORMAL'
                    reason = f"ML Signals: {', '.join([f'{s[0]}({s[1]})' for s in signals])}"
                    self.execute_buy(symbol, current_prices[symbol], date, reason)
                    print(f"  ✓ BUY {symbol} @ ${current_prices[symbol]:.2f} - {reason}")
                
                elif action == 'sell' and symbol in self.positions and scores['sell'] >= 2:
                    reason = f"ML Signals: {', '.join([f'{s[0]}({s[1]})' for s in signals])}"
                    self.execute_sell(symbol, current_prices[symbol], date, reason)
                    print(f"  ✓ SELL {symbol} @ ${current_prices[symbol]:.2f} - {reason}")
            
            # Calculate portfolio value
            portfolio_value = self.calculate_portfolio_value(current_prices)
            self.daily_portfolio_values.append({
                'date': date,
                'cash': float(self.cash),
                'positions_value': float(portfolio_value - self.cash),
                'total_value': float(portfolio_value)
            })
        
        # Close all remaining positions at end
        print(f"\nClosing remaining positions...")
        final_prices = {}
        for symbol in list(self.positions.keys()):
            # Get last available price
            if symbol in stock_data:
                last_row = stock_data[symbol].iloc[-1]
                final_price = float(last_row['close'])
                final_prices[symbol] = final_price
                self.execute_sell(symbol, final_price, self.end_date, 'End of backtest')
                print(f"  ✓ SELL {symbol} @ ${final_price:.2f} - End of backtest")
        
        # Calculate final metrics
        final_value = self.cash
        total_return = final_value - self.bot.initial_capital
        roi = (total_return / self.bot.initial_capital) * 100 if self.bot.initial_capital > 0 else 0
        win_rate = (self.winning_trades / self.total_trades * 100) if self.total_trades > 0 else 0
        
        # Generate report
        self.generate_report(final_value, total_return, roi, win_rate)
        
        return {
            'final_value': float(final_value),
            'total_return': float(total_return),
            'roi': float(roi),
            'total_trades': self.total_trades,
            'winning_trades': self.winning_trades,
            'losing_trades': self.losing_trades,
            'win_rate': float(win_rate),
            'trades': self.trades,
            'daily_values': self.daily_portfolio_values
        }
    
    def generate_report(self, final_value, total_return, roi, win_rate):
        """Generate backtest report"""
        print(f"\n{'='*80}")
        print(f"BACKTEST RESULTS")
        print(f"{'='*80}")
        print(f"Initial Capital:     ${self.bot.initial_capital:>15,.2f}")
        print(f"Final Value:         ${final_value:>15,.2f}")
        print(f"Total Return:        ${total_return:>15,.2f}")
        print(f"ROI:                 {roi:>15.2f}%")
        print(f"\nTrading Statistics:")
        print(f"  Total Trades:      {self.total_trades:>15}")
        print(f"  Winning Trades:    {self.winning_trades:>15}")
        print(f"  Losing Trades:     {self.losing_trades:>15}")
        print(f"  Win Rate:          {win_rate:>15.2f}%")
        print(f"\nRisk Settings:")
        print(f"  Stop Loss:         {self.config['stop_loss']*100:>15.1f}%")
        print(f"  Take Profit:       {self.config['take_profit']*100:>15.1f}%")
        print(f"  Max Position Size: {self.config['max_position_size']*100:>15.1f}%")
        print(f"{'='*80}\n")
        
        # Show recent trades
        if self.trades:
            print(f"Recent Trades (showing last 10):")
            print(f"{'-'*80}")
            for trade in self.trades[-10:]:
                if trade['action'] == 'BUY':
                    print(f"{trade['date']} | BUY  {trade['symbol']:6s} | "
                          f"{trade['quantity']:3d} shares @ ${trade['price']:7.2f} | "
                          f"Cost: ${trade['cost']:,.2f} | {trade['reason']}")
                else:
                    pnl = trade.get('profit_loss', Decimal('0'))
                    pnl_str = f"${pnl:+,.2f}" if pnl != 0 else "$0.00"
                    print(f"{trade['date']} | SELL {trade['symbol']:6s} | "
                          f"{trade['quantity']:3d} shares @ ${trade['price']:7.2f} | "
                          f"P/L: {pnl_str:>10s} | {trade['reason']}")
            print(f"{'-'*80}\n")


def run_backtest_for_bot(bot_id=None, risk_level='MEDIUM', investment_amount=1000):
    """Run backtest for a specific bot or create a test bot"""
    
    # Get or create test user
    test_user, _ = User.objects.get_or_create(
        email='backtest@test.com',
        defaults={
            'username': 'backtest_user',
            'name': 'Backtest User',
            'balance': Decimal('100000'),
        }
    )
    
    # Get or create test bot
    if bot_id:
        try:
            bot = AutoTradingBot.objects.get(id=bot_id, user=test_user)
        except AutoTradingBot.DoesNotExist:
            print(f"Bot {bot_id} not found. Creating new test bot...")
            bot = None
    else:
        bot = None
    
    if not bot:
        # Create test bot
        config = AutoTradingEngine.RISK_CONFIG[risk_level]
        bot = AutoTradingBot.objects.create(
            user=test_user,
            name=f"Backtest_Bot_{risk_level}",
            risk_level=risk_level,
            duration='CUSTOM',
            initial_capital=Decimal(str(investment_amount)),
            current_capital=Decimal(str(investment_amount)),
            expected_return=Decimal('5.0'),
            use_pivot=True,
            use_prediction=True,
            use_screener=True,
            use_index_rebalancing=True,
            status='ACTIVE'
        )
        print(f"Created test bot: {bot.name} (ID: {bot.id})")
    
    # Run backtest
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=7)
    
    backtester = HermesBotBacktester(bot, start_date, end_date)
    results = backtester.run_backtest()
    
    # Update bot with results
    if results:
        bot.current_capital = Decimal(str(results['final_value']))
        bot.total_profit_loss = Decimal(str(results['total_return']))
        bot.total_trades = results['total_trades']
        bot.winning_trades = results['winning_trades']
        bot.losing_trades = results['losing_trades']
        bot.save()
        print(f"\nBot updated with backtest results!")
    
    return results


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Backtest Hermes AI Trading Bot')
    parser.add_argument('--bot-id', type=int, help='Bot ID to backtest')
    parser.add_argument('--risk-level', choices=['LOW', 'MEDIUM', 'HIGH'], default='MEDIUM', help='Risk level')
    parser.add_argument('--investment', type=float, default=1000, help='Investment amount')
    
    args = parser.parse_args()
    
    results = run_backtest_for_bot(
        bot_id=args.bot_id,
        risk_level=args.risk_level,
        investment_amount=args.investment
    )
    
    if results:
        print("\n✓ Backtest completed successfully!")
    else:
        print("\n✗ Backtest failed!")

