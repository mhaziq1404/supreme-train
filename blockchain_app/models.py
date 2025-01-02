from django.db import models

class Web3_model(models.Model):
    address = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.address
