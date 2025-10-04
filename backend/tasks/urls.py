from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, NotificationViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r"tasks", TaskViewSet, basename="tasks")
router.register(r"notifications", NotificationViewSet, basename="notifications")


urlpatterns = [
    path("", include(router.urls)),
]
