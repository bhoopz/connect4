from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/player/room/(?P<roomCode>\w+)/$',
            consumers.RoomConsumer.as_asgi()),
    re_path(r'ws/computer/(?P<level>\w+)/$', consumers.GameConsumer.as_asgi()),
]
