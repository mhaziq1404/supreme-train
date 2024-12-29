from django.urls import path, re_path
from .consumer import *

websocket_urlpatterns = [
    re_path(r'^api/chat/(?P<chatroom_name>\w+)/$', ChatroomConsumer.as_asgi()),
]