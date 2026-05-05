from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .filters import PermisoFilter, VacacionFilter
from django.utils import timezone
from django.db.models import Q
from .models import Rol, Vacacion
from .models import Renglon, Servicio, Persona, Empleado, Contrato, Permiso, MovimientoPersonal
from .serializers import RolSerializer, RenglonSerializer, ServicioSerializer, PersonaSerializer, EmpleadoSerializer, ContratoSerializer, PermisoSerializer, VacacionSerializer, MovimientoPersonalSerializer
from accounts.permissions import EsAdminSistema, EsRRHH1oAdmin

class RolViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Rol.objects.filter(activo=True)
    serializer_class = RolSerializer
    permission_classes = [EsRRHH1oAdmin]

class RenglonViewSet(viewsets.ModelViewSet):
    queryset = Renglon.objects.filter(activo=True)
    serializer_class = RenglonSerializer
    permission_classes = [EsRRHH1oAdmin]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.activo = False  
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ServicioWiewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.filter(activo=True)
    serializer_class = ServicioSerializer
    permission_classes = [EsRRHH1oAdmin]

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
    permission_classes = [EsRRHH1oAdmin]#Desde aqui se autentican los roles
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
    permission_classes = [EsRRHH1oAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['estado']
    filterset_class = PermisoFilter
    search_fields = ['id_empleado__numero_empleado', 'motivo']

class VacacionViewSet(viewsets.ModelViewSet):
    queryset = Vacacion.objects.all().order_by('-fecha_solicitud')
    serializer_class = VacacionSerializer
    permission_classes = [EsRRHH1oAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = VacacionFilter
    search_fields = ['id_empleado__numero_empleado', 'observaciones']  

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
    
    def list(self, request, *args, **kwargs):
        print("Parámetros recibidos:", request.query_params)
        return super().list(request, *args, **kwargs)

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
    permission_classes = [EsRRHH1oAdmin]
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
    
class MovimientoPersonalViewSet(viewsets.ModelViewSet):
    queryset = MovimientoPersonal.objects.all()
    serializer_class = MovimientoPersonalSerializer
    permission_classes = [EsRRHH1oAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['id_empleado__numero_empleado', 'id_empleado__id_persona__primer_nombre', 
                     'id_empleado__id_persona__primer_apellido', 'tipo']
    
#Estadisticas====================================================================
from django.db.models import Count, Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Q, F

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def estadisticas_empleados(request):
    try:
        # Parámetros de filtro
        genero = request.query_params.get('genero')          
        renglon_id = request.query_params.get('renglon')     
        servicio_id = request.query_params.get('servicio')   
        colegiado = request.query_params.get('colegiado')    

        # Base: empleados activos (no eliminados lógicamente)
        qs = Empleado.objects.filter(activo=True, deleted_at__isnull=True)

        # Aplicar filtros
        if genero:
            qs = qs.filter(id_persona__genero=genero)
        if renglon_id:
            qs = qs.filter(id_renglon_id=renglon_id)
        if servicio_id:
            qs = qs.filter(id_servicio_id=servicio_id)
        if colegiado is not None:
            if colegiado.lower() == 'true':
                qs = qs.filter(colegiado_activo__isnull=False).exclude(colegiado_activo='')
            else:
                qs = qs.filter(Q(colegiado_activo__isnull=True) | Q(colegiado_activo=''))

        # ---------- Conteos ----------
        # Por género (incluyendo no especificado)
        total_masculino = qs.filter(id_persona__genero='M').count()
        total_femenino = qs.filter(id_persona__genero='F').count()
        total_no_especificado = qs.filter(id_persona__genero__isnull=True).count()
        counts_genero = [
            {'id_persona__genero': 'M', 'total': total_masculino},
            {'id_persona__genero': 'F', 'total': total_femenino},
            {'id_persona__genero': None, 'total': total_no_especificado},
        ]

        # Por renglón
        counts_renglon = qs.values(
            renglon_id=F('id_renglon_id'),
            codigo=F('id_renglon__codigo'),
            descripcion=F('id_renglon__descripcion')
        ).annotate(total=Count('id_empleado')).order_by('-total')

        # Por servicio
        counts_servicio = qs.values(
            servicio_id=F('id_servicio_id'),
            nombre=F('id_servicio__nombre')
        ).annotate(total=Count('id_empleado')).order_by('-total')

        # Por colegiado activo
        colegiado_si = qs.filter(colegiado_activo__isnull=False).exclude(colegiado_activo='').count()
        colegiado_no = qs.filter(Q(colegiado_activo__isnull=True) | Q(colegiado_activo='')).count()
        counts_colegiado = {
            'colegiado_activo': colegiado_si,
            'no_colegiado': colegiado_no
        }

        # ---------- Datos de empleados (tabla) ----------
        employees = []
        for emp in qs.select_related('id_persona', 'id_renglon', 'id_servicio'):
            persona = emp.id_persona

            # Nombre completo
            nombre_completo = f"{persona.primer_nombre} {persona.primer_apellido}"
            if persona.segundo_nombre:
                nombre_completo += f" {persona.segundo_nombre}"
            if persona.segundo_apellido:
                nombre_completo += f" {persona.segundo_apellido}"

            # Género (texto claro)
            if persona.genero == 'M':
                genero_texto = 'Masculino'
            elif persona.genero == 'F':
                genero_texto = 'Femenino'
            else:
                genero_texto = 'No especificado'

            employees.append({
                'id_empleado': emp.id_empleado,
                'numero_empleado': emp.numero_empleado,
                'nombre_completo': nombre_completo,
                'renglon_codigo': emp.id_renglon.codigo if emp.id_renglon else '',
                'servicio_nombre': emp.id_servicio.nombre if emp.id_servicio else '',
                'ubicacion_fisica': emp.ubicacion_fisica or '',
                'colegiado_activo': 'Sí' if emp.colegiado_activo else 'No',
                'genero': genero_texto,
                'puesto_oficial': emp.puesto_oficial or '',
                'departamento': persona.departamento or '',
                'municipio': persona.municipio or '',
                'fecha_contratacion': emp.fecha_contratacion,
                'salario': str(emp.salario) if emp.salario is not None else '',
            })

        response_data = {
            'counts': {
                'genero': counts_genero,
                'renglon': list(counts_renglon),
                'servicio': list(counts_servicio),
                'colegiado': counts_colegiado,
            },
            'employees': employees,
        }
        return Response(response_data)
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return Response({'error': str(e)}, status=500)