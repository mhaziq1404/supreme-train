from django.urls import path
from .views import LoginView, RegisterView, logout, CurrentUserView

urlpatterns = [
    path('login', LoginView.as_view(), name='login'),
    path('register', RegisterView.as_view(), name='register'),
    path('logout', logout, name='logout'),
    path('me', CurrentUserView.as_view(), name='current_user'),
]