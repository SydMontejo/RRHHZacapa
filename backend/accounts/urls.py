# from django.urls import path
# from .views import CrearUsuarioView

# urlpatterns = [
#     path('usuarios/', CrearUsuarioView.as_view(), name='crear_usuario'),
# ]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, UsuarioActualView
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuarios')

urlpatterns = [
    path('me/', UsuarioActualView.as_view(), name='usuario-actual'),
]

urlpatterns += router.urls

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

