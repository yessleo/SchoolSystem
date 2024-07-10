from rest_framework import serializers
from .models import User, Estudiantes, Docentes, Clase, Grado, \
    Nivel, Materias, Matriculas
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site 
from django.utils.encoding import smart_str, smart_bytes, force_str
from django.urls import reverse
from .utils import send_normal_email
from rest_framework_simplejwt.tokens import RefreshToken, Token
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import IsAuthenticated, IsAdminUser

    
class LoginSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(max_length = 32 ,write_only=True)
    full_name = serializers.CharField(max_length = 255 ,read_only=True)
    access_token = serializers.CharField(max_length = 255 ,read_only=True)
    refresh_token = serializers.CharField(max_length = 255 ,read_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'password', 'full_name', 'access_token', 'refresh_token']
        
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        request = self.context.get('request')
        user = authenticate(request, username = username, password = password)
        if not user:
            raise AuthenticationFailed("credenciales invalidas, intente de nuevo")
        
        user_tokens  = user.tokens()
 
        return {
            'username': user.get_username,
            'email': user.email,
            'full_name': user.get_full_name,
            'role': user.role,
            'access_token': str(user_tokens.get('access')),
            'refresh_token': str(user_tokens.get('refresh'))
        }
    

        
    
    
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length = 255)
    
    class Meta:
        fields = ['email']
        
    def validate(self, attrs):
        email = attrs.get('email')
        print(email)
        if User.objects.filter(email = email). exists():
            user = User.objects.get(email = email)
            print(user.email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            request = self.context.get('request')
            print(request)
            site_domain = get_current_site(request).domain
            relative_link = reverse('password-reset-confirm', kwargs={'uidb64':uidb64, 'token': token})
            abslink = f"http:/{site_domain}{relative_link}"
            email_body = f"Hola usa este enlace a continuación para restablecer tu contraseña \n {abslink}"
            data = {
                "email_body": email_body,
                'email_subject': 'Restablecer tu contraseña',
                'to_email': user.email
            }
            send_normal_email(data)
        return super().validate(attrs)
            

class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length = 32, min_length = 6, write_only = True)
    confirm_password = serializers.CharField(max_length = 32, min_length = 6, write_only = True)
    uidb64 = serializers.CharField(write_only = True)
    token = serializers.CharField(write_only = True)
    
    class Meta:
        fields = ["password", "confirm_password", "uidb64", "token"]
        
    def validate(self, attrs):
        try:
            token = attrs.get("token")
            uidb64 = attrs.get("uidb64")
            password = attrs.get("password")
            confirm_password = attrs.get("confirm_password")
        
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id = user_id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed("Enlance es invalido o ha expirado", 401)
            if password != confirm_password:
                raise AuthenticationFailed("contraseñas no coinciden")
            user.set_password(password)
            user.save()
            return user
        except Exception as es:
            return AuthenticationFailed("Enlance es invalido o ha expirado")
    
    
class LogoutUserSerializer(serializers.Serializer):
    permission_classes = (IsAuthenticated)
    refresh_token = serializers.CharField()
    default_error_messages = {
        'bad_token': ('Token es invalido o ha expirado')
    }
    def validate(self, attrs):
        self.token = attrs.get('refresh_token')
        return attrs
    
    def save(self, **kwargs):
        try:
            token = RefreshToken(self.token)
            token.blacklist()
        except TokenError:
            return self.fail('bad_token')
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'role', 'status', 'created_at')
        extra_kwargs = {'id': {'read_only': True}, 'created_at': {'read_only': True}}
        
class UserCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'role')
        extra_kwargs = {'id': {'read_only': True}}
        
        
    def validate(self, attrs):
        if attrs['role'] == "admin":
            username_exists = User.objects.filter(username = attrs['username']).exists()
            if username_exists:
                raise serializers.ValidationError(detail = "Existe un user con ese username")
        return super().validate(attrs)
    
    def create(self,validated_data):
        #user = User(**validated_data)
        user = User.objects.create(**validated_data)
        #user.set_password(validated_data['password'])
        #user.save()
        return user
    
    # def update(self, instance, validated_data):
    #     update_user = super().update(instance, validated_data)
    #     update_user.set_password(validated_data['password'])
    #     update_user.save()
    #     return update_user


        
  
     
    
    
class DocentesSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Docentes
        fields = '__all__'
        
    def create(self, validated_data):
        user_data = validated_data.get("user")
        validated_data.pop('user')
        user = User.objects.create(**user_data)
        docente = Docentes.objects.create(**validated_data, user = user)
        return docente
            
        
class EstudiantesSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Estudiantes
        fields = '__all__'
        
    def create(self, validated_data):
        user_data = validated_data.get("user")
        validated_data.pop('user')
        user = User.objects.create(**user_data)
        student = Estudiantes.objects.create(**validated_data, user = user)
        return student
        

class ClaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clase
        fields = '__all__'
        
    def to_representation(self, instance):
        return {
            'id': instance.id,
            'nombre': instance.nombre,
            'grado': instance.grado.nombre,
            'periodo_escolar': instance.periodo_escolar
        }


class GradoSerializer(serializers.ModelSerializer):
    clases = ClaseSerializer(many = True)
    class Meta:
        model = Grado
        fields = '__all__'  