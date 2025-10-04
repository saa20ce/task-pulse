from rest_framework import serializers
from .models import Task, Notification
from django.contrib.auth import get_user_model

try:
    from accounts.serializers import UserSerializer
except Exception:
    User = get_user_model()
    class UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ("id", "username", "email", "first_name", "last_name")

from django.contrib.auth import get_user_model
User = get_user_model()

class TaskSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    assignee = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "status",
            "deadline",
            "owner",
            "assignee",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "owner", "created_at", "updated_at"]

class NotificationSerializer(serializers.ModelSerializer):
    recipient = serializers.PrimaryKeyRelatedField(read_only=True)
    actor = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ["id", "recipient", "actor", "notif_type", "message", "data", "read", "created_at"]

    def get_actor(self, obj):
        if obj.actor:
            return {"id": obj.actor.id, "username": obj.actor.username}
        return None