from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from decimal import Decimal
from .models import AutoTradingBot
from .auto_trading_engine import AutoTradingEngine
from .serializers import AutoTradingBotSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_herm_bot(request):
    """
    Create Herm_trades AI bot
    Inputs: duration_weeks, risk_level, investment_amount
    """
    try:
        user = request.user
        data = request.data
        
        duration_weeks = int(data.get('duration_weeks', 4))
        risk_level = data.get('risk_level', 'MEDIUM').upper()
        investment_amount = Decimal(str(data.get('investment_amount', 1000)))
        
        if risk_level not in ['LOW', 'MEDIUM', 'HIGH']:
            return Response({
                'error': 'risk_level must be LOW, MEDIUM, or HIGH'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if investment_amount > user.balance:
            return Response({
                'error': f'Insufficient balance. Available: ${user.balance}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if investment_amount < 100:
            return Response({
                'error': 'Minimum investment is $100'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        config = AutoTradingEngine.RISK_CONFIG[risk_level]
        expected_monthly_return = config['expected_monthly_return']
        expected_return_pct = expected_monthly_return * (Decimal(str(duration_weeks)) / Decimal('4'))
        expected_profit = investment_amount * (expected_return_pct / Decimal('100'))
        expected_final_amount = investment_amount + expected_profit
        
        bot = AutoTradingBot.objects.create(
            user=user,
            name=f"Herm_{risk_level}_{duration_weeks}w",
            risk_level=risk_level,
            duration='CUSTOM',
            initial_capital=investment_amount,
            current_capital=investment_amount,
            expected_return=expected_return_pct,
            use_pivot=True,
            use_prediction=True,
            use_screener=True,
            use_index_rebalancing=True,
            status='ACTIVE'
        )
        
        user.balance -= investment_amount
        user.save()
        
        return Response({
            'message': 'Herm_trades bot created successfully',
            'bot_id': bot.id,
            'bot_name': bot.name,
            'investment': float(investment_amount),
            'duration_weeks': duration_weeks,
            'risk_level': risk_level,
            'expected_return_percentage': float(expected_return_pct),
            'expected_profit': float(expected_profit),
            'expected_final_amount': float(expected_final_amount),
            'stocks_watchlist': config['stocks'],
            'risk_settings': {
                'stop_loss': f"{config['stop_loss']*100}%",
                'take_profit': f"{config['take_profit']*100}%",
                'max_position_size': f"{config['max_position_size']*100}%"
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_herm_bot_status(request, bot_id):
    """Get Herm bot current status and performance"""
    try:
        bot = AutoTradingBot.objects.get(id=bot_id, user=request.user)
        
        return Response({
            'bot_id': bot.id,
            'name': bot.name,
            'status': bot.status,
            'initial_investment': float(bot.initial_capital),
            'current_value': float(bot.current_capital),
            'profit_loss': float(bot.total_profit_loss),
            'roi_percentage': float(bot.roi_percentage),
            'total_trades': bot.total_trades,
            'winning_trades': bot.winning_trades,
            'losing_trades': bot.losing_trades,
            'win_rate': float(bot.win_rate),
            'created_at': bot.created_at,
            'last_trade': bot.last_trade_at
        })
    except AutoTradingBot.DoesNotExist:
        return Response({
            'error': 'Bot not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_herm_bots(request):
    """List all Herm bots for the current user"""
    try:
        bots = AutoTradingBot.objects.filter(user=request.user).order_by('-created_at')
        serializer = AutoTradingBotSerializer(bots, many=True)
        return Response({
            'bots': serializer.data,
            'count': len(serializer.data)
        })
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

