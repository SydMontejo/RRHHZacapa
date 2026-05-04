from django.contrib.auth.models import AnonymousUser
from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()

class DRFTokenAuthMiddleware(MiddlewareMixin):
    """
    Middleware para autenticar usuarios con JWT (SimpleJWT) 
    y dejarlos en request.user antes de que auditlog middleware actúe.
    """
    def process_request(self, request):
        # Si ya hay un usuario autenticado por sesión, no hacer nada
        if hasattr(request, 'user') and request.user.is_authenticated:
            return
        
        # Obtener token del header
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return
        
        token_key = auth_header.split(' ')[1]
        try:
            # Decodificar token 
            access_token = AccessToken(token_key)
            user_id = access_token.get('user_id')
            user = User.objects.get(id=user_id)
            request.user = user
            # request._cached_user para DRF
            request._cached_user = user
        except Exception:
            request.user = AnonymousUser()