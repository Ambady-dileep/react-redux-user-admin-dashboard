from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
  is_admin = models.BooleanField(default=False)
  profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)

  def __str__(self):
    return self.username