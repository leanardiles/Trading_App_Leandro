"""
ML Model API Views
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .ml_models.pivot import PivotStrategy
from .ml_models.nextday_prediction import NextDayPredictor
from .ml_models.stock_screener import StockScreener
from .ml_models.index_rebalancing import IndexRebalancingStrategy

# Initialize ML models
pivot_strategy = PivotStrategy()
predictor = NextDayPredictor()
screener = StockScreener()
index_strategy = IndexRebalancingStrategy()


@api_view(['POST'])
@permission_classes([AllowAny])
def pivot_analysis(request):
    """
    Pivot Point Analysis
    POST /api/ml/pivot/
    Body: {"high": 150.0, "low": 145.0, "close": 148.0}
    """
    try:
        high = float(request.data.get('high'))
        low = float(request.data.get('low'))
        close = float(request.data.get('close'))
        
        result = pivot_strategy.predict(high, low, close)
        return Response(result, status=status.HTTP_200_OK)
    
    except (TypeError, ValueError) as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def next_day_prediction(request):
    """
    Next-Day Price Prediction
    POST /api/ml/predict/
    Body: {
        "stock_symbol": "AAPL",
        "open_price": 145.0,
        "high": 150.0,
        "low": 144.0,
        "close": 148.0,
        "volume": 1000000
    }
    """
    try:
        stock_symbol = request.data.get('stock_symbol')
        open_price = float(request.data.get('open_price'))
        high = float(request.data.get('high'))
        low = float(request.data.get('low'))
        close = float(request.data.get('close'))
        volume = int(request.data.get('volume'))
        
        result = predictor.predict(stock_symbol, open_price, high, low, close, volume)
        return Response(result, status=status.HTTP_200_OK)
    
    except (TypeError, ValueError) as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def stock_screener_analysis(request):
    """
    Stock Screener for Index Addition
    POST /api/ml/screener/
    Body: {
        "market_cap": 15000000000,
        "volume": 1200000,
        "sector": "Technology"
    }
    """
    try:
        market_cap = float(request.data.get('market_cap'))
        volume = int(request.data.get('volume'))
        sector = request.data.get('sector', 'Technology')
        
        result = screener.screen_for_index_addition(market_cap, volume, sector)
        return Response(result, status=status.HTTP_200_OK)
    
    except (TypeError, ValueError) as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def index_rebalancing_analysis(request):
    """
    Index Reconstitution Event Analysis
    POST /api/ml/index-event/
    Body: {
        "stock_symbol": "AAPL",
        "event_type": "ADD",
        "announcement_date": "2025-10-15",
        "effective_date": "2025-10-30",
        "current_price": 150.0,
        "index_name": "SP500"
    }
    """
    try:
        stock_symbol = request.data.get('stock_symbol')
        event_type = request.data.get('event_type')
        announcement_date = request.data.get('announcement_date')
        effective_date = request.data.get('effective_date')
        current_price = float(request.data.get('current_price'))
        index_name = request.data.get('index_name', 'SP500')
        
        result = index_strategy.analyze_event(
            stock_symbol, event_type, announcement_date,
            effective_date, current_price, index_name
        )
        return Response(result, status=status.HTTP_200_OK)
    
    except (TypeError, ValueError) as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
