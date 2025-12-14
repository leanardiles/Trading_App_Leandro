# Index Rebalancing Trading Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Django](https://img.shields.io/badge/django-4.2-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/react-18-blue.svg)](https://reactjs.org/)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()

## 📊 Overview

A full-stack trading simulation platform with **real-time market data integration**, portfolio management, **trading signals**, and ML-powered trading strategies. Built with Django REST Framework (backend) and React (frontend), this platform provides a realistic trading experience with automatic price updates, comprehensive performance tracking, and intelligent buy/sell signals.

---

## ✨ Key Features

### 🎯 Core Trading Functionality
- **Real-Time Stock Prices** - Integration with Yahoo Finance API for live market data
- **Automatic Price Updates** - Holdings refresh every 30 seconds with current market prices
- **Interactive Price Charts** - Historical price visualization with multiple time periods (1D, 1W, 1M, 3M, 1Y, 5Y)
- **Smart Buy/Sell Interface** - Auto-fetch current prices before trading
- **Portfolio Management** - Track holdings, calculate P/L, monitor performance
- **Realized P/L Tracking** - Track actual profits/losses from closed positions

### 🔔 Trading Signals **[NEW - Dec 14, 2025]**
- **Index Addition Alerts** - Get notified when stocks enter NASDAQ 100 or S&P 500
- **Action Recommendations** - Buy, Sell, Watch, or Hold signals
- **Unread Badge Notifications** - Visual alerts in navigation menu
- **Signal Filtering** - Filter by All, Unread, Buy, Sell, Watch
- **Quick Trade Actions** - Buy directly from signal cards
- **Signal Management** - Mark as read or dismiss signals

### 📈 Performance Tracking
- **Historical Performance Charts** - Track portfolio value from purchase date forward
- **Individual Stock Analysis** - View performance of specific stocks
- **Automatic Snapshots** - System saves portfolio state every 30 seconds
- **Multiple Time Periods** - Analyze performance across different timeframes
- **Best/Worst Performers** - Identify top and bottom performing stocks
- **Unrealized vs Realized P/L** - Separate tracking for open and closed positions

### 🤖 ML Trading Strategies
- **Pivot Point Analysis** - Technical analysis for support/resistance levels
- **Next-Day Price Prediction** - ML-based price movement forecasting
- **Stock Screener** - Analyze stocks for index addition eligibility
- **Index Rebalancing Analysis** - Track index reconstitution events

### 👤 User Management
- **Custom User Authentication** - Token-based secure authentication
- **Account Balance Tracking** - Real-time balance updates
- **Transaction History** - Complete audit trail of all activities
- **Profile Management** - Update user information and preferences

---

See complete documentation in the file for installation, API endpoints, usage guide, and more!

**Recent Updates (Dec 14, 2025):**
- ✅ Trading Signals System with notifications
- ✅ Realized P/L tracking for closed positions
- ✅ Dashboard redesign with comprehensive metrics
- ✅ Improved navigation with better icons

**GitHub:** https://github.com/leanardiles/Trading_App_Leandro