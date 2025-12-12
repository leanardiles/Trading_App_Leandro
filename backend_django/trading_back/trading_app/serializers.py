from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Transaction, Holding


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model
    """
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'name', 'userid', 'balance', 'is_active', 'date_joined', 'last_login', 'password', 'password_confirm']
        read_only_fields = ['id', 'date_joined', 'last_login']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'name', 'password', 'password_confirm']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
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
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        email = validated_data.pop('email')
        username = validated_data.pop('username')
        name = validated_data.pop('name')
        
        # Auto-generate userid
        userid = self.generate_userid()
        
        # create_user signature: create_user(username, email=None, password=None, **extra_fields)
        # username must be first positional argument, not keyword
        user = User.objects.create_user(
            username,  # First positional arg (required)
            email=email,
            password=password,
            name=name,
            userid=userid,
            **validated_data
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login
    """
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include email and password')


class TransactionSerializer(serializers.ModelSerializer):
    """
    Serializer for Transaction model
    """
    user_name = serializers.CharField(source='user.name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'user_name', 'user_email', 'transaction_type', 'debit', 'credit', 'description', 'date', 'balance_after']
        read_only_fields = ['id', 'date', 'balance_after']
    
    def create(self, validated_data):
        # Calculate balance_after based on user's current balance
        user = validated_data['user']
        current_balance = user.balance
        
        # Update user balance
        net_amount = validated_data['credit'] - validated_data['debit']
        user.balance += net_amount
        user.save()
        
        # Set balance_after
        validated_data['balance_after'] = user.balance
        
        return super().create(validated_data)


class TransactionCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating transactions (simplified)
    """
    description = serializers.CharField(required=True, allow_blank=False)
    
    class Meta:
        model = Transaction
        fields = ['transaction_type', 'debit', 'credit', 'description']
    
    def validate(self, attrs):
        # Ensure description is not empty
        if not attrs.get('description') or not attrs['description'].strip():
            raise serializers.ValidationError({
                'description': 'Description is required and cannot be empty.'
            })
        
        # Ensure at least one of debit or credit is greater than 0
        debit = attrs.get('debit', 0)
        credit = attrs.get('credit', 0)
        if debit == 0 and credit == 0:
            raise serializers.ValidationError({
                'error': 'Either debit or credit amount must be greater than 0.'
            })
        
        transaction_type = attrs.get('transaction_type')
        
        # Validate transaction type logic
        if transaction_type == 'deposit':
            # Deposits should have credit > 0 and debit = 0
            if credit <= 0:
                raise serializers.ValidationError({
                    'credit': 'Credit amount must be greater than 0 for deposits.'
                })
            if debit > 0:
                raise serializers.ValidationError({
                    'debit': 'Debit should be 0 for deposits.'
                })
        elif transaction_type == 'withdrawal':
            # Withdrawals should have debit > 0 and credit = 0
            if debit <= 0:
                raise serializers.ValidationError({
                    'debit': 'Debit amount must be greater than 0 for withdrawals.'
                })
            if credit > 0:
                raise serializers.ValidationError({
                    'credit': 'Credit should be 0 for withdrawals.'
                })
        elif transaction_type in ['buy', 'sell']:
            # Buy/sell transactions should follow their respective logic
            if transaction_type == 'buy' and debit <= 0:
                raise serializers.ValidationError({
                    'debit': 'Debit amount must be greater than 0 for buy transactions.'
                })
            if transaction_type == 'sell' and credit <= 0:
                raise serializers.ValidationError({
                    'credit': 'Credit amount must be greater than 0 for sell transactions.'
                })
        
        return attrs
    
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        
        # Calculate balance_after based on user's current balance
        current_balance = user.balance
        net_amount = validated_data['credit'] - validated_data['debit']
        new_balance = user.balance + net_amount
        
        transaction_type = validated_data['transaction_type']
        
        # Validate that balance won't go negative
        # Deposits, dividends, and sell transactions always add money (net_amount >= 0), so always allow them
        # Only check balance for transactions that reduce balance: withdrawals, buy transactions, and fees
        # IMPORTANT: Deposits should NEVER be blocked - they always increase balance
        if transaction_type not in ['deposit', 'dividend', 'sell'] and new_balance < 0:
            # Only block transactions that reduce balance if they would make it negative
            raise serializers.ValidationError({
                'error': 'Insufficient balance',
                'current_balance': float(user.balance),
                'required': float(abs(net_amount))
            })
        
        user.balance = new_balance
        user.save()
        
        # Set balance_after
        validated_data['balance_after'] = user.balance
        
        return super().create(validated_data)


class HoldingSerializer(serializers.ModelSerializer):
    """
    Serializer for Holding model
    """
    user_name = serializers.CharField(source='user.name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    total_invested = serializers.ReadOnlyField()
    current_value = serializers.ReadOnlyField()
    profit_loss = serializers.ReadOnlyField()
    profit_loss_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = Holding
        fields = ['id', 'user', 'user_name', 'user_email', 'stock', 'quantity', 'buying_price', 'current_price', 'date_purchased', 'total_invested', 'current_value', 'profit_loss', 'profit_loss_percentage']
        read_only_fields = ['id', 'date_purchased']


class HoldingCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating holdings (simplified)
    """
    class Meta:
        model = Holding
        fields = ['stock', 'quantity', 'buying_price', 'current_price']
    
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)


class PortfolioSummarySerializer(serializers.Serializer):
    """
    Serializer for portfolio summary
    """
    total_balance = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_invested = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_current_value = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_profit_loss = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_profit_loss_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)
    holdings_count = serializers.IntegerField()
    transactions_count = serializers.IntegerField()
