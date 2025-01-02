from django.db import models

# Create your models here.
class ChatGroup(models.Model):
    user = models.ForeignKey('auth_app.CustomUser', on_delete=models.CASCADE, null=True, blank=True)
    json_data = models.JSONField(null=True, blank=True)
