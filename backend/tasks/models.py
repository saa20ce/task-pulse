from django.db import models
from django.conf import settings

class Task(models.Model):
    STATUS_TODO = "todo"
    STATUS_IN_PROGRESS = "in_progress"
    STATUS_DONE = "done"

    STATUS_CHOICES = [
        (STATUS_TODO, "To Do"),
        (STATUS_IN_PROGRESS, "In Progress"),
        (STATUS_DONE, "Done"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_TODO)
    deadline = models.DateTimeField(null=True, blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="tasks", on_delete=models.CASCADE)
    assignee = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="assigned_tasks", null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["owner"]),
            models.Index(fields=["assignee"]),
        ]

    def __str__(self):
        return f"{self.title} ({self.status})"

class Notification(models.Model):
    TYPE_TASK_CREATED = "task_created"
    TYPE_TASK_UPDATED = "task_updated"
    TYPE_TASK_DELETED = "task_deleted"
    TYPE_DEADLINE = "deadline_reminder"

    TYPE_CHOICES = [
        (TYPE_TASK_CREATED, "Task created"),
        (TYPE_TASK_UPDATED, "Task updated"),
        (TYPE_TASK_DELETED, "Task deleted"),
        (TYPE_DEADLINE, "Deadline reminder"),
    ]

    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="notifications", on_delete=models.CASCADE)
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, related_name="actor_notifications", on_delete=models.SET_NULL)
    notif_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    message = models.TextField(blank=True)
    data = models.JSONField(null=True, blank=True)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Notif {self.notif_type} -> {self.recipient_id}"