"""
Pivot Point Trading Strategy for Index Rebalancing Platform
"""

class PivotStrategy:
    def __init__(self):
        self.name = "Pivot Point Strategy"
    
    def calculate_pivot_points(self, high, low, close):
        """Calculate pivot points and support/resistance levels"""
        pivot_point = (high + low + close) / 3
        
        support_1 = (2 * pivot_point) - high
        support_2 = pivot_point - (high - low)
        support_3 = low - 2 * (high - pivot_point)
        
        resistance_1 = (2 * pivot_point) - low
        resistance_2 = pivot_point + (high - low)
        resistance_3 = high + 2 * (pivot_point - low)
        
        return {
            'pivot_point': round(pivot_point, 2),
            'support_1': round(support_1, 2),
            'support_2': round(support_2, 2),
            'support_3': round(support_3, 2),
            'resistance_1': round(resistance_1, 2),
            'resistance_2': round(resistance_2, 2),
            'resistance_3': round(resistance_3, 2)
        }
    
    def generate_signal(self, pivot_points, current_price):
        """Generate trading signal"""
        pp = pivot_points
        
        if current_price > pp['resistance_2']:
            return 'STRONG_BUY', f"Price ${current_price} broke above R2 (${pp['resistance_2']})"
        elif current_price > pp['resistance_1']:
            return 'BUY', f"Price ${current_price} above R1 (${pp['resistance_1']})"
        elif current_price >= pp['support_1']:
            if current_price > pp['pivot_point']:
                return 'HOLD_BULLISH', f"Price ${current_price} above pivot (${pp['pivot_point']})"
            else:
                return 'HOLD_BEARISH', f"Price ${current_price} below pivot (${pp['pivot_point']})"
        elif current_price > pp['support_2']:
            return 'SELL', f"Price ${current_price} below S1 (${pp['support_1']})"
        else:
            return 'STRONG_SELL', f"Price ${current_price} broke below S2 (${pp['support_2']})"
    
    def predict(self, high, low, close):
        """Main prediction method"""
        pivot_points = self.calculate_pivot_points(high, low, close)
        signal, description = self.generate_signal(pivot_points, close)
        
        return {
            'signal': signal,
            'description': description,
            'current_price': round(close, 2),
            'pivot_points': pivot_points,
            'strategy': 'Pivot Point Analysis'
        }
