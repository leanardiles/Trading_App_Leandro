#!/usr/bin/env python
"""
Simple test script to run Hermes Bot backtest
Can be run directly: python test_hermes_backtest.py
"""

import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'trading_back.settings')
django.setup()

from trading_app.backtest_hermes_bot import run_backtest_for_bot

if __name__ == '__main__':
    print("\n" + "="*80)
    print("HERMES AI TRADING BOT - 1 WEEK BACKTEST TEST")
    print("="*80 + "\n")
    
    # Test with MEDIUM risk level
    print("Running backtest with MEDIUM risk level, $1000 investment...")
    results = run_backtest_for_bot(
        bot_id=None,
        risk_level='MEDIUM',
        investment_amount=1000
    )
    
    if results:
        print("\n" + "="*80)
        print("BACKTEST SUMMARY")
        print("="*80)
        print(f"Initial Investment: ${1000:,.2f}")
        print(f"Final Value:        ${results['final_value']:,.2f}")
        print(f"Total Return:       ${results['total_return']:+,.2f}")
        print(f"ROI:                {results['roi']:+.2f}%")
        print(f"\nTrading Performance:")
        print(f"  Total Trades:     {results['total_trades']}")
        print(f"  Winning Trades:   {results['winning_trades']}")
        print(f"  Losing Trades:    {results['losing_trades']}")
        print(f"  Win Rate:         {results['win_rate']:.2f}%")
        print("="*80 + "\n")
        print("✓ Backtest completed successfully!")
    else:
        print("\n✗ Backtest failed!")

