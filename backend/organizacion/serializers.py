from rest_framework import serializers
from .models import Rol
from .models import Renglon
from .models import Servicio
from .models import Persona
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

