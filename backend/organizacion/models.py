from django.db import models
from django.utils import timezone
from django.conf import settings


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
    
class Servicio(models.Model):

    id_servicio = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=150, blank=True, null=True)

    activo = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "servicios"

    def __str__(self):
        return self.nombre

class Persona(models.Model):
    id_persona = models.AutoField(primary_key=True)
    primer_nombre = models.CharField(max_length=50)
    segundo_nombre = models.CharField(max_length=50)
    tercer_nombre = models.CharField(max_length=50, blank=True, null=True)
    primer_apellido = models.CharField(max_length=50)
    segundo_apellido = models.CharField(max_length=50)
    apellido_casada = models.CharField(max_length=50, blank=True, null=True)
    direccion = models.CharField(max_length=200, null=True, blank=True)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    dpi = models.CharField(max_length=13, unique=True)
    correo = models.EmailField(max_length=120, unique=True)
    foto = models.ImageField(upload_to='personas/', null=True, blank=True)
    nit = models.CharField(max_length=20, null=True, blank=True, unique=True)
    departamento = models.CharField(max_length=100)
    municipio = models.CharField(max_length=100)
    activo = models.BooleanField(default=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"

class Empleado(models.Model):
    id_empleado = models.AutoField(primary_key=True)

    id_persona = models.OneToOneField(
        'Persona',
        on_delete=models.RESTRICT,
        db_column='id_persona'
    )

    id_usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL, #esto porque Usuario esta en otra carpeta.
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='id_usuario'
    )

    numero_empleado = models.CharField(max_length=20, unique=True)

    fecha_contratacion = models.DateField(null=True, blank=True)

    id_renglon = models.ForeignKey(
        'Renglon',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='id_renglon'
    )

    id_servicio = models.ForeignKey(
        'Servicio',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='id_servicio'
    )

    puesto_oficial = models.CharField(max_length=100, null=True, blank=True)
    especializacion = models.CharField(max_length=100, null=True, blank=True)

    colegiado_activo = models.CharField(max_length=30, null=True, blank=True)
    ubicacion_fisica = models.CharField(max_length=150, null=True, blank=True)

    comisionado_seccion_numero = models.CharField(max_length=20, null=True, blank=True)
    comisionado_seccion_nombre = models.CharField(max_length=100, null=True, blank=True)

    activo = models.BooleanField(default=True)

    deleted_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, #igual que arriba, Usuario esta en otra carpeta
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='empleados_creados',
        db_column='created_by'
    )

    def __str__(self):
        return self.numero_empleado

class Contrato(models.Model):
    id_contrato = models.AutoField(primary_key=True)

    id_empleado = models.ForeignKey(
        'Empleado',
        on_delete=models.CASCADE,
        db_column='id_empleado'
    )

    tipo_contrato = models.CharField(max_length=10)

    id_renglon = models.ForeignKey(
        'Renglon',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='id_renglon'
    )

    id_servicio = models.ForeignKey(
        'Servicio',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='id_servicio'
    )

    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(null=True, blank=True)

    salario = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    activo = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)