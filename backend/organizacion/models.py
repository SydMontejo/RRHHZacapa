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