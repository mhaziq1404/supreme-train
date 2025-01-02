from django.urls import path
from .consumer import *

websocket_urlpatterns = [
    path('ws/api/pong/<int:room_id>/', PongConsumer.as_asgi()),
]
