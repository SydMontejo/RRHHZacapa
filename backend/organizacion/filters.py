from django_filters import rest_framework as filters
from .models import Permiso, Vacacion

class PermisoFilter(filters.FilterSet):
    fecha_requerida = filters.DateFromToRangeFilter()

    class Meta:
        model = Permiso
        fields = ['estado', 'fecha_requerida']

class VacacionFilter(filters.FilterSet):
    fecha_inicio = filters.DateFromToRangeFilter()
    #fecha_solicitud = filters.DateFromToRangeFilter()

    class Meta:
        model = Vacacion
        fields = ['estado', 'fecha_inicio'] 