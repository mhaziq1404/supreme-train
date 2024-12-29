from django.db import models

# Create your models here.
class ChatGroup(models.Model):
    user = models.ForeignKey('auth_app.CustomUser', on_delete=models.CASCADE)
    json_data = models.JSONField()
