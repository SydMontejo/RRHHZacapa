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
    fecha_nacimiento = models.DateField(null=True, blank=True)
    genero = models.CharField(max_length=10, choices=[('M','Masculino'),('F', 'Femenino')], blank=True, null=True)
    nivel_academico = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.primer_nombre} {self.primer_apellido}"

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
    salario = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0.00)
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

class Permiso(models.Model):
    ESTADO_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('APROBADO', 'Aprobado'),
        ('RECHAZADO', 'Rechazado'),
    ]

    id_permiso = models.AutoField(primary_key=True)
    id_empleado = models.ForeignKey('Empleado', on_delete=models.CASCADE, db_column='id_empleado')
    motivo = models.TextField()
    fecha_solicitud = models.DateField(auto_now_add=True)
    fecha_requerida = models.DateField()
    dias_solicitados = models.PositiveIntegerField(default=1)
    fecha_aprobacion = models.DateField(null=True, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='PENDIENTE')
    documento = models.FileField(upload_to='permisos/', null=True, blank=True)
    observaciones = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    autorizado_por = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'permisos'
        ordering = ['-fecha_solicitud']

    def __str__(self):
        return f"Permiso {self.id_permiso} - {self.id_empleado}"

class Vacacion(models.Model):
    ESTADO_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('APROBADO', 'Aprobado'),
        ('RECHAZADO', 'Rechazado'),
    ]

    id_vacacion = models.AutoField(primary_key=True)
    id_empleado = models.ForeignKey('Empleado', on_delete=models.CASCADE, db_column='id_empleado')
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    documento_autorizacion = models.FileField(upload_to='vacaciones/', null=True, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='PENDIENTE')
    observaciones = models.TextField(null=True, blank=True)
    fecha_solicitud = models.DateField(auto_now_add=True)
    fecha_aprobacion = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vacaciones'
        ordering = ['-fecha_solicitud']

    def __str__(self):
        return f"Vacación {self.id_vacacion} - {self.id_empleado}"
    
# models.py
from django.db import models
from django.conf import settings

class Sancion(models.Model):
    id_sancion = models.AutoField(primary_key=True)
    id_empleado = models.ForeignKey('Empleado', on_delete=models.CASCADE, db_column='id_empleado')
    fecha_sancion = models.DateField()
    detalle = models.TextField(max_length=500)
    documento = models.FileField(upload_to='sanciones/', null=True, blank=True)
    activo = models.BooleanField(default=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'sanciones'
        ordering = ['-fecha_sancion']

    def __str__(self):
        return f"Sanción {self.id_sancion} - {self.id_empleado.numero_empleado}"
    
class MovimientoPersonal(models.Model):
    TIPO_CHOICES = (
        ('ENTREGA_PUESTO', 'Entrega de Puesto'),
        ('TOMA_PUESTO', 'Toma de Puesto'),
    )
    id_movimiento = models.AutoField(primary_key=True)
    id_empleado = models.ForeignKey('Empleado', on_delete=models.CASCADE, db_column='id_empleado')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    fecha_efectiva = models.DateField()
    descripcion = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'movimientos_personal'
        ordering = ['-fecha_efectiva']

    def __str__(self):
        return f"{self.tipo} - {self.id_empleado} - {self.fecha_efectiva}"