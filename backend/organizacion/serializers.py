from rest_framework import serializers
from .models import Rol
from .models import Renglon
class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = ['id', 'nombre', 'descripcion', 'activo']

class RenglonSerializer(serializers.ModelSerializer):

    class Meta:
        model = Renglon
        fields = "__all__"