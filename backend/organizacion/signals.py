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