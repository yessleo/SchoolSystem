
import traceback
from django.shortcuts import render
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import smart_str, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from ..serializers import LoginSerializer
from ..serializers import PasswordResetRequestSerializer
from ..serializers import SetNewPasswordSerializer
from ..serializers import LogoutUserSerializer
from ..utils import send_code_to_user
from ..models import OneTimePassword
from ..models import User

class VerifyUserEmail(GenericAPIView):
    def post(self, resquest):
        one_code = resquest.data.get('otp')
        try:
            user_code_obj = OneTimePassword.objects.get(code=one_code)
            user = user_code_obj.user
            if not user.is_verified:
                user.is_verified = True
                user.save()
                return Response({
                    'message': 'Cuenta verificada correctamente'
                }, status=status.HTTP_200_OK)
            return Response({
                'message': 'codigo es invalido, usuario ya verificado'
            }, status=status.HTTP_204_NO_CONTENT)
        except OneTimePassword.DoesNotExist:
            return Response({
                'message': 'codigo no proporcionado'
            }, status=status.HTTP_404_NOT_FOUND)
            
            
class LoginUserView(GenericAPIView):
    serializer_class = LoginSerializer
    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data, context = {'request': request} )
            serializer.is_valid(raise_exception=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            traceback.print_exc()
    
class PasswordResetRequestView(GenericAPIView):
    try:
        serializer_class = PasswordResetRequestSerializer
        def post(self, request):
            serializer = self.serializer_class(data = request.data, context = {'request': request})
            serializer.is_valid(raise_exception=True)
            return Response({
                'message': ' Un enlace ha sido enviado a tu correo para restablecer tu contraseña'
            }, status=status.HTTP_200_OK)
    except:
        traceback.print_exc()

class PasswordResetConfirm(GenericAPIView):
    def get(self, request, uidb64, token):
        try:
            user_id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id = user_id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({
                    'message': 'token es invalido o ha expirado'
                }, status=status.HTTP_401_UNAUTHORIZED)
            return Response({
                'success': True, 'message': 'Credenciales validas', 'uidb64': uidb64, 'token': token
            }, status=status.HTTP_200_OK)
        except DjangoUnicodeDecodeError:
            return Response({
                'message': ' Token es invalido o ha expirado'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
class SetNewPassword(GenericAPIView):
    serializer_class = SetNewPasswordSerializer
    def patch(self, request):
        serializer = self.serializer_class(data = request.data)
        serializer.is_valid(raise_exception=True)
        return Response({
            'message': 'Se restablecio con exito la contraseña'
        }, status=status.HTTP_200_OK)
        
    
class TestAuthenticationView(GenericAPIView):
    permission_classes =  [IsAuthenticated]
    def get(self, request):
        data = {
            'message': 'Its works'
        }
        return Response(data, status=status.HTTP_200_OK)
    
class LogoutUserView(GenericAPIView):
    serializer_class = LogoutUserSerializer
    permission_classes =  [IsAuthenticated]
    def post(self, request):
        serializer = self.serializer_class(data = request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
