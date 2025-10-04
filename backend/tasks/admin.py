from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "status", "owner", "assignee", "deadline", "created_at")
    list_filter = ("status", "created_at", "deadline")
    search_fields = ("title", "description", "owner__username", "assignee__username")
    raw_id_fields = ("owner", "assignee")
