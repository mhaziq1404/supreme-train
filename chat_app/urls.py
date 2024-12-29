from django.urls import path
from .views import AllChats, BlockedChats, SyncChats

urlpatterns = [
    path('chats', AllChats.as_view(), name='all_chats'),
    path('blocked', BlockedChats.as_view(), name='blocked_chats'),
    path('sync', SyncChats.as_view(), name='sync_chats'),
]