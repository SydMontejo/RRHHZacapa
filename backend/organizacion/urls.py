from rest_framework.routers import DefaultRouter
from .views import RolViewSet, RenglonViewSet, ServicioWiewSet, PersonaViewSet, EmpleadoViewSet, ContratoViewSet

router = DefaultRouter()
router.register(r'roles', RolViewSet, basename='roles')
router.register(r'renglones', RenglonViewSet)
router.register(r'servicios', ServicioWiewSet)
router.register(r'personas', PersonaViewSet)
router.register(r'empleados', EmpleadoViewSet)
router.register(r'contratos', ContratoViewSet)
urlpatterns = router.urls