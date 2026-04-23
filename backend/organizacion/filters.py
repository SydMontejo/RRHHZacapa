from django_filters import rest_framework as filters
from .models import Permiso

class PermisoFilter(filters.FilterSet):
    fecha_requerida = filters.DateFromToRangeFilter()

    class Meta:
        model = Permiso
        fields = ['estado', 'fecha_requerida']