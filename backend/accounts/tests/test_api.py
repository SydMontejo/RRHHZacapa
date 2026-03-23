from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework import status
from organizacion.models import Rol 

# Modelo Usuario personalizado
User = get_user_model()

class UsuarioAPITest(TestCase):

    def setUp(self):
        """Configuración inicial para cada prueba"""
        self.client = APIClient()

        # Crear un Rol en la base de datos de prueba
        # Esto es obligatorio porque modelo Usuario tiene un ForeignKey a Rol
        self.rol_admin = Rol.objects.create(nombre="Administrador")

        # Crear el superusuario inicial
        self.admin = User.objects.create_superuser(
            username="admin",
            password="1234567"
        )

        # URLs
        self.login_url = "/api/token/"
        self.usuarios_url = "/api/usuarios/"

    def test_login_admin(self):
        """Verifica que el login con SimpleJWT funciona correctamente"""
        response = self.client.post(
            self.login_url,
            {
                "username": "admin",
                "password": "1234567"
            },
            format="json"
        )
        
        # Verificamos éxito y presencia del token de acceso
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_crear_usuario(self):
        """Verifica la creación de un usuario a través del ViewSet"""
        
        #Autenticación
        #Obtenemos el token para el admin
        login_res = self.client.post(
            self.login_url,
            {"username": "admin", "password": "1234567"},
            format="json"
        )
        token = login_res.data["access"]
        
        # Configuramos las credenciales para las siguientes peticiones
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        # Creación del nuevo usuario
        # Enviamos 'id_rol'
        payload = {
            "username": "usuario_nuevo",
            "password": "password_seguro_123",
            "id_rol": self.rol_admin.id,
            "activo": True
        }
        
        response = self.client.post(
            self.usuarios_url,
            payload,
            format="json"
        )

        
        # El estatus debe ser 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Comprobamos que el username sea correcto
        self.assertEqual(response.data["username"], "usuario_nuevo")
        
        # Verificamos que 'rol_nombre' se haya generado bien
        self.assertEqual(response.data["rol_nombre"], "Administrador")

    def test_crear_usuario_sin_token(self):
        """Prueba de seguridad: un usuario anónimo no puede crear usuarios"""
        payload = {
            "username": "hacker",
            "password": "123",
            "id_rol": self.rol_admin.id
        }
        response = self.client.post(self.usuarios_url, payload, format="json")
        
        # Debe devolver 401 Unauthorized o 403 Forbidden 
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)