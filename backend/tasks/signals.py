from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Task
from .tasks import create_notification_task
import json

@receiver(post_save, sender=Task)
def task_post_save(sender, instance: Task, created, **kwargs):
    actor_id = None
    notif_type = "task_created" if created else "task_updated"
    message = f"Task '{instance.title}' {'created' if created else 'updated'}"
    data = {
        "id": instance.id,
        "title": instance.title,
        "status": instance.status,
    }
    create_notification_task.delay(instance.owner.id, notif_type, message=message, data=data, actor_id=actor_id)
    if instance.assignee and instance.assignee.id != instance.owner.id:
        create_notification_task.delay(instance.assignee.id, notif_type, message=message, data=data, actor_id=actor_id)

@receiver(post_delete, sender=Task)
def task_post_delete(sender, instance: Task, **kwargs):
    message = f"Task '{instance.title}' deleted"
    data = {"id": instance.id}
    create_notification_task.delay(instance.owner.id, "task_deleted", message=message, data=data)
    if instance.assignee and instance.assignee.id != instance.owner.id:
        create_notification_task.delay(instance.assignee.id, "task_deleted", message=message, data=data)
