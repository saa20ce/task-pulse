import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

class TaskConsumer(AsyncJsonWebsocketConsumer):
    """
    Websocket consumer to send task create/update/delete events to clients.
    Clients MUST connect with a valid JWT token in querystring: ?token=<access>
    """

    async def connect(self):
        user = self.scope.get("user")
        if not user or user.is_anonymous:
            await self.close()
            return

        self.user = user
        self.group_name = f"user_tasks_{user.id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send_json({"type": "connected", "message": "connected", "user_id": user.id})

    async def disconnect(self, close_code):
        try:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
        except Exception:
            pass

    async def receive_json(self, content, **kwargs):
        action = content.get("action")
        if action == "ping":
            await self.send_json({"type":"pong"})

    async def task_event(self, event):
        """
        Expected event example:
        {
          "type": "task.event",   # not used directly; channel_layer uses "type" to select method name
          "event": "created" | "updated" | "deleted",
          "payload": { ... }   # task object or id
        }
        We'll map to this method via group_send using "type": "task.event" -> calls task_event
        """
        await self.send_json({
            "type": "task",
            "event": event.get("event"),
            "payload": event.get("payload"),
        })

    async def notification_event(self, event):
        await self.send_json({
            "type": "notification",
            "event": event.get("event"),
            "payload": event.get("payload"),
        })
