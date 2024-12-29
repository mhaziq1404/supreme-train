from django.urls import path
from .views import AllRooms, RoomDetails

urlpatterns = [
    path('', AllRooms.as_view(), name='all_rooms'),
    path('<int:id>', RoomDetails.as_view(), name='room_detail'),
]