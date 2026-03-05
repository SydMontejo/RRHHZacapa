# from rest_framework import serializers
# from .models import Usuario

# class UsuarioSerializer(serializers.ModelSerializer):
#     rol_nombre = serializers.CharField(
#         source='id_rol.nombre',
#         read_only=True
#     )
#     class Meta:
#         model = Usuario
#         fields = ['id', 'username', 'password', 'id_rol', 'rol_nombre']
#         extra_kwargs = {
#             'password': {'write_only': True}
#         }

#     def create(self, validated_data):
#         user = Usuario.objects.create_user(
#             username=validated_data['username'],
#             password=validated_data['password'],
#             rol=validated_data['id_rol']
#         )
#         return user
from rest_framework import serializers
from .models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):

    rol_nombre = serializers.CharField(
        source='id_rol.nombre',
        read_only=True
    )

    class Meta:
        model = Usuario
        fields = [
            'id',
            'username',
            'password',
            'id_rol',
            'rol_nombre',
            'activo'
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def create(self, validated_data):
        return Usuario.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance