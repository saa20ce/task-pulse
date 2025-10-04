from rest_framework import permissions

class IsOwnerOrAssigneeOrReadOnly(permissions.BasePermission):
    """
    Allow safe methods for authenticated users.
    Allow write only for owner or assignee.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user or (obj.assignee and obj.assignee == request.user)
