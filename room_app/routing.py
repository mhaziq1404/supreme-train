from django.urls import path
from .consumer import *

websocket_urlpatterns = [
    path('ws/api/room/<str:room_id>/', RoomConsumer.as_asgi()),
]
