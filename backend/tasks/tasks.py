from celery import shared_task
from django.contrib.auth import get_user_model
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Task, Notification
from .serializers import NotificationSerializer, TaskSerializer
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@shared_task
def create_notification_task(recipient_id, notif_type, message="", data=None, actor_id=None):
    try:
        recipient = User.objects.get(pk=recipient_id)
    except User.DoesNotExist:
        logger.warning("Recipient %s does not exist", recipient_id)
        return

    actor = None
    if actor_id:
        try:
            actor = User.objects.get(pk=actor_id)
        except User.DoesNotExist:
            actor = None

    notif = Notification.objects.create(
        recipient=recipient,
        actor=actor,
        notif_type=notif_type,
        message=message or "",
        data=data or {}
    )

    channel_layer = get_channel_layer()
    payload = NotificationSerializer(notif).data
    group = f"user_tasks_{recipient.id}"
    try:
        async_to_sync(channel_layer.group_send)(
            group,
            {"type": "notification.event", "event": "notification_created", "payload": payload}
        )
    except Exception as e:
        logger.exception("Failed to send notification to channel layer: %s", e)

    logger.info("Created notification %s for user %s", notif.id, recipient.id)
