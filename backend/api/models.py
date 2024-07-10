import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager, BaseUserManager
from django.contrib.auth.hashers import make_password
from phonenumber_field.modelfields import PhoneNumberField
from datetime import date
from django.core.validators import MaxValueValidator, MinValueValidator


def current_year():
    return datetime.date.today().year

def max_value_current_year(value):
    return MaxValueValidator(current_year())(value)

def generate_username(rol, count):
    user_typ = ""
    if rol == "student":
        user_typ = "ST"
    elif rol == "docent":
        user_typ = "DO"
    elif rol == "staff":
        user_typ = "AF"
        
    return f"{str(current_year())[2:]}-{user_typ}{str(count).zfill(4)}"

class CustomUserManager(UserManager):
    def _create_user(self, username = "", password = "", role = "",  **extra_fields):
        if not username or role in ['student', 'staff', 'docent']:
            username = generate_username(role, self.get_count_by_role(role))
            
        user = self.model(username = username, role = role, **extra_fields)
        #password = make_password(password)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create(self, username = "", password = "", role = "",  **extra_fields):
        if role == "admin":
            extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('status', 'activo')
        return self._create_user(username, password, role, **extra_fields)
    
    def create_superuser(self, username = "", password = "", role = "admin",  **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('status', 'activo')
        return self._create_user(username, password, role, **extra_fields)
    
    def get_count_by_role(self, rol="staff"):
        return self.model.objects.filter(role = rol).count()
    
    
class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'admin'
        STUDENT = 'student'
        DOCENT = 'docent'
        STAFF = 'staff'
        
    class Status(models.TextChoices):
        ACTIVE = 'activo'
        INACTIVE = 'inactivo'
        
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255,)
    email = models.EmailField(max_length=80)
    role = models.CharField(max_length=50, choices=Role.choices)
    status = models.CharField(choices=Status.choices)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()
    
    def __str__(self):
        return self.username
    
    def save(self, *args, **kwargs):
        if not self.pk:
            return super().save(*args, **kwargs)

        
class OneTimePassword(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6, unique=True)
    
    def __str__(self) -> str:
        return f"{self.user.username} - passcode"

class Nivel(models.Model):
    class Meta:
        db_table = 'Nivel'
    id = models.AutoField(primary_key=True)
    nombre=models.CharField(max_length=50)


class Grado(models.Model):
    class Meta:
        db_table = 'Grado'
    id = models.AutoField(primary_key=True)
    nombre=models.CharField(max_length=50)
    nivel = models.ForeignKey(Nivel, on_delete=models.CASCADE, related_name='grados',  null=False)



 
class Clase(models.Model):
    class Meta:
        db_table = 'Clase'
        
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length = 50) 
    grado = models.ForeignKey(Grado, on_delete=models.RESTRICT, related_name='clases', null=False)
    periodo_escolar =  models.PositiveIntegerField(default=current_year(), validators=[MinValueValidator(1984), max_value_current_year])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    

class Docentes(models.Model):
    class Meta:
        db_table = 'Docentes'
        ordering = ['nombres']
        
    id=models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True,  related_name="docent_account")
    nombres = models.CharField(max_length=255)
    apellidos = models.CharField(max_length=255)
    fecha_nac =models.DateTimeField()
    contacto = PhoneNumberField()
    email = models.EmailField(max_length=80, null= True)
    direccion =models.TextField()
    gender_choice = (
        ("masculino", "Masculino"),
        ("femenino", "Femenino"),
    )
    genero = models.CharField(choices=gender_choice, max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return self.user.username

class Materias(models.Model):
    class Meta:
        db_table = 'Materias'
        
    id=models.AutoField(primary_key=True)
    name=models.CharField(max_length=255)
    clase=models.ForeignKey(Clase,on_delete=models.CASCADE, related_name='materias')
    docent = models.ForeignKey(Docentes,on_delete=models.CASCADE, related_name='materias_asignadas')
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now_add=True)
   

class StudentManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role = User.role)

class Estudiantes(models.Model):
    class Meta:
        db_table = 'Estudiantes'
        
    id=models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True,  related_name="student_account")
    nombres = models.CharField(max_length=255)
    apellidos = models.CharField(max_length=255)
    fecha_nac =models.DateTimeField()
    contacto = PhoneNumberField()
    email = models.EmailField(max_length=80, null= True)
    direccion =models.TextField()
    gender_choice = (
        ("M", "Masculino"),
        ("F", "Femenino"),
    )
    genero = models.CharField(choices=gender_choice, max_length=10)
    clase = models.ForeignKey(Grado,on_delete=models.DO_NOTHING, null=False, related_name='estudiantes_asignados')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return self.user.username



class Matriculas(models.Model):
    class Meta:
        db_table = 'Matriculas'
        
    id=models.AutoField(primary_key=True)
    periodo_escolar =  models.PositiveIntegerField(default=current_year(), validators=[MinValueValidator(1984), max_value_current_year])
    estudiante = models.OneToOneField(Estudiantes, on_delete=models.CASCADE, null=False)
    guardian_nombres = models.CharField(max_length=255)
    guardian_apellidos = models.CharField(max_length=255)
    contacto = PhoneNumberField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
class Notas(models.Model):
    class Meta:
        db_table = 'Notas'
    id=models.AutoField(primary_key=True)
    materia = models.ForeignKey(Materias,on_delete=models.CASCADE, related_name='notas')
    estudiante=models.ForeignKey(Estudiantes,on_delete=models.CASCADE, related_name='estudiante_notas')
    p_parcial = models.IntegerField(default=0) 
    s_parcial = models.IntegerField(default=0) 
    final_primer_semestre = models.IntegerField(default=0) 
    t_parcial = models.IntegerField(default=0) 
    c_parcial = models.IntegerField(default=0) 
    final_segundo_semestre = models.IntegerField(default=0)
    nota_final =  models.IntegerField(default=0) 
    periodo_escolar =  models.PositiveIntegerField(default=current_year(), validators=[MinValueValidator(1984), max_value_current_year])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
class Asistencias(models.Model):
    class Meta:
        db_table = 'Asistencias'
    id=models.AutoField(primary_key=True)
    materia =models.ForeignKey(Materias,on_delete=models.DO_NOTHING, related_name='asistencias')
    fecha = models.DateField(default=date.today)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class AsistenciasReport(models.Model):
    class Meta:
        db_table = 'AsistenciasReport'
    estudiante=models.ForeignKey(Estudiantes,on_delete=models.CASCADE, related_name='asistencias_estudiante')
    asistencia = models.ForeignKey(Asistencias, on_delete=models.CASCADE, related_name='reporte_asistencias')
    status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# @receiver(post_save, sender = User)
# def create_user_docent(sender, instance, created, **kwargs):
#     if created:
#         Docentes.objects.create(user = instance)