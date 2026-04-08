from rest_framework import serializers
from .models import Rol
from .models import Renglon
from .models import Servicio
from .models import Persona
from .models import Empleado
from .models import Contrato
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
    persona_nombre = serializers.SerializerMethodField()
    renglon_codigo = serializers.CharField(source='id_renglon.codigo', read_only=True)
    servicio_nombre = serializers.CharField(source='id_servicio.nombre', read_only=True)
    foto_persona = serializers.SerializerMethodField()
    id_persona = PersonaSerializer(read_only=True)

    class Meta:
        model = Empleado
        fields = '__all__'

    def get_persona_nombre(self, obj):
        p = obj.id_persona
        return f"{p.primer_nombre} {p.primer_apellido}"
    
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

class ContratoSerializer(serializers.ModelSerializer):

    empleado_nombre = serializers.CharField(source='id_empleado.id_persona.primer_nombre', read_only=True)

    class Meta:
        model = Contrato
        fields = '__all__'