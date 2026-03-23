from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from .models import Rol
from .models import Renglon, Servicio, Persona
from .serializers import RolSerializer, RenglonSerializer, ServicioSerializer, PersonaSerializer
from accounts.permissions import EsAdminSistema, EsRRHH1oAdmin

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

class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all().order_by('id_persona')
    serializer_class = PersonaSerializer
    permission_classes = [EsRRHH1oAdmin]

    filter_backends = [filters.SearchFilter]
    search_fields = ['nombres', 'apellidos', 'dpi', 'correo']