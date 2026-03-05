from rest_framework import viewsets
from .models import Rol
from .serializers import RolSerializer
from accounts.permissions import EsAdminSistema

class RolViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Rol.objects.filter(activo=True)
    serializer_class = RolSerializer
    permission_classes = [EsAdminSistema]