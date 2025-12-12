"""
ML Model URLs
"""

from django.urls import path
from . import ml_views

urlpatterns = [
    path('pivot/', ml_views.pivot_analysis, name='ml-pivot'),
    path('predict/', ml_views.next_day_prediction, name='ml-predict'),
    path('screener/', ml_views.stock_screener_analysis, name='ml-screener'),
    path('index-event/', ml_views.index_rebalancing_analysis, name='ml-index-event'),
]
