# accounts/auth_views.py
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers

class EmailOrUsernameTokenSerializer(TokenObtainPairSerializer):
    username_field = 'username'

    def validate(self, attrs):
        username_or_email = attrs.get("username")
        password = attrs.get("password")

        user = authenticate(username=username_or_email, password=password)
        if not user:
            try:
                u = User.objects.get(email__iexact=username_or_email)
                user = authenticate(username=u.username, password=password)
            except User.DoesNotExist:
                user = None

        if not user:
            raise serializers.ValidationError("No active account found with the given credentials")

        data = super().get_token(user)
        refresh = str(data)
        access = str(data.access_token)

        return {
            "refresh": refresh,
            "access": access,
        }

class TokenObtainPairViewEmail(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenSerializer
