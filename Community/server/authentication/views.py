from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
import jwt
import datetime
from django.utils import timezone
from .models import User
from .serializers import UserSerializer,PasswordResetRequestSerializer,PasswordResetSerializer
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.crypto import get_random_string
from django.core.cache import cache
import ssl
from dotenv import load_dotenv
import os 
from utils.usercheck import authenticate_request


load_dotenv()
# Disable SSL verification
ssl._create_default_https_context = ssl._create_unverified_context
class RegisterView(APIView):
    @csrf_exempt
    def post(self, request):
        email = request.data.get('email')
        name = request.data.get('name')
        password = request.data.get('password')
        confirm_password = request.data.get('confirm_password')
        authenticate_request(request)

        if not email or not name or not password or not confirm_password:
            return Response({"message": "Email, name, password, and confirm_password are required"}, status=status.HTTP_400_BAD_REQUEST)

        if password != confirm_password:
            return Response({"message": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user exists and is active
        existing_user = User.objects.filter(email=email).first()
        if existing_user and existing_user.is_active:
            return Response({"message": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        otp = get_random_string(length=4, allowed_chars='0123456789')

        if existing_user:
            # If user exists but inactive, update their details & OTP
            existing_user.name = name
            existing_user.set_password(password)
            existing_user.otp = otp
            existing_user.otp_expiration = timezone.now() + timezone.timedelta(minutes=5)
            existing_user.is_active = False
            existing_user.save()
            user = existing_user
        else:
            # Create new user
            user = User.objects.create_user(email=email, name=name, password=password)
            user.otp = otp
            user.otp_expiration = timezone.now() + timezone.timedelta(minutes=5)
            user.is_active = False
            user.save()

        html_message = render_to_string('email/register_otp.html', {'otp': otp})
        send_mail(
            'Your OTP Code',
            f'Your OTP code is {otp}',
            'teamscrapiz@gmail.com',
            [email],
            fail_silently=False,
            html_message=html_message,
        )

        return Response({"message": "User created successfully. OTP sent to your email."}, status=status.HTTP_201_CREATED)


    def put(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        user = User.objects.filter(email=email).first()
        authenticate_request(request)

        if user and user.otp == otp and user.otp_expiration > timezone.now():
            user.is_active = True
            user.otp = None
            user.otp_expiration = None
            user.save()
            # Send a welcome email or any other post-verification action
            html_message = render_to_string('email/welcome.html', {'name': user.name})
            send_mail(
                'Welcome to SCRAPIZ',
                'Thank you for verifying your email.',
                'teamscrapiz@gmail.com',  # Replace with your email
                [email],
                fail_silently=False,
                html_message=html_message,
            )

            return Response({'message': 'User verified successfully'})
        else:
            return Response({'error': 'Invalid OTP or OTP expired'}, status=status.HTTP_400_BAD_REQUEST)
        # return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class ResendotpView(APIView):
    @csrf_exempt
    def post(self, request):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()
        authenticate_request(request)

        if user:
            otp = get_random_string(length=4, allowed_chars='0123456789')
            user.otp = otp
            user.otp_expiration = timezone.now() + timezone.timedelta(minutes=5)
            user.save()
            html_message = render_to_string('email/otp_resend.html', {'otp': otp})
            send_mail(
                'Your OTP Code',
                f'Your OTP code is {otp}',
                'teamscrapiz@gmail.com',  # Replace with your email
                [email],
                fail_silently=False,
                html_message=html_message,
            )
            return Response({"message": "OTP resent successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)




class LoginView(APIView):
    @csrf_exempt
    def post(self, request):
        email = request.data['email']

        password = request.data['password']

        user = User.objects.filter(email=email).first()
        authenticate_request(request)

        if user is None:
            raise AuthenticationFailed('User Not found!')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect Password')

        if not user.is_active:
            raise AuthenticationFailed('Account not activated. Please verify your email.')

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')

        response = Response()
        response.data = {
            'jwt': token  # No "Bearer" prefix
        }

        return response
    




class LogoutView(APIView):
    @csrf_exempt
    def post(self, request):
        authenticate_request(request)

        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': "Logged out successfully"
        }
        return response



# views.py



class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        authenticate_request(request)


        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        otp = get_random_string(length=4, allowed_chars='0123456789')
        # cache.set(f'otp_{email}', otp, timeout=300)  # OTP valid for 5 minutes
        user.otp = otp
        user.otp_expiration = timezone.now() + timezone.timedelta(minutes=5)
        user.save()
        html_message = render_to_string('email/password_reset.html', {'otp': otp})

        send_mail(
            'Password Reset OTP',
            f'Your OTP for password reset is {otp}.',
            'teamscrapiz@gmail.com',
            [email],
            fail_silently=False,
            html_message=html_message,
        )
        return Response({"message": "OTP sent to your email."}, status=status.HTTP_200_OK)


class PasswordResetView(APIView):
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        new_password = serializer.validated_data['new_password']
        authenticate_request(request)


        try:
            user = User.objects.get(email=email)
            if user.otp != otp or user.otp_expiration < timezone.now():
                return Response({"message": "Invalid OTP or OTP expired."}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(new_password)
            user.save()
            cache.delete(f'otp_{email}')
            # Send confirmation email
            html_message = render_to_string('email/password_reset_sucessful.html', {'name': user.name})
            send_mail(
                'Password Reset Successful',
                'Your password has been reset successfully.',
                'teamscrapiz@gmail.com',
                [email],
                fail_silently=False,
                html_message=html_message,
            )
            return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"message": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)


class UserView(APIView):
    @csrf_exempt
    def get(self, request):

        user = authenticate_request(request, need_user=True)
        serializer = UserSerializer(user)

        return Response(serializer.data)

    @csrf_exempt
    def patch(self, request):
        
        user = authenticate_request(request, need_user=True)

        data = request.data
        if "name" in data:
            user.name = data["name"]
        else:
            return Response({"error": "You can only update your name"}, status=status.HTTP_403_FORBIDDEN)

        user.save()
        html_message = render_to_string('email/name_reset_sucessful.html', {'name': user.name})
        send_mail(
                'Name Reset Successful',
                'Your name has been reset successfully.',
                'teamscrapiz@gmail.com',
                [user.email],
                fail_silently=False,
                html_message=html_message,
            )
        return Response({"message":f"Your name is updated successfully to {user.name}"}, status=status.HTTP_200_OK)

        
    @csrf_exempt
    def delete(self, request):
        user = authenticate_request(request, need_user=True)
        # User can delete only their own account
        user.delete()
        html_message = render_to_string('email/account_deleted_sucessful.html', {'name': user.name})
        send_mail(
                'Account Deleted Successful',
                'Your account has been permanently deleted successfully.',
                'teamscrapiz@gmail.com',
                [user.email],
                fail_silently=False,
                html_message=html_message,
            )
        return Response({"message": "Your account has been deleted successfully"}, status=status.HTTP_200_OK)