from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin, BaseUserManager
from django.utils import timezone


class UsuarioManager(BaseUserManager):

    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('El usuario debe tener username')

        user = self.model(username=username, **extra_fields)
        user.set_password(password)  # HASH automático
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('activo', True)

        return self.create_user(username, password, **extra_fields)


class Usuario(AbstractUser, PermissionsMixin):

    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(null=True, blank=True)

    id_rol = models.ForeignKey(
        'organizacion.Rol',
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )

    intentos_fallidos = models.IntegerField(default=0)
    bloqueado_hasta = models.DateTimeField(null=True, blank=True)
    ultimo_acceso = models.DateTimeField(null=True, blank=True)

    activo = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UsuarioManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username