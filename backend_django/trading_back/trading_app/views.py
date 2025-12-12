from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from django.db.models import Sum, Count
from decimal import Decimal, ROUND_HALF_UP
from .models import User, Transaction, Holding
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    TransactionSerializer, TransactionCreateSerializer,
    HoldingSerializer, HoldingCreateSerializer, PortfolioSummarySerializer
)


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for User model
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can only see their own profile unless they're staff
        if self.request.user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """
        User registration endpoint
        POST /api/users/register/
        """
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key,
                'message': 'User registered successfully'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """
        User login endpoint
        POST /api/users/login/
        """
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key,
                'message': 'Login successful'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """
        User logout endpoint
        POST /api/users/logout/
        """
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except:
            return Response({'message': 'Logout failed'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def profile(self, request):
        """
        Get current user profile
        GET /api/users/profile/
        """
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'], permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        """
        Update current user profile
        PUT/PATCH /api/users/update_profile/
        """
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Transaction model
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can only see their own transactions unless they're staff
        if self.request.user.is_staff:
            return Transaction.objects.all()
        return Transaction.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TransactionCreateSerializer
        return TransactionSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """
        Get transactions filtered by type
        GET /api/transactions/by_type/?type=deposit
        """
        transaction_type = request.query_params.get('type')
        if transaction_type:
            queryset = self.get_queryset().filter(transaction_type=transaction_type)
        else:
            queryset = self.get_queryset()
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """
        Get recent transactions (last 10)
        GET /api/transactions/recent/
        """
        queryset = self.get_queryset()[:10]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """
        Get transaction summary
        GET /api/transactions/summary/
        """
        queryset = self.get_queryset()
        
        total_debits = queryset.aggregate(total=Sum('debit'))['total'] or Decimal('0.00')
        total_credits = queryset.aggregate(total=Sum('credit'))['total'] or Decimal('0.00')
        transaction_count = queryset.count()
        
        return Response({
            'total_debits': total_debits,
            'total_credits': total_credits,
            'net_amount': total_credits - total_debits,
            'transaction_count': transaction_count,
            'current_balance': request.user.balance
        })


class HoldingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Holding model
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can only see their own holdings unless they're staff
        if self.request.user.is_staff:
            return Holding.objects.all()
        return Holding.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return HoldingCreateSerializer
        return HoldingSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def by_stock(self, request):
        """
        Get holdings filtered by stock symbol
        GET /api/holdings/by_stock/?stock=AAPL
        """
        stock = request.query_params.get('stock')
        if stock:
            queryset = self.get_queryset().filter(stock__iexact=stock)
        else:
            queryset = self.get_queryset()
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def profitable(self, request):
        """
        Get only profitable holdings
        GET /api/holdings/profitable/
        """
        queryset = self.get_queryset().extra(
            where=["(quantity * current_price) > (quantity * buying_price)"]
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def losing(self, request):
        """
        Get only losing holdings
        GET /api/holdings/losing/
        """
        queryset = self.get_queryset().extra(
            where=["(quantity * current_price) < (quantity * buying_price)"]
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """
        Get holdings summary
        GET /api/holdings/summary/
        """
        queryset = self.get_queryset()
        
        # Ensure Decimal types
        total_invested = sum((holding.total_invested for holding in queryset), Decimal('0.00'))
        total_current_value = sum((holding.current_value for holding in queryset), Decimal('0.00'))
        total_profit_loss = total_current_value - total_invested
        
        # Calculate percentage as Decimal
        if total_invested > Decimal('0.00'):
            total_profit_loss_percentage = (total_profit_loss / total_invested) * Decimal('100.00')
            total_profit_loss_percentage = Decimal(str(round(total_profit_loss_percentage, 2)))
        else:
            total_profit_loss_percentage = Decimal('0.00')
        
        return Response({
            'total_invested': total_invested,
            'total_current_value': total_current_value,
            'total_profit_loss': total_profit_loss,
            'total_profit_loss_percentage': total_profit_loss_percentage,
            'holdings_count': queryset.count()
        })


class PortfolioViewSet(viewsets.ViewSet):
    """
    ViewSet for portfolio-related operations
    """
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """
        Get complete portfolio summary
        GET /api/portfolio/summary/
        """
        user = request.user
        holdings = Holding.objects.filter(user=user)
        transactions = Transaction.objects.filter(user=user)
        
        # Calculate holdings totals - ensure Decimal types
        total_invested = Decimal('0.00')
        total_current_value = Decimal('0.00')
        
        for holding in holdings:
            try:
                invested = Decimal(str(holding.total_invested)) if holding.total_invested else Decimal('0.00')
                current = Decimal(str(holding.current_value)) if holding.current_value else Decimal('0.00')
                total_invested += invested
                total_current_value += current
            except (ValueError, TypeError, AttributeError):
                # Skip invalid holdings
                continue
        
        total_profit_loss = total_current_value - total_invested
        
        # Calculate percentage as Decimal
        try:
            if total_invested > Decimal('0.00'):
                total_profit_loss_percentage = (total_profit_loss / total_invested) * Decimal('100.00')
            else:
                total_profit_loss_percentage = Decimal('0.00')
        except (ValueError, TypeError, ZeroDivisionError):
            total_profit_loss_percentage = Decimal('0.00')
        
        # Ensure all values are Decimal objects and valid
        try:
            total_balance = Decimal(str(user.balance)) if user.balance is not None else Decimal('0.00')
        except (ValueError, TypeError, AttributeError):
            total_balance = Decimal('0.00')
        
        # Helper function to safely quantize Decimal values
        def safe_quantize(value):
            """Safely quantize a Decimal value, handling NaN and Infinity"""
            try:
                if not isinstance(value, Decimal):
                    value = Decimal(str(value)) if value is not None else Decimal('0.00')
                # Check for invalid Decimal values
                if value.is_nan() or value.is_infinite():
                    return Decimal('0.00')
                quantize_context = Decimal('0.01')
                return value.quantize(quantize_context, rounding=ROUND_HALF_UP)
            except (ValueError, TypeError, AttributeError, Exception):
                return Decimal('0.00')
        
        # Ensure all Decimal values are valid and quantized to 2 decimal places
        total_invested = safe_quantize(total_invested)
        total_current_value = safe_quantize(total_current_value)
        total_profit_loss = safe_quantize(total_profit_loss)
        total_profit_loss_percentage = safe_quantize(total_profit_loss_percentage)
        total_balance = safe_quantize(total_balance)
        
        data = {
            'total_balance': total_balance,
            'total_invested': total_invested,
            'total_current_value': total_current_value,
            'total_profit_loss': total_profit_loss,
            'total_profit_loss_percentage': total_profit_loss_percentage,
            'holdings_count': holdings.count(),
            'transactions_count': transactions.count()
        }
        
        serializer = PortfolioSummarySerializer(data=data)
        if serializer.is_valid():
            return Response(serializer.data)
        else:
            # Fallback: return data directly if serializer validation fails
            return Response(data)
    
    @action(detail=False, methods=['get'])
    def performance(self, request):
        """
        Get portfolio performance metrics
        GET /api/portfolio/performance/
        """
        user = request.user
        holdings = Holding.objects.filter(user=user)
        
        if not holdings.exists():
            return Response({
                'message': 'No holdings found',
                'total_return': 0,
                'best_performer': None,
                'worst_performer': None
            })
        
        # Calculate performance metrics
        performance_data = []
        for holding in holdings:
            performance_data.append({
                'stock': holding.stock,
                'profit_loss': float(holding.profit_loss),
                'profit_loss_percentage': float(holding.profit_loss_percentage)
            })
        
        # Sort by performance
        performance_data.sort(key=lambda x: x['profit_loss_percentage'], reverse=True)
        
        total_return = sum(item['profit_loss'] for item in performance_data)
        
        return Response({
            'total_return': total_return,
            'best_performer': performance_data[0] if performance_data else None,
            'worst_performer': performance_data[-1] if performance_data else None,
            'all_performances': performance_data
        })


class TradingViewSet(viewsets.ViewSet):
    """
    ViewSet for integrated trading operations (buy/sell)
    """
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def buy(self, request):
        """
        Buy stock - creates transaction and holding automatically
        POST /api/trading/buy/
        Body: {
            "stock": "AAPL",
            "quantity": 10,
            "price": 150.00
        }
        """
        stock = request.data.get('stock', '').upper().strip()
        quantity = int(request.data.get('quantity', 0))
        price = Decimal(str(request.data.get('price', 0)))
        
        if not stock or quantity <= 0 or price <= 0:
            return Response(
                {'error': 'Invalid stock symbol, quantity, or price'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = request.user
        total_cost = quantity * price
        
        # Check if user has sufficient balance
        if user.balance < total_cost:
            return Response(
                {
                    'error': 'Insufficient balance',
                    'required': float(total_cost),
                    'available': float(user.balance)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update user balance
        user.balance -= total_cost
        user.save()
        
        # Create buy transaction
        transaction = Transaction.objects.create(
            user=user,
            transaction_type='buy',
            debit=total_cost,
            credit=Decimal('0.00'),
            description=f"Bought {quantity} shares of {stock} at ${price} per share",
            balance_after=user.balance
        )
        
        # Create or update holding
        holding, created = Holding.objects.get_or_create(
            user=user,
            stock=stock,
            defaults={
                'quantity': quantity,
                'buying_price': price,
                'current_price': price,
            }
        )
        
        if not created:
            # Update existing holding with weighted average price
            total_shares = holding.quantity + quantity
            total_cost_existing = holding.quantity * holding.buying_price
            total_cost_new = quantity * price
            weighted_avg_price = (total_cost_existing + total_cost_new) / total_shares
            
            holding.quantity = total_shares
            holding.buying_price = weighted_avg_price
            holding.current_price = price  # Update current price
            holding.save()
        
        return Response({
            'message': f'Successfully bought {quantity} shares of {stock}',
            'transaction_id': transaction.id,
            'holding_id': holding.id,
            'new_balance': float(user.balance),
            'total_cost': float(total_cost)
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'])
    def sell(self, request):
        """
        Sell stock - creates transaction and updates/removes holding
        POST /api/trading/sell/
        Body: {
            "stock": "AAPL",
            "quantity": 5,
            "price": 155.00
        }
        """
        stock = request.data.get('stock', '').upper().strip()
        quantity = int(request.data.get('quantity', 0))
        price = Decimal(str(request.data.get('price', 0)))
        
        if not stock or quantity <= 0 or price <= 0:
            return Response(
                {'error': 'Invalid stock symbol, quantity, or price'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = request.user
        
        # Check if user has the holding
        try:
            holding = Holding.objects.get(user=user, stock=stock)
        except Holding.DoesNotExist:
            return Response(
                {'error': f'You do not own any shares of {stock}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user has enough shares
        if holding.quantity < quantity:
            return Response(
                {
                    'error': 'Insufficient shares',
                    'required': quantity,
                    'available': holding.quantity
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        total_proceeds = quantity * price
        
        # Update user balance
        user.balance += total_proceeds
        user.save()
        
        # Create sell transaction
        transaction = Transaction.objects.create(
            user=user,
            transaction_type='sell',
            debit=Decimal('0.00'),
            credit=total_proceeds,
            description=f"Sold {quantity} shares of {stock} at ${price} per share",
            balance_after=user.balance
        )
        
        # Update or remove holding
        if holding.quantity == quantity:
            # Selling all shares, delete holding
            holding.delete()
            holding_id = None
        else:
            # Selling partial shares, update quantity
            holding.quantity -= quantity
            holding.current_price = price  # Update current price
            holding.save()
            holding_id = holding.id
        
        return Response({
            'message': f'Successfully sold {quantity} shares of {stock}',
            'transaction_id': transaction.id,
            'holding_id': holding_id,
            'new_balance': float(user.balance),
            'total_proceeds': float(total_proceeds)
        }, status=status.HTTP_200_OK)