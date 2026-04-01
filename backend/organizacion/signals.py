# from rest_framework.permissions import BasePermission
# class SoloLecturaRRHH2(BasePermission):
#     def has_permission(self, request, view):
#         if not request.user.is_authenticated:
#             return False

#         if not request.user.id_rol:
#             return False

#         rol = request.user.id_rol.nombre

#         if rol == "ADMIN":
#             return True

#         if rol == "RRHH1":
#             return True

#         if rol == "RRHH2" and request.method in ["GET", "HEAD", "OPTIONS"]:
#             return True

#         return False
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.apps import apps
from django.contrib.auth import get_user_model

@receiver(post_migrate)
def crear_roles(sender, **kwargs):

    # rol desde organizacion
    Rol = apps.get_model("organizacion", "Rol")
    Usuario = get_user_model()
    roles = [
        {
            "nombre": "ADMIN",
            "descripcion": "Acceso total al sistema"
        },
        {
            "nombre": "RRHH1",
            "descripcion": "Gestión completa de empleados y documentos"
        },
        {
            "nombre": "RRHH2",
            "descripcion": "Solo consultas del sistema"
        }
    ]

    for rol in roles:
        Rol.objects.get_or_create(
            nombre=rol["nombre"],
            defaults={
                "descripcion": rol["descripcion"]
            }
        )
    
    if not Usuario.objects.filter(username='admin').exists():
        # Crear superusuario (esto lo hace con is_staff=True, is_superuser=True)
        admin_user = Usuario.objects.create_superuser(
            username='admin',
            password='1234567',
            email='admin@example.com'   # Opcional, puede ser None si tu modelo permite
        )

        # Asignar rol ADMIN
        try:
            rol_admin = Rol.objects.get(nombre='ADMIN')
            admin_user.id_rol = rol_admin
            admin_user.save()
        except Rol.DoesNotExist:
            pass