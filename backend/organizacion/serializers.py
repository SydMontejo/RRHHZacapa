from rest_framework import serializers, status
from rest_framework.response import Response
from django.utils import timezone
from .models import Rol
from .models import Renglon
from .models import Servicio
from .models import Persona
from .models import Empleado
from .models import Contrato
from .models import Permiso
from .models import Vacacion
from .models import MovimientoPersonal
from datetime import date
class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = ['id', 'nombre', 'descripcion', 'activo']

class RenglonSerializer(serializers.ModelSerializer):

    class Meta:
        model = Renglon
        fields = "__all__"

class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = "__all__"

class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = '__all__'

    def validate_dpi(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("El DPI debe contener solo numeros.")
        if len(value) != 13:
            raise serializers.ValidationError("El DPI debe tener 13 digitos.")
        return value

class EmpleadoSerializer(serializers.ModelSerializer):
    #queryset = Empleado.objects.all()

    search_fields = ['numero_empleado','id_persona__dpi', 'id_persona__primer_nombre']
    salario = serializers.DecimalField(
    max_digits=10,
    decimal_places=2,
    coerce_to_string=False)
    persona_nombre = serializers.SerializerMethodField()
    renglon_codigo = serializers.CharField(source='id_renglon.codigo', read_only=True)
    servicio_nombre = serializers.CharField(source='id_servicio.nombre', read_only=True)
    foto_persona = serializers.SerializerMethodField()
    #id_persona = PersonaSerializer(read_only=True)
    persona_detalle = PersonaSerializer(source='id_persona', read_only=True)

    class Meta:
        model = Empleado
        fields = '__all__'

    def get_persona_nombre(self, obj):
        p = obj.id_persona
        nombres = p.primer_nombre
        if p.segundo_nombre:
            nombres += f" {p.segundo_nombre}"
        if p.tercer_nombre:
            nombres += f" {p.tercer_nombre}"
        # Construir apellidos
        apellidos = p.primer_apellido
        if p.segundo_apellido:
            apellidos += f" {p.segundo_apellido}"
        if p.apellido_casada:
            apellidos += f" {p.apellido_casada}"
        # return f"{p.primer_nombre} {p.primer_apellido}"
        return f"{nombres} {apellidos}"

    def validate_id_persona(self, value):
        if self.instance:
            existe = Empleado.objects.filter(id_persona=value).exclude(pk=self.instance.pk).exists()
        else:
            existe = Empleado.objects.filter(id_persona=value).exists()

        if existe:
            raise serializers.ValidationError("Esta persona ya es empleado")
        return value

    def get_foto_persona(self, obj):
        if obj.id_persona and obj.id_persona.foto:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.id_persona.foto.url)
            return obj.id_persona.foto.url
        return None

    def destroy(self, request, *args, **kwargs):
        empleado = self.get_object()
        # Eliminación lógica: marcar como inactivo y guardar fecha
        empleado.activo = False
        empleado.deleted_at = timezone.now()
        empleado.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ContratoSerializer(serializers.ModelSerializer):

    empleado_nombre = serializers.CharField(source='id_empleado.id_persona.primer_nombre', read_only=True)
    empleado_nombre_completo = serializers.SerializerMethodField()

    class Meta:
        model = Contrato
        fields = '__all__'

    def get_empleado_nombre_completo(self, obj):
        p = obj.id_empleado.id_persona
        # Construir nombres
        nombres = p.primer_nombre
        if p.segundo_nombre:
            nombres += f" {p.segundo_nombre}"
        if p.tercer_nombre:
            nombres += f" {p.tercer_nombre}"
        # Construir apellidos
        apellidos = p.primer_apellido
        if p.segundo_apellido:
            apellidos += f" {p.segundo_apellido}"
        if p.apellido_casada:
            apellidos += f" {p.apellido_casada}"
        return f"{nombres} {apellidos}".strip()

class PermisoSerializer(serializers.ModelSerializer):
    #empleado_nombre = serializers.SerializerMethodField()
    #empleado_apellido = serializers.SerializerMethodField()
    empleado_nombre_completo = serializers.SerializerMethodField()
    empleado_numero =  serializers.SerializerMethodField()
    empleado_ubicacion = serializers.SerializerMethodField()
    empleado_servicio = serializers.SerializerMethodField()
    documento_url = serializers.SerializerMethodField()



    class Meta:
        model = Permiso
        fields = '__all__'
        read_only_fields = ('fecha_solicitud', 'created_at', 'updated_at')

    # def get_empleado_nombre(self, obj):
    #     if obj.id_empleado and obj.id_empleado.id_persona:
    #         return obj.id_empleado.id_persona.primer_nombre
    #     return ''

    # def get_empleado_apellido(self, obj):
    #     if obj.id_empleado and obj.id_empleado.id_persona:
    #         return obj.id_empleado.id_persona.primer_apellido
    #     return ''

    def get_empleado_nombre_completo(self, obj):
        if not obj.id_empleado or not obj.id_empleado.id_persona:
            return ''
        p = obj.id_empleado.id_persona
        nombres = p.primer_nombre
        if p.segundo_nombre:
            nombres += f" {p.segundo_nombre}"
        if p.tercer_nombre:
            nombres += f" {p.tercer_nombre}"
        apellidos = p.primer_apellido
        if p.segundo_apellido:
            apellidos += f" {p.segundo_apellido}"
        if p.apellido_casada:
            apellidos += f" {p.apellido_casada}"
        return f"{nombres} {apellidos}".strip()
    
    def get_empleado_numero(self, obj):
        if obj.id_empleado:
            return obj.id_empleado.numero_empleado
        return ''
    
    def get_empleado_ubicacion(self, obj):
        if obj.id_empleado:
            return obj.id_empleado.ubicacion_fisica or ''
        return ''
    
    def get_empleado_servicio(self, obj):
        if obj.id_empleado and obj.id_empleado.id_servicio:
            return obj.id_empleado.id_servicio.nombre
        return ''

    def get_documento_url(self, obj):
        if obj.documento:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.documento.url)
            return obj.documento.url
        return None

    def validate_dias_solicitados(self, value):
        if value < 1:
            raise serializers.ValidationError("Los días solicitados deben ser al menos 1.")
        return value

class VacacionSerializer(serializers.ModelSerializer):
    empleado_nombre = serializers.SerializerMethodField()
    empleado_apellido = serializers.SerializerMethodField()
    documento_url = serializers.SerializerMethodField()
    estado_display = serializers.SerializerMethodField()
    empleado_numero = serializers.SerializerMethodField()
    empleado_ubicacion = serializers.SerializerMethodField()
    empleado_nombre_completo = serializers.SerializerMethodField()
    dias_solicitados = serializers.SerializerMethodField()

    class Meta:
        model = Vacacion
        fields = '__all__'
        read_only_fields = ('fecha_solicitud', 'fecha_aprobacion', 'created_at', 'updated_at')

    def get_empleado_nombre(self, obj):
        # print(f"DEBUG: obj.id_empleado = {obj.id_empleado}")
        # if obj.id_empleado:
        #     print(f"DEBUG: obj.id_empleado.id_persona = {obj.id_empleado.id_persona}")
        #     if obj.id_empleado.id_persona:
        #         print(f"DEBUG: primer_nombre = {obj.id_empleado.id_persona.primer_nombre}")
        return obj.id_empleado.id_persona.primer_nombre if obj.id_empleado and obj.id_empleado.id_persona else ''

    def get_empleado_apellido(self, obj):
        if obj.id_empleado and obj.id_empleado.id_persona:
            p = obj.id_empleado.id_persona
            apellidos = p.primer_apellido
            if p.segundo_apellido:
                apellidos += f" {p.segundo_apellido}"
            return apellidos
        return ''

    def get_documento_url(self, obj):
        if obj.documento_autorizacion:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.documento_autorizacion.url)
            return obj.documento_autorizacion.url
        return None

    def get_estado_display(self, obj):
        hoy = date.today()
        if obj.estado == 'APROBADO' and obj.fecha_inicio <= hoy <= obj.fecha_fin:
            return 'EN_EJECUCION'
        return obj.estado

    def validate(self, data):
        fecha_inicio = data.get('fecha_inicio')
        fecha_fin = data.get('fecha_fin')
        if fecha_inicio and fecha_fin and fecha_inicio > fecha_fin:
            raise serializers.ValidationError("La fecha fin debe ser posterior o igual a la fecha inicio")
        return data
    
    #Metodos para reportes
    def get_empleado_numero(self, obj):
        return obj.id_empleado.numero_empleado if obj.id_empleado else ''

    def get_empleado_ubicacion(self, obj):
        return obj.id_empleado.ubicacion_fisica if obj.id_empleado else ''

    def get_empleado_nombre_completo(self, obj):
        nombre = self.get_empleado_nombre(obj)
        apellido = self.get_empleado_apellido(obj)
        return f"{nombre} {apellido}".strip()

    def get_dias_solicitados(self, obj):
        if obj.fecha_inicio and obj.fecha_fin:
            return (obj.fecha_fin - obj.fecha_inicio).days + 1
        return 0

# serializers.py
from rest_framework import serializers
from .models import Sancion, Empleado, Persona

class SancionSerializer(serializers.ModelSerializer):
    empleado_nombre = serializers.SerializerMethodField()
    empleado_servicio = serializers.SerializerMethodField()
    empleado_ubicacion = serializers.SerializerMethodField()
    documento_url = serializers.SerializerMethodField()

    class Meta:
        model = Sancion
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'activo', 'deleted_at')

    def get_empleado_nombre(self, obj):
        if obj.id_empleado and obj.id_empleado.id_persona:
            p = obj.id_empleado.id_persona
            return f"{p.primer_nombre} {p.primer_apellido}"
        return ''

    def get_empleado_servicio(self, obj):
        if obj.id_empleado and obj.id_empleado.id_servicio:
            return obj.id_empleado.id_servicio.nombre
        return ''

    def get_empleado_ubicacion(self, obj):
        return obj.id_empleado.ubicacion_fisica if obj.id_empleado else ''

    def get_documento_url(self, obj):
        if obj.documento:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.documento.url)
            return obj.documento.url
        return None
    
class MovimientoPersonalSerializer(serializers.ModelSerializer):
    empleado_nombre_completo = serializers.SerializerMethodField()
    empleado_numero = serializers.SerializerMethodField()

    class Meta:
        model = MovimientoPersonal
        fields = '__all__'

    def get_empleado_nombre_completo(self, obj):
        if obj.id_empleado and obj.id_empleado.id_persona:
            p = obj.id_empleado.id_persona
            nombres = p.primer_nombre
            if p.segundo_nombre:
                nombres += f" {p.segundo_nombre}"
            if p.tercer_nombre:
                nombres += f" {p.tercer_nombre}"
            apellidos = p.primer_apellido
            if p.segundo_apellido:
                apellidos += f" {p.segundo_apellido}"
            if p.apellido_casada:
                apellidos += f" {p.apellido_casada}"
            return f"{nombres} {apellidos}".strip()
        return ''

    def get_empleado_numero(self, obj):
        if obj.id_empleado:
            return obj.id_empleado.numero_empleado
        return ''