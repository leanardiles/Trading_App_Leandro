"""
Next-Day Price Movement Predictor
"""

class NextDayPredictor:
    def __init__(self):
        self.name = "Next Day Predictor"
    
    def predict(self, stock_symbol, open_price, high, low, close, volume):
        """Predict next day price movement"""
        
        price_change = ((close - open_price) / open_price) * 100
        hl_range = ((high - low) / close) * 100
        
        score = 0
        
        # Bullish indicators
        if price_change > 2:
            score += 3
        elif price_change > 0:
            score += 1
        
        # Bearish indicators
        if price_change < -2:
            score -= 3
        elif price_change < 0:
            score -= 1
        
        # Volatility
        if hl_range > 5:
            score = score * 0.8
        
        # Generate prediction
        if score >= 2:
            prediction = 'UP'
            confidence = min(70 + (score * 5), 90)
        elif score <= -2:
            prediction = 'DOWN'
            confidence = min(70 + (abs(score) * 5), 90)
        else:
            prediction = 'NEUTRAL'
            confidence = 50
        
        return {
            'stock_symbol': stock_symbol,
            'prediction': prediction,
            'confidence': round(confidence, 1),
            'price_change_today': round(price_change, 2),
            'volatility': round(hl_range, 2),
            'recommendation': f"Expect price to move {prediction} with {confidence:.0f}% confidence"
        }
