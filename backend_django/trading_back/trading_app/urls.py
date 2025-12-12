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

urlpatterns = [
    path('', include(router.urls)),
]

# ML Model endpoints
from django.urls import path, include as url_include
urlpatterns += [
    path('ml/', url_include('trading_app.ml_urls')),
]
