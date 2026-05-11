# from django.shortcuts import render
# from rest_framework import generics
# from .models import Usuario
# from .serializers import UsuarioSerializer
# from .permissions import EsAdminSistema

# class CrearUsuarioView(generics.CreateAPIView):
#     queryset = Usuario.objects.all()
#     serializer_class = UsuarioSerializer
#     permission_classes = [EsAdminSistema]
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Usuario
from .serializers import UsuarioSerializer
from .permissions import EsAdminSistema

class UsuarioActualView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        first_name = user.first_name or ''
        last_name = user.last_name or ''

        return Response({
            "id": user.id,
            "username": user.username,
            "first_name": first_name,
            "last_name": last_name,
            "rol": user.id_rol.nombre if user.id_rol else None,
            "activo": user.activo
        })

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [EsAdminSistema]

# class UsuarioActualView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         first_name = user.first_name or ''
#         last_name = user.last_name or ''

#         return Response({
#             "id": user.id,
#             "username": user.username,
#             "first_name": first_name,
#             "last_name": last_name,
#             "rol": user.id_rol.nombre if user.id_rol else None,
#             "activo": user.activo
#         })