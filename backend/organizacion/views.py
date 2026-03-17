from rest_framework import viewsets
from .models import Rol
from .models import Renglon
from .serializers import RolSerializer, RenglonSerializer
from accounts.permissions import EsAdminSistema

class RolViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Rol.objects.filter(activo=True)
    serializer_class = RolSerializer
    permission_classes = [EsAdminSistema]

class RenglonViewSet(viewsets.ModelViewSet):
    queryset = Renglon.objects.all()
    serializer_class = RenglonSerializer
    permission_classes = [EsAdminSistema]