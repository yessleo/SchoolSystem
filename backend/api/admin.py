from django.contrib import admin
from .models import User, Nivel, Grado, Clase

admin.site.register(User)
admin.site.register(Nivel)
admin.site.register(Clase)
admin.site.register(Grado)
