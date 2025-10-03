from django.urls import path
from .views import RegisterView, me_view
from rest_framework_simplejwt.views import TokenRefreshView
from .auth_views import TokenObtainPairViewEmail

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("token/", TokenObtainPairViewEmail.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", me_view, name="me"),
]
