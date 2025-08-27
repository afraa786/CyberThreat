from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import CustomUserManager
from django.utils import timezone


class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=50)
    email = models.EmailField(max_length=254, unique=True)
    password = models.CharField(max_length=500)  # Consider using Django's built-in password hashing
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_expiration = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)  # Default to True for active users
    is_staff = models.BooleanField(default=False)  
    date_joined = models.DateTimeField(default=timezone.now)  # Add this line
    is_superuser = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=14, default= False, null=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

