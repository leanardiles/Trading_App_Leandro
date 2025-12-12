"""
Create Sample Trading Data for Presentation
Simulates 1 week of trading using ML strategies
"""

import os
import django
import sys

# Setup Django
sys.path.append('/Users/leon/Desktop/index_rebalancing_trading_platiform_backend/trading_back')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'trading_back.settings')
django.setup()

from trading_app.models import User, Transaction, Holding
from decimal import Decimal
from datetime import datetime, timedelta

# Create demo user
user, created = User.objects.get_or_create(
    email='trader@demo.com',
    defaults={
        'username': 'demo_trader',
        'name': 'Demo Trader',
        'userid': 'DEMO001',
        'balance': Decimal('100000.00')
    }
)

if created:
    user.set_password('demo123')
    user.save()
    print(f"✅ Created demo user: {user.email}")
else:
    print(f"✅ Demo user already exists: {user.email}")

# Sample trades based on ML recommendations
sample_trades = [
    {
        'stock': 'NVDA',
        'strategy': 'Index Rebalancing - S&P 500 Addition',
        'action': 'BUY',
        'quantity': 10,
        'buying_price': Decimal('450.00'),
        'current_price': Decimal('468.50'),  # +4.1% gain after 1 week
    },
    {
        'stock': 'AAPL',
        'strategy': 'Pivot Point Strategy',
        'action': 'BUY',
        'quantity': 20,
        'buying_price': Decimal('148.00'),
        'current_price': Decimal('152.30'),  # +2.9% gain
    },
    {
        'stock': 'TSLA',
        'strategy': 'Next-Day Predictor',
        'action': 'BUY',
        'quantity': 15,
        'buying_price': Decimal('242.00'),
        'current_price': Decimal('239.80'),  # -0.9% loss
    },
    {
        'stock': 'GOOGL',
        'strategy': 'Stock Screener - Index Candidate',
        'action': 'BUY',
        'quantity': 25,
        'buying_price': Decimal('138.50'),
        'current_price': Decimal('141.20'),  # +1.9% gain
    },
]

# Create holdings and transactions
for trade in sample_trades:
    # Create holding
    holding, created = Holding.objects.get_or_create(
        user=user,
        stock=trade['stock'],
        defaults={
            'quantity': trade['quantity'],
            'buying_price': trade['buying_price'],
            'current_price': trade['current_price'],
        }
    )
    
    if created:
        # Create buy transaction
        cost = trade['quantity'] * trade['buying_price']
        user.balance -= cost
        user.save()
        
        Transaction.objects.create(
            user=user,
            transaction_type='buy',
            debit=cost,
            credit=Decimal('0.00'),
            description=f"Bought {trade['quantity']} shares of {trade['stock']} using {trade['strategy']}",
            balance_after=user.balance
        )
        
        print(f"✅ Created holding: {trade['stock']} - {trade['quantity']} shares")
    else:
        print(f"⚠️  Holding already exists: {trade['stock']}")

# Calculate portfolio performance
total_invested = sum(h.total_invested for h in user.holdings.all())
total_current = sum(h.current_value for h in user.holdings.all())
total_profit = total_current - total_invested
profit_pct = (total_profit / total_invested) * 100

print("\n" + "="*50)
print("📊 PORTFOLIO SUMMARY (1-Week Results)")
print("="*50)
print(f"Cash Balance: ${user.balance:,.2f}")
print(f"Total Invested: ${total_invested:,.2f}")
print(f"Current Value: ${total_current:,.2f}")
print(f"Total P/L: ${total_profit:,.2f} ({profit_pct:+.2f}%)")
print(f"Holdings: {user.holdings.count()} stocks")
print("="*50)

# Show individual holding performance
print("\n📈 INDIVIDUAL HOLDINGS:")
for holding in user.holdings.all():
    print(f"  {holding.stock}: {holding.quantity} shares @ ${holding.buying_price} → ${holding.current_price}")
    print(f"    P/L: ${holding.profit_loss:+,.2f} ({holding.profit_loss_percentage:+.2f}%)")

print("\n✅ Sample data created successfully!")
print(f"\n🔑 Login with:")
print(f"   Email: trader@demo.com")
print(f"   Password: demo123")
