from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from .models import Rol
from .models import Renglon, Servicio, Persona, Empleado, Contrato
from .serializers import RolSerializer, RenglonSerializer, ServicioSerializer, PersonaSerializer, EmpleadoSerializer, ContratoSerializer
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
    search_fields = ['primer_nombre', 'primer_apellido', 'dpi']

class EmpleadoViewSet(viewsets.ModelViewSet):
    queryset = Empleado.objects.all().order_by('-id_empleado')
    serializer_class = EmpleadoSerializer

    @action(detail=False, methods=['get'])
    def personas_disponibles(self, request):
        personas_con_empleado = Empleado.objects.values_list('id_persona', flat=True)
        personas = Persona.objects.exclude(id_persona__in=personas_con_empleado)

        serializer = PersonaSerializer(personas, many=True)
        return Response(serializer.data)
    
class ContratoViewSet(viewsets.ModelViewSet):
    queryset = Contrato.objects.all().order_by('-fecha_inicio')
    serializer_class = ContratoSerializer

    def perform_create(self, serializer):
        empleado = serializer.validated_data['id_empleado']

        #cerrar contrato activo anterior
        contrato_activo = Contrato.objects.filter(
            id_empleado=empleado,
            activo=True
        ).first()

        if contrato_activo:
            contrato_activo.fecha_fin = timezone.now().date()
            contrato_activo.activo = False
            contrato_activo.save()

        serializer.save()