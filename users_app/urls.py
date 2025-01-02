from django.urls import path
from .views import CurrentUserView, CurrentUserStatsView, UsersOnlineView, FriendshipView, FriendshipRequestView, FriendshipStatusRequestView, ProfileUserView, ProfileUserStatsView

urlpatterns = [
    path('me', CurrentUserView.as_view(), name='current_user'),
    path('me/stats', CurrentUserStatsView.as_view(), name='current_user_stats'),
    path('<int:user_id>', ProfileUserView.as_view(), name='current_user'),
    path('<int:user_id>/stats', ProfileUserStatsView.as_view(), name='current_user_stats'),
    path('online', UsersOnlineView.as_view(), name='users_online'),
    path('friends/requests', FriendshipRequestView.as_view(), name='friends_requests'),
    path('friends/<int:friend_id>', FriendshipStatusRequestView.as_view(), name='friends_view'),
    path('friends', FriendshipView.as_view(), name='friends_view'),
]