from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    model = Usuario

    list_display = ('username', 'email', 'is_staff', 'is_active')

    fieldsets = UserAdmin.fieldsets + (
        ('Información adicional', {
            'fields': ('id_rol', 'intentos_fallidos', 'bloqueado_hasta', 'ultimo_acceso'),
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Información adicional', {
            'fields': ('id_rol',),
        }),
    )