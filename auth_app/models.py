from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    auth_token = models.CharField(max_length=150, blank=True, null=True)
    username = models.CharField(unique=True)
    avatar = models.ImageField(null=True, default="avatar.svg", upload_to='avatars/')
    bio = models.TextField(max_length=500, default='The User doesnt change the bio yet')
    total_matches = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    points = models.IntegerField(default=0)
    status = models.CharField(max_length=50, default='Offline')
