from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import models
from django_filters.rest_framework import DjangoFilterBackend
from .models import Task, Notification
from .serializers import TaskSerializer, NotificationSerializer
from .permissions import IsOwnerOrAssigneeOrReadOnly
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


class TaskViewSet(viewsets.ModelViewSet):
    """
    CRUD for Task.
    - list: tasks where user is owner or assignee
    - create: owner set to request.user
    - update/partial_update/destroy: allowed for owner or assignee by permission class
    """
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAssigneeOrReadOnly]
    queryset = Task.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "assignee"]
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "deadline"]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(models.Q(owner=user) | models.Q(assignee=user)).distinct()

    def perform_create(self, serializer):
        obj = serializer.save(owner=self.request.user)
        channel_layer = get_channel_layer()
        payload = TaskSerializer(obj, context={"request": self.request}).data
        async_to_sync(channel_layer.group_send)(
            f"user_tasks_{obj.owner.id}",
            {"type": "task.event", "event": "created", "payload": payload}
        )
        if obj.assignee and obj.assignee.id != obj.owner.id:
            async_to_sync(channel_layer.group_send)(
                f"user_tasks_{obj.assignee.id}",
                {"type": "task.event", "event": "created", "payload": payload}
            )

    def perform_update(self, serializer):
        obj = serializer.save()
        channel_layer = get_channel_layer()
        payload = TaskSerializer(obj, context={"request": self.request}).data
        async_to_sync(channel_layer.group_send)(
            f"user_tasks_{obj.owner.id}",
            {"type": "task.event", "event": "updated", "payload": payload}
        )
        if obj.assignee and obj.assignee.id != obj.owner.id:
            async_to_sync(channel_layer.group_send)(
                f"user_tasks_{obj.assignee.id}",
                {"type": "task.event", "event": "updated", "payload": payload}
            )

	def perform_destroy(self, instance):
        owner_id = instance.owner.id
        task_id = instance.id
        instance.delete()
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_tasks_{owner_id}",
            {"type": "task.event", "event": "deleted", "payload": {"id": task_id}}
        )

class NotificationViewSet(mixins.ListModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by("-created_at")

    @action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        qs = self.get_queryset().filter(read=False)
        qs.update(read=True)
        return Response({"ok": True})