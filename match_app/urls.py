from django.urls import path
from .views import CurrentUserHistory

urlpatterns = [
    path('history/me', CurrentUserHistory.as_view(), name='history_mine'),

]