from rest_framework.permissions import BasePermission

class EsAdminSistema(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.user.is_superuser:
            return True

        if not request.user.id_rol:
            return False
        return request.user.is_authenticated and request.user.id_rol.nombre == "ADMIN"

class EsRRHH1oAdmin(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.is_superuser:
            return True

        if not request.user.id_rol:
            return False

        return request.user.id_rol.nombre in ["ADMIN", "RRHH1"]
    
class SoloLecturaRRHH2(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if not request.user.id_rol:
            return False

        rol = request.user.id_rol.nombre

        if rol == "ADMIN":
            return True

        if rol == "RRHH1":
            return True

        if rol == "RRHH2" and request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        return False