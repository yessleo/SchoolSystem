from rest_framework import serializers
from .models import User, Estudiantes, Docentes, Clase, Grado, \
    Nivel, Materias, Notas
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

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['id'] = user.id
        token['username'] = user.username
        token['email'] = user.email
        # ...
        print(token)
        return token 

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'status', 'created_at')     
    
    
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
        self.token = attrs.get('refresh')
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
        
        
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('status', 'username', 'role')
        
    def validate_username(self, value):
        user = self.context['request'].data
        print(user)
        if User.objects.exclude(pk=user["pk"]).filter(username=value).exists():
            raise serializers.ValidationError({"username": "This username is already in use."})
        return value

    def update(self, instance, validated_data):
        instance.status = validated_data['status']
        instance.role = validated_data['role']
        instance.username = validated_data['username']
        instance.save()
        return instance

        
        
class UserCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'status', 'username', 'password', 'role')
        extra_kwargs = {'id': {'read_only': True}}
        
        
    def create(self,validated_data):
        #user = User(**validated_data)
        user = User.objects.create(**validated_data)
        #user.set_password(validated_data['password'])
        #user.save()
        return user
    
class ChangePasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('password',)
        
    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()

        return instance
    
class DocentesSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Docentes
        fields = '__all__'
        
    def create(self, validated_data):
        user_data = validated_data.get("user")
        validated_data.pop('user')
        user = User.objects.create(**user_data)
        student = Docentes.objects.create(**validated_data, user = user)
        return student
class ClaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clase
        fields = '__all__'
        
    def to_representation(self, instance):
        return {
            'id': instance.id,
            'nombre': instance.nombre,
            'id_grado': instance.grado.id,
            'grado': instance.grado.nombre,
            'periodo_escolar': instance.periodo_escolar,
            'created_at': instance.created_at
        }
         
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
    
class GradoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grado
        fields = '__all__'      



class GradoWithClasesSerializer(serializers.ModelSerializer):
    clases = ClaseSerializer(many = True)
    class Meta:
        model = Grado
        fields = '__all__'  
        
        
class MateriasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materias
        fields = '__all__'  
        
    def to_representation(self, instance):
        return {
            'id': instance.id,
            'name': instance.name,
            'id_clase': instance.clase.id,
            'clase': instance.clase.nombre,
            'grado': instance.clase.grado.nombre,
            'id_docente': instance.docent.id,
            'docente_nombres': instance.docent.nombres,
            'docente_apellidos': instance.docent.apellidos,            
            'created_at': instance.created_at
        }
        
        
class MateriasByClasesSerializer(serializers.ModelSerializer):
    materias = MateriasSerializer(many = True, read_only = True)
    class Meta:
        model = Clase
        fields  = ("name", "periodo_escolar", "materias")
        
        
class NotasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notas
        fields = '__all__'  
        
    def to_representation(self, instance):
        return {
            'id': instance.id,
            'id_materia': instance.materia.id,
            'materia': instance.materia.name,
            'id_student': instance.estudiante.id,
            'student_nombres': instance.estudiante.nombres,
            'student_apellidos': instance.estudiante.apellidos,   
            'p_parcial': instance.p_parcial,
            's_parcial': instance.s_parcial,
            'final_primer_semestre': instance.final_primer_semestre,
            't_parcial': instance.t_parcial,            
            'c_parcial': instance.c_parcial,     
            'final_segundo_semestre': instance.final_segundo_semestre,  
            'nota_final': instance.nota_final,      
            'periodo_escolar': instance.periodo_escolar,
            'created_at': instance.created_at
        }
        