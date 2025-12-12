"""
Index Reconstitution Trading Strategy
"""

from datetime import datetime, timedelta

class IndexRebalancingStrategy:
    def __init__(self):
        self.name = "Index Reconstitution Strategy"
    
    def analyze_event(self, stock_symbol, event_type, announcement_date, 
                     effective_date, current_price, index_name='SP500'):
        """Analyze index reconstitution event"""
        
        today = datetime.now().date()
        effective_dt = datetime.strptime(effective_date, '%Y-%m-%d').date()
        announcement_dt = datetime.strptime(announcement_date, '%Y-%m-%d').date()
        
        days_to_effective = (effective_dt - today).days
        days_since_announcement = (today - announcement_dt).days
        
        if event_type == 'ADD':
            expected_impact = 5.0  # 5% average gain on additions
            
            if days_since_announcement == 0:
                action = 'BUY'
                rationale = f"Just announced! Index funds must buy {stock_symbol}. Expected {expected_impact}% gain."
                target_price = current_price * 1.05
            elif 0 < days_to_effective <= 5:
                action = 'HOLD' if days_to_effective > 2 else 'SELL'
                rationale = f"{'Hold for final run-up' if days_to_effective > 2 else 'Take profits'}"
                target_price = current_price * 1.02
            elif days_to_effective < 0:
                action = 'AVOID'
                rationale = "Index rebalancing complete. Price may revert."
                target_price = None
            else:
                action = 'BUY'
                rationale = f"In announcement window. {days_to_effective} days until effective."
                target_price = current_price * 1.05
                
        elif event_type == 'DELETE':
            expected_impact = -6.0  # 6% average drop on deletions
            
            if days_since_announcement == 0:
                action = 'SHORT' if days_to_effective > 5 else 'AVOID'
                rationale = f"Deletion announced. Forced selling expected. Target {abs(expected_impact)}% drop."
                target_price = current_price * 0.94
            elif days_to_effective < 0:
                action = 'BUY_REBOUND'
                rationale = "Deletion complete. Oversold bounce possible."
                target_price = current_price * 1.05
            else:
                action = 'SHORT' if days_to_effective > 3 else 'COVER'
                rationale = f"{'Continue short' if days_to_effective > 3 else 'Cover shorts'}"
                target_price = current_price * 0.94 if days_to_effective > 3 else None
        else:
            return {'error': 'Invalid event_type'}
        
        # Position size
        if days_to_effective > 15:
            position_size = 3
        elif days_to_effective > 7:
            position_size = 5
        else:
            position_size = 2
        
        return {
            'stock_symbol': stock_symbol,
            'index': index_name,
            'event_type': event_type,
            'action': action,
            'rationale': rationale,
            'current_price': round(current_price, 2),
            'target_price': round(target_price, 2) if target_price else None,
            'expected_return_pct': expected_impact,
            'days_to_effective': days_to_effective,
            'position_size_pct': position_size,
            'risk_rating': 'MEDIUM',
            'strategy': 'Index Reconstitution Arbitrage'
        }
