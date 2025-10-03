from django.contrib.auth.models import User
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
	password = serializers.CharField(write_only=True, min_legth=6)

	class Meta:
		model = User
		fields = ("id", "username", "email", "password", "first_name", "last_name")

	def create(self, validated_data):
		email = validated_data.get("email")
		username = validated_data.get("username") or email
		user = User.objects.create_user(
			username=username,
			email=email,
			password=validated_data["password"],
			first_name=validated_data.get("first_name", ""),
			last_name=validated_data.get("last_name", ""),
		)
		return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name")