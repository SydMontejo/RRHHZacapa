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


@receiver(post_migrate)
def crear_roles(sender, **kwargs):

    # obtener modelo Rol desde la app organizacion
    Rol = apps.get_model("organizacion", "Rol")

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