from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Rol
from .models import Renglon, Servicio
from .serializers import RolSerializer, RenglonSerializer, ServicioSerializer
from accounts.permissions import EsAdminSistema

class RolViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Rol.objects.filter(activo=True)
    serializer_class = RolSerializer
    permission_classes = [EsAdminSistema]

class RenglonViewSet(viewsets.ModelViewSet):
    queryset = Renglon.objects.filter(activo=True)
    serializer_class = RenglonSerializer
    permission_classes = [EsAdminSistema]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.activo = False  
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ServicioWiewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.filter(activo=True)
    serializer_class = ServicioSerializer
    permission_classes = [EsAdminSistema]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.activo = False  
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)