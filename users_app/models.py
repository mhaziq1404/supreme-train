from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Friendship(models.Model):
    """
    A model to represent a friendship or friend request.
    By default, "status" is 'pending', and can be updated to 'accepted' or 'rejected'.
    """
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    )

    from_user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name="friendships_sent"
    )
    to_user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name="friendships_received"
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.from_user.username} -> {self.to_user.username} ({self.status})"

