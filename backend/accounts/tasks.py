from celery import shared_task
from django.contrib.auth.models import User
import logging

logger = logging.getLogger(__name__)

@shared_task
def example_task_send_welcome_email(user_id):
    try:
        user = User.objects.get(pk=user_id)
        logger.info("Send welcome email to %s (%s)", user.username, user.email)
    except User.DoesNotExist:
        logger.warning("User %s does not exist", user_id)
