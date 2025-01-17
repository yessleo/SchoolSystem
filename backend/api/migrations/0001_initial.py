# Generated by Django 5.0.6 on 2024-07-09 03:22

import api.models
import datetime
import django.core.validators
import django.db.models.deletion
import django.utils.timezone
import phonenumber_field.modelfields
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Asistencias',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('fecha', models.DateField(default=datetime.date.today)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'Asistencias',
            },
        ),
        migrations.CreateModel(
            name='Grado',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'Grado',
            },
        ),
        migrations.CreateModel(
            name='Nivel',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'Nivel',
            },
        ),
        migrations.CreateModel(
            name='Parciales',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=20)),
            ],
            options={
                'db_table': 'Parciales',
            },
        ),
        migrations.CreateModel(
            name='Semestre',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'Semestre',
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('username', models.CharField(max_length=255, unique=True)),
                ('password', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=80)),
                ('role', models.CharField(choices=[('admin', 'Admin'), ('student', 'Student'), ('docent', 'Docent'), ('staff', 'Staff')], max_length=50)),
                ('status', models.CharField(choices=[('activo', 'Active'), ('inactivo', 'Inactive')])),
                ('is_superuser', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', api.models.CustomUserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Docentes',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nombres', models.CharField(max_length=255)),
                ('apellidos', models.CharField(max_length=255)),
                ('fecha_nac', models.DateTimeField()),
                ('contacto', phonenumber_field.modelfields.PhoneNumberField(max_length=128, region=None)),
                ('email', models.EmailField(max_length=80, null=True)),
                ('direccion', models.TextField()),
                ('genero', models.CharField(choices=[('masculino', 'Masculino'), ('femenino', 'Femenino')], max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='docent_account', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'Docentes',
                'ordering': ['nombres'],
            },
        ),
        migrations.CreateModel(
            name='Estudiantes',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nombres', models.CharField(max_length=255)),
                ('apellidos', models.CharField(max_length=255)),
                ('fecha_nac', models.DateTimeField()),
                ('contacto', phonenumber_field.modelfields.PhoneNumberField(max_length=128, region=None)),
                ('email', models.EmailField(max_length=80, null=True)),
                ('direccion', models.TextField()),
                ('genero', models.CharField(choices=[('M', 'Masculino'), ('F', 'Femenino')], max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='student_account', to=settings.AUTH_USER_MODEL)),
                ('clase', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='estudiantes_asignados', to='api.grado')),
            ],
            options={
                'db_table': 'Estudiantes',
            },
        ),
        migrations.CreateModel(
            name='AsistenciasReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('asistencia', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reporte_asistencias', to='api.asistencias')),
                ('estudiante', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='asistencias_estudiante', to='api.estudiantes')),
            ],
            options={
                'db_table': 'AsistenciasReport',
            },
        ),
        migrations.CreateModel(
            name='Clase',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('grado', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='clases', to='api.grado')),
            ],
            options={
                'db_table': 'Clase',
            },
        ),
        migrations.CreateModel(
            name='Materias',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now_add=True)),
                ('clase', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='materias', to='api.clase')),
                ('docent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='materias_asignadas', to='api.docentes')),
            ],
            options={
                'db_table': 'Materias',
            },
        ),
        migrations.AddField(
            model_name='asistencias',
            name='materia',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='asistencias', to='api.materias'),
        ),
        migrations.CreateModel(
            name='Matriculas',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('periodo_escolar', models.PositiveIntegerField(default=2024, validators=[django.core.validators.MinValueValidator(1984), api.models.max_value_current_year])),
                ('guardian_nombres', models.CharField(max_length=255)),
                ('guardian_apellidos', models.CharField(max_length=255)),
                ('contacto', phonenumber_field.modelfields.PhoneNumberField(max_length=128, region=None)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('estudiante', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='api.estudiantes')),
            ],
            options={
                'db_table': 'Matriculas',
            },
        ),
        migrations.AddField(
            model_name='grado',
            name='nivel',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='grados', to='api.nivel'),
        ),
        migrations.CreateModel(
            name='OneTimePassword',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=6, unique=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Notas',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('estudiante', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='estudiante_notas', to='api.estudiantes')),
                ('materia', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notas', to='api.materias')),
                ('parcial', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='notas_parciales', to='api.parciales')),
            ],
            options={
                'db_table': 'Notas',
            },
        ),
        migrations.AddField(
            model_name='parciales',
            name='semestre',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='parciales', to='api.semestre'),
        ),
    ]
