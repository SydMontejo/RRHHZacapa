from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .filters import PermisoFilter
from django.utils import timezone
from django.db.models import Q
from .models import Rol, Vacacion
from .models import Renglon, Servicio, Persona, Empleado, Contrato, Permiso
from .serializers import RolSerializer, RenglonSerializer, ServicioSerializer, PersonaSerializer, EmpleadoSerializer, ContratoSerializer, PermisoSerializer, VacacionSerializer
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
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['numero_empleado','id_persona__dpi', 'id_persona__primer_nombre']

    @action(detail=False, methods=['get'])
    def personas_disponibles(self, request):
        personas_con_empleado = Empleado.objects.values_list('id_persona', flat=True)
        personas = Persona.objects.exclude(id_persona__in=personas_con_empleado)

        serializer = PersonaSerializer(personas, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def por_dpi(self, request):
        dpi = request.query_params.get('dpi')
        if not dpi:
            return Response({'error': 'Se requiere DPI'}, status=400)
        try:
            # Buscar persona por DPI
            persona = Persona.objects.get(dpi=dpi)
            # Buscar empleado asociado a esa persona
            empleado = Empleado.objects.get(id_persona=persona)
            serializer = self.get_serializer(empleado)
            return Response(serializer.data)
        except Persona.DoesNotExist:
            return Response({'error': 'Persona no encontrada'}, status=404)
        except Empleado.DoesNotExist:
            return Response({'error': 'La persona existe pero no es empleado'}, status=404)
        
    @action(detail=False, methods=['get'])
    def por_numero(self, request):
        numero = request.query_params.get('numero')
        if not numero:
            return Response({'error': 'Se requiere número de empleado'}, status=400)
        try:
            empleado = Empleado.objects.get(numero_empleado=numero, activo=True, deleted_at__isnull=True)
            serializer = self.get_serializer(empleado)
            return Response(serializer.data)
        except Empleado.DoesNotExist:
            return Response({'error': 'Empleado no encontrado'}, status=404)
        

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

class PermisoViewSet(viewsets.ModelViewSet):
    queryset = Permiso.objects.all()
    serializer_class = PermisoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['estado']
    filterset_class = PermisoFilter

class VacacionViewSet(viewsets.ModelViewSet):
    queryset = Vacacion.objects.all()
    serializer_class = VacacionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['estado']  # Permite filtrar por estado en la URL: ?estado=APROBADO

    @action(detail=True, methods=['post'])
    def aceptar(self, request, pk=None):
        vacacion = self.get_object()
        vacacion.estado = 'APROBADO'
        vacacion.fecha_aprobacion = timezone.now().date()
        vacacion.save()
        return Response({'status': 'aprobado'})

    @action(detail=True, methods=['post'])
    def rechazar(self, request, pk=None):
        vacacion = self.get_object()
        vacacion.estado = 'RECHAZADO'
        vacacion.observaciones = request.data.get('observaciones', '')
        vacacion.save()
        return Response({'status': 'rechazado'})

    @action(detail=True, methods=['put'])
    def modificar_fechas(self, request, pk=None):
        vacacion = self.get_object()
        nueva_fecha_inicio = request.data.get('fecha_inicio')
        nueva_fecha_fin = request.data.get('fecha_fin')
        if nueva_fecha_inicio and nueva_fecha_fin:
            vacacion.fecha_inicio = nueva_fecha_inicio
            vacacion.fecha_fin = nueva_fecha_fin
            vacacion.save()
            return Response({'status': 'fechas actualizadas'})
        return Response({'error': 'Fechas requeridas'}, status=status.HTTP_400_BAD_REQUEST)
    
    def perform_create(self, serializer):
        print("Datos recibidos:", serializer.validated_data)
        serializer.save()

# views.py
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Sancion
from .serializers import SancionSerializer

class SancionViewSet(viewsets.ModelViewSet):
    queryset = Sancion.objects.filter(activo=True, deleted_at__isnull=True)
    serializer_class = SancionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['fecha_sancion']
    search_fields = ['id_empleado__numero_empleado']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def destroy(self, request, *args, **kwargs):
        # Eliminación lógica
        sancion = self.get_object()
        sancion.activo = False
        sancion.deleted_at = timezone.now()
        sancion.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    