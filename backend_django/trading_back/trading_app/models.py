from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
from decimal import Decimal


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser
    """
    balance = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0.00,
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="User's account balance"
    )
    realized_profit_loss = models.DecimalField( 
        max_digits=15, 
        decimal_places=2, 
        default=0.00,
        help_text="Total realized profit/loss from closed positions"
    )
    name = models.CharField(max_length=100, help_text="User's full name")
    email = models.EmailField(unique=True, help_text="User's email address")
    userid = models.CharField(
        max_length=50, 
        unique=True, 
        help_text="Unique user identifier (auto-generated)"
    )
    
    # Override the default username field to use email
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']  # userid is auto-generated, not required in form
    
    class Meta:
        db_table = 'trading_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def generate_userid(self):
        """
        Generate a unique user ID in format USER000001, USER000002, etc.
        """
        # Get all existing userids that match the USER### pattern
        existing_users = User.objects.filter(userid__startswith='USER').exclude(userid__isnull=True)
        
        if existing_users.exists():
            # Extract numbers from existing USER### userids and find the max
            max_number = 0
            for user in existing_users:
                try:
                    # Extract number from format USER######
                    number_str = user.userid.replace('USER', '').lstrip('0') or '0'
                    number = int(number_str)
                    if number > max_number:
                        max_number = number
                except (ValueError, AttributeError):
                    # Skip invalid formats
                    continue
            next_number = max_number + 1
        else:
            # No existing USER### userids, start from 1
            # But check if there are any users at all to avoid conflicts
            total_users = User.objects.count()
            next_number = total_users + 1
        
        # Format with zero padding (6 digits)
        userid = f"USER{next_number:06d}"
        
        # Double-check uniqueness (shouldn't happen, but safety check)
        while User.objects.filter(userid=userid).exists():
            next_number += 1
            userid = f"USER{next_number:06d}"
        
        return userid
    
    def save(self, *args, **kwargs):
        """
        Auto-generate userid if not provided
        """
        if not self.userid:
            self.userid = self.generate_userid()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.name} ({self.email})"


class Transaction(models.Model):
    """
    Model to track all financial transactions
    """
    TRANSACTION_TYPES = [
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
        ('buy', 'Buy Stock'),
        ('sell', 'Sell Stock'),
        ('dividend', 'Dividend'),
        ('fee', 'Fee'),
    ]
    
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='transactions',
        help_text="User who made the transaction"
    )
    transaction_type = models.CharField(
        max_length=20, 
        choices=TRANSACTION_TYPES,
        help_text="Type of transaction"
    )
    debit = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0.00,
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Amount debited from account"
    )
    credit = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0.00,
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Amount credited to account"
    )
    description = models.TextField(
        max_length=500,
        help_text="Transaction description"
    )
    date = models.DateTimeField(
        auto_now_add=True,
        help_text="Transaction date and time"
    )
    balance_after = models.DecimalField(
        max_digits=15, 
        decimal_places=2,
        help_text="Account balance after this transaction"
    )
    
    class Meta:
        db_table = 'trading_transaction'
        verbose_name = 'Transaction'
        verbose_name_plural = 'Transactions'
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.user.name} - {self.transaction_type} - ${self.credit - self.debit}"


class Holding(models.Model):
    """
    Model to track user's stock holdings
    """
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='holdings',
        help_text="User who owns the holding"
    )
    stock = models.CharField(
        max_length=10,
        help_text="Stock symbol (e.g., AAPL, GOOGL)"
    )
    quantity = models.PositiveIntegerField(
        help_text="Number of shares held"
    )
    buying_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Price per share when purchased"
    )
    current_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Current market price per share"
    )
    date_purchased = models.DateTimeField(
        auto_now_add=True,
        help_text="Date when stock was purchased"
    )
    
    class Meta:
        db_table = 'trading_holding'
        verbose_name = 'Holding'
        verbose_name_plural = 'Holdings'
        unique_together = ['user', 'stock']
        ordering = ['-date_purchased']
    
    @property
    def total_invested(self):
        """Calculate total amount invested in this holding"""
        return self.quantity * self.buying_price
    
    @property
    def current_value(self):
        """Calculate current market value of this holding"""
        return self.quantity * self.current_price
    
    @property
    def profit_loss(self):
        """Calculate profit or loss for this holding"""
        return self.current_value - self.total_invested
    
    @property
    def profit_loss_percentage(self):
        """Calculate profit/loss percentage"""
        if self.total_invested > 0:
            return (self.profit_loss / self.total_invested) * 100
        return 0
    
    def __str__(self):
        return f"{self.user.name} - {self.stock} ({self.quantity} shares)"

class PortfolioSnapshot(models.Model):
    """
    Model to track portfolio value over time for performance charts
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='portfolio_snapshots',
        help_text="User whose portfolio is being tracked"
    )
    timestamp = models.DateTimeField(
        auto_now_add=True,
        help_text="When this snapshot was taken"
    )
    total_value = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        help_text="Total portfolio value at this time (cash + holdings)"
    )
    cash_balance = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        help_text="Cash balance at this time"
    )
    holdings_value = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        help_text="Total value of all holdings at this time"
    )
    
    class Meta:
        db_table = 'portfolio_snapshot'
        verbose_name = 'Portfolio Snapshot'
        verbose_name_plural = 'Portfolio Snapshots'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', '-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.user.name} - ${self.total_value} at {self.timestamp}"


class StockSnapshot(models.Model):
    """
    Model to track individual stock performance over time
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='stock_snapshots',
        help_text="User who owns this stock"
    )
    stock = models.CharField(
        max_length=10,
        help_text="Stock symbol"
    )
    timestamp = models.DateTimeField(
        auto_now_add=True,
        help_text="When this snapshot was taken"
    )
    quantity = models.PositiveIntegerField(
        help_text="Number of shares at this time"
    )
    current_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Stock price at this time"
    )
    current_value = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        help_text="Total value (quantity × price)"
    )
    
    class Meta:
        db_table = 'stock_snapshot'
        verbose_name = 'Stock Snapshot'
        verbose_name_plural = 'Stock Snapshots'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'stock', '-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.user.name} - {self.stock} at {self.timestamp}"
    
class Signal(models.Model):
    """
    Trading signals for users
    """
    SIGNAL_TYPES = [
        ('index_addition', 'Index Addition'),
        ('index_removal', 'Index Removal'),
        ('price_target', 'Price Target Hit'),
        ('volume_spike', 'Volume Spike'),
    ]
    
    ACTION_TYPES = [
        ('buy', 'Buy'),
        ('sell', 'Sell'),
        ('hold', 'Hold'),
        ('watch', 'Watch'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='signals')
    stock = models.CharField(max_length=10, help_text="Stock ticker symbol")
    signal_type = models.CharField(max_length=50, choices=SIGNAL_TYPES)
    action = models.CharField(max_length=10, choices=ACTION_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    index_name = models.CharField(max_length=50, blank=True, null=True, help_text="NASDAQ 100, S&P 500, etc")
    current_price = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'trading_signal'
        ordering = ['-created_at']
        verbose_name = 'Signal'
        verbose_name_plural = 'Signals'
    
    def __str__(self):
        return f"{self.stock} - {self.title} ({self.action})"


class AutoTradingBot(models.Model):
    """
    Model to track automated trading bots
    """
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('PAUSED', 'Paused'),
        ('STOPPED', 'Stopped'),
        ('COMPLETED', 'Completed'),
    ]
    
    RISK_LEVEL_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
    ]
    
    DURATION_CHOICES = [
        ('SHORT', 'Short (1 week)'),
        ('MEDIUM', 'Medium (1 month)'),
        ('LONG', 'Long (3 months)'),
        ('CUSTOM', 'Custom'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='trading_bots',
        help_text="User who owns this bot"
    )
    name = models.CharField(
        max_length=100,
        help_text="Bot name"
    )
    risk_level = models.CharField(
        max_length=10,
        choices=RISK_LEVEL_CHOICES,
        help_text="Risk level: LOW, MEDIUM, HIGH"
    )
    duration = models.CharField(
        max_length=10,
        choices=DURATION_CHOICES,
        default='MEDIUM',
        help_text="Trading duration"
    )
    initial_capital = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        help_text="Initial investment amount"
    )
    current_capital = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0.00,
        help_text="Current capital value"
    )
    expected_return = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        help_text="Expected return percentage"
    )
    total_profit_loss = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0.00,
        help_text="Total profit/loss"
    )
    total_trades = models.PositiveIntegerField(
        default=0,
        help_text="Total number of trades executed"
    )
    winning_trades = models.PositiveIntegerField(
        default=0,
        help_text="Number of winning trades"
    )
    losing_trades = models.PositiveIntegerField(
        default=0,
        help_text="Number of losing trades"
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='ACTIVE',
        help_text="Bot status"
    )
    use_pivot = models.BooleanField(
        default=True,
        help_text="Use pivot point analysis"
    )
    use_prediction = models.BooleanField(
        default=True,
        help_text="Use next-day prediction"
    )
    use_screener = models.BooleanField(
        default=True,
        help_text="Use stock screener"
    )
    use_index_rebalancing = models.BooleanField(
        default=True,
        help_text="Use index rebalancing strategy"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When bot was created"
    )
    last_trade_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Last trade timestamp"
    )
    
    class Meta:
        db_table = 'auto_trading_bot'
        verbose_name = 'Auto Trading Bot'
        verbose_name_plural = 'Auto Trading Bots'
        ordering = ['-created_at']
    
    @property
    def roi_percentage(self):
        """Calculate ROI percentage"""
        if self.initial_capital > 0:
            return (self.total_profit_loss / self.initial_capital) * 100
        return 0
    
    @property
    def win_rate(self):
        """Calculate win rate percentage"""
        if self.total_trades > 0:
            return (self.winning_trades / self.total_trades) * 100
        return 0
    
    def __str__(self):
        return f"{self.name} - {self.user.name} ({self.status})"