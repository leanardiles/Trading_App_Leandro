"""
Auto Trading Engine with risk configurations
"""
from decimal import Decimal


class AutoTradingEngine:
    """
    Engine for automated trading with risk-based configurations
    """
    
    RISK_CONFIG = {
        'LOW': {
            'expected_monthly_return': Decimal('2.0'),  # 2% per month
            'stop_loss': Decimal('0.05'),  # 5% stop loss
            'take_profit': Decimal('0.10'),  # 10% take profit
            'max_position_size': Decimal('0.20'),  # Max 20% of capital per position
            'stocks': ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'V', 'JNJ']
        },
        'MEDIUM': {
            'expected_monthly_return': Decimal('5.0'),  # 5% per month
            'stop_loss': Decimal('0.08'),  # 8% stop loss
            'take_profit': Decimal('0.15'),  # 15% take profit
            'max_position_size': Decimal('0.30'),  # Max 30% of capital per position
            'stocks': ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'AMD', 'NFLX', 'DIS']
        },
        'HIGH': {
            'expected_monthly_return': Decimal('10.0'),  # 10% per month
            'stop_loss': Decimal('0.15'),  # 15% stop loss
            'take_profit': Decimal('0.25'),  # 25% take profit
            'max_position_size': Decimal('0.40'),  # Max 40% of capital per position
            'stocks': ['TSLA', 'NVDA', 'AMD', 'META', 'NFLX', 'PLTR', 'RIVN', 'LCID', 'SOFI', 'HOOD']
        }
    }
    
    @staticmethod
    def get_risk_config(risk_level):
        """Get risk configuration for a given risk level"""
        return AutoTradingEngine.RISK_CONFIG.get(risk_level.upper(), AutoTradingEngine.RISK_CONFIG['MEDIUM'])
    
    @staticmethod
    def calculate_expected_return(investment_amount, risk_level, duration_weeks):
        """Calculate expected return based on risk level and duration"""
        config = AutoTradingEngine.get_risk_config(risk_level)
        expected_monthly_return = config['expected_monthly_return']
        expected_return_pct = expected_monthly_return * (Decimal(str(duration_weeks)) / Decimal('4'))
        expected_profit = investment_amount * (expected_return_pct / Decimal('100'))
        return expected_return_pct, expected_profit

