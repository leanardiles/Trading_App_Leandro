"""
Stock Screener for Index Reconstitution Candidates
"""

class StockScreener:
    def __init__(self):
        self.name = "Stock Screener"
    
    def screen_for_index_addition(self, market_cap, volume, sector='Technology'):
        """Screen stocks for potential index addition"""
        
        score = 0
        reasons = []
        
        # Market cap criterion (S&P 500 threshold)
        if market_cap >= 14500000000:  # $14.5B
            score += 40
            reasons.append("✓ Market cap meets S&P 500 threshold")
        elif market_cap >= 8000000000:
            score += 25
            reasons.append("⚠ Market cap approaching S&P 500 threshold")
        
        # Liquidity criterion
        if volume >= 1000000:
            score += 30
            reasons.append("✓ High trading volume (good liquidity)")
        elif volume >= 500000:
            score += 15
            reasons.append("⚠ Moderate trading volume")
        
        # Sector bonus
        if sector in ['Technology', 'Healthcare', 'Finance']:
            score += 10
            reasons.append(f"✓ In high-growth sector ({sector})")
        
        # Generate recommendation
        if score >= 70:
            recommendation = 'STRONG_CANDIDATE'
        elif score >= 50:
            recommendation = 'POTENTIAL_CANDIDATE'
        else:
            recommendation = 'UNLIKELY'
        
        return {
            'recommendation': recommendation,
            'score': score,
            'reasons': reasons,
            'market_cap': market_cap,
            'daily_volume': volume
        }
