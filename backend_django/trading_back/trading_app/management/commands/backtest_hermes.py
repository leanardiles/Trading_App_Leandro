"""
Django management command to backtest Hermes AI Trading Bot
Usage: python manage.py backtest_hermes [--bot-id BOT_ID] [--risk-level RISK] [--investment AMOUNT]
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal
import sys
import os

# Add parent directory to path to import backtest module
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))

from trading_app.backtest_hermes_bot import run_backtest_for_bot


class Command(BaseCommand):
    help = 'Backtest Hermes AI Trading Bot for 1 week'

    def add_arguments(self, parser):
        parser.add_argument(
            '--bot-id',
            type=int,
            help='ID of existing bot to backtest',
        )
        parser.add_argument(
            '--risk-level',
            type=str,
            choices=['LOW', 'MEDIUM', 'HIGH'],
            default='MEDIUM',
            help='Risk level for test bot (if not using --bot-id)',
        )
        parser.add_argument(
            '--investment',
            type=float,
            default=1000,
            help='Investment amount for test bot (if not using --bot-id)',
        )

    def handle(self, *args, **options):
        bot_id = options.get('bot_id')
        risk_level = options.get('risk_level')
        investment = options.get('investment')

        self.stdout.write(self.style.SUCCESS('\n' + '='*80))
        self.stdout.write(self.style.SUCCESS('HERMES AI TRADING BOT - 1 WEEK BACKTEST'))
        self.stdout.write(self.style.SUCCESS('='*80 + '\n'))

        try:
            results = run_backtest_for_bot(
                bot_id=bot_id,
                risk_level=risk_level,
                investment_amount=investment
            )

            if results:
                self.stdout.write(self.style.SUCCESS('\n✓ Backtest completed successfully!'))
                self.stdout.write(self.style.SUCCESS(f'Final ROI: {results["roi"]:.2f}%'))
                self.stdout.write(self.style.SUCCESS(f'Total Trades: {results["total_trades"]}'))
                self.stdout.write(self.style.SUCCESS(f'Win Rate: {results["win_rate"]:.2f}%'))
            else:
                self.stdout.write(self.style.ERROR('\n✗ Backtest failed!'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'\n✗ Error during backtest: {str(e)}'))
            import traceback
            self.stdout.write(self.style.ERROR(traceback.format_exc()))

