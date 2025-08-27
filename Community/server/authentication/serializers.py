from rest_framework import serializers
from .models import User
from django.utils import timezone



class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    otp = serializers.CharField(write_only=True, required=False)


    class Meta:
        model = User
        fields = [
            'id',
            'name',
            'email',
            'password',
            'confirm_password',
            'otp',
            'is_staff',
            ]
        extra_kwargs = {
            'password': {'write_only': True},
        }
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

