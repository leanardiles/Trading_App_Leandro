from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Transaction, Holding


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """
    Custom admin interface for User model
    """
    list_display = ('email', 'name', 'userid', 'balance', 'is_active', 'date_joined')
    list_filter = ('is_active', 'is_staff', 'date_joined')
    search_fields = ('email', 'name', 'userid')
    ordering = ('email',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name', 'userid', 'balance')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2'),
            'description': 'Note: User ID will be auto-generated if not provided.',
        }),
    )


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    """
    Admin interface for Transaction model
    """
    list_display = ('user', 'transaction_type', 'debit', 'credit', 'balance_after', 'date')
    list_filter = ('transaction_type', 'date', 'user')
    search_fields = ('user__name', 'user__email', 'description')
    readonly_fields = ('date', 'balance_after')
    ordering = ('-date',)
    
    fieldsets = (
        ('Transaction Details', {
            'fields': ('user', 'transaction_type', 'description')
        }),
        ('Amounts', {
            'fields': ('debit', 'credit', 'balance_after')
        }),
        ('Timing', {
            'fields': ('date',)
        }),
    )


@admin.register(Holding)
class HoldingAdmin(admin.ModelAdmin):
    """
    Admin interface for Holding model
    """
    list_display = ('user', 'stock', 'quantity', 'buying_price', 'current_price', 'profit_loss', 'profit_loss_percentage')
    list_filter = ('stock', 'date_purchased', 'user')
    search_fields = ('user__name', 'user__email', 'stock')
    readonly_fields = ('total_invested', 'current_value', 'profit_loss', 'profit_loss_percentage', 'date_purchased')
    ordering = ('-date_purchased',)
    
    fieldsets = (
        ('Holding Details', {
            'fields': ('user', 'stock', 'quantity')
        }),
        ('Pricing', {
            'fields': ('buying_price', 'current_price', 'date_purchased')
        }),
        ('Calculated Values', {
            'fields': ('total_invested', 'current_value', 'profit_loss', 'profit_loss_percentage'),
            'classes': ('collapse',)
        }),
    )
