from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router and register viewsets
router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'transactions', views.TransactionViewSet, basename='transaction')
router.register(r'holdings', views.HoldingViewSet, basename='holding')
router.register(r'portfolio', views.PortfolioViewSet, basename='portfolio')
router.register(r'trading', views.TradingViewSet, basename='trading')
router.register(r'portfolio-snapshots', views.PortfolioSnapshotViewSet, basename='portfolio-snapshot')
router.register(r'signals', views.SignalViewSet, basename='signal')



urlpatterns = [
    path('', include(router.urls)),
]

# ML Model endpoints
from django.urls import path, include as url_include
urlpatterns += [
    path('ml/', url_include('trading_app.ml_urls')),
]

# Hermes Trading Bot endpoints
from . import herm_trades
urlpatterns += [
    path('herm/create/', herm_trades.create_herm_bot, name='create_herm_bot'),
    path('herm/<int:bot_id>/status/', herm_trades.get_herm_bot_status, name='herm_bot_status'),
    path('herm/list/', herm_trades.list_herm_bots, name='list_herm_bots'),
]
