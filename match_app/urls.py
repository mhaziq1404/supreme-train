from django.urls import path
from .views import CurrentUserHistory, ProfileUserHistory

urlpatterns = [
    path('history/me', CurrentUserHistory.as_view(), name='history_mine'),
    path('history/<int:user_id>', ProfileUserHistory.as_view(), name='history_player'),

]