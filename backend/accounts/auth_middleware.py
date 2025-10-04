import urllib.parse
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from channels.middleware import BaseMiddleware
from django.db import close_old_connections
from django.contrib.auth import get_user_model
from jwt import InvalidTokenError
import jwt

User = get_user_model()

class JwtAuthMiddleware(BaseMiddleware):
    """
    Simple ASGI middleware that reads `?token=<access_token>` from the querystring
    and authenticates the user for WebSocket connections.
    """

    async def __call__(self, scope, receive, send):
        close_old_connections()
        query = scope.get("query_string", b"").decode()
        qs = urllib.parse.parse_qs(query)
        token_list = qs.get("token") or qs.get("access_token") or []

        if token_list:
            token = token_list[0]
            try:
                validated = UntypedToken(token)
                jwt_auth = JWTAuthentication()
                validated_user = jwt_auth.get_user(validated)
                scope["user"] = validated_user
            except Exception:
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)
