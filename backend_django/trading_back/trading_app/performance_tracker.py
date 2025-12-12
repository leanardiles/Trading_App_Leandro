"""
Performance Tracker for 1-Week Backtest
Track ML strategy recommendations and outcomes
"""

from datetime import datetime, timedelta
import json

class PerformanceTracker:
    def __init__(self):
        self.trades = []
        self.start_date = datetime.now()
    
    def log_trade(self, strategy, stock_symbol, action, entry_price, 
                  target_price, actual_exit_price=None, outcome=None):
        """Log a trade recommendation and outcome"""
        trade = {
            'date': datetime.now().isoformat(),
            'strategy': strategy,
            'stock_symbol': stock_symbol,
            'action': action,
            'entry_price': entry_price,
            'target_price': target_price,
            'actual_exit_price': actual_exit_price,
            'outcome': outcome,  # 'WIN', 'LOSS', or 'PENDING'
            'return_pct': None
        }
        
        if actual_exit_price and entry_price:
            trade['return_pct'] = ((actual_exit_price - entry_price) / entry_price) * 100
        
        self.trades.append(trade)
        return trade
    
    def get_summary(self):
        """Get performance summary"""
        completed_trades = [t for t in self.trades if t['outcome'] in ['WIN', 'LOSS']]
        
        if not completed_trades:
            return {'message': 'No completed trades yet'}
        
        wins = len([t for t in completed_trades if t['outcome'] == 'WIN'])
        losses = len([t for t in completed_trades if t['outcome'] == 'LOSS'])
        
        avg_return = sum([t['return_pct'] for t in completed_trades if t['return_pct']]) / len(completed_trades)
        
        return {
            'total_trades': len(completed_trades),
            'wins': wins,
            'losses': losses,
            'win_rate': (wins / len(completed_trades)) * 100,
            'avg_return_pct': round(avg_return, 2),
            'by_strategy': self._summary_by_strategy(completed_trades)
        }
    
    def _summary_by_strategy(self, trades):
        """Break down performance by strategy"""
        strategies = {}
        for trade in trades:
            strat = trade['strategy']
            if strat not in strategies:
                strategies[strat] = {'trades': 0, 'wins': 0, 'avg_return': 0}
            
            strategies[strat]['trades'] += 1
            if trade['outcome'] == 'WIN':
                strategies[strat]['wins'] += 1
            
            if trade['return_pct']:
                strategies[strat]['avg_return'] += trade['return_pct']
        
        for strat in strategies:
            if strategies[strat]['trades'] > 0:
                strategies[strat]['avg_return'] /= strategies[strat]['trades']
                strategies[strat]['win_rate'] = (strategies[strat]['wins'] / strategies[strat]['trades']) * 100
        
        return strategies

# Example usage
tracker = PerformanceTracker()

# Example: Log the NVDA trade we just analyzed
tracker.log_trade(
    strategy='Index Reconstitution',
    stock_symbol='NVDA',
    action='BUY',
    entry_price=450.0,
    target_price=472.5,
    actual_exit_price=None,  # Will update after 1 week
    outcome='PENDING'
)

print("Performance tracker initialized!")
