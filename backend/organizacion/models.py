from django.db import models
from django.utils import timezone


class Rol(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.CharField(max_length=150, blank=True)

    activo = models.BooleanField(default=True)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre


class Renglon(models.Model):

    id_renglon = models.AutoField(primary_key=True)
    codigo = models.CharField(max_length=10, unique=True)
    descripcion = models.CharField(max_length=150)
    tipo_presupuestario = models.CharField(max_length=100)

    activo = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "renglones"

    def __str__(self):
        return f"{self.codigo} - {self.descripcion}"