from rest_framework.routers import DefaultRouter
from .views import RolViewSet, RenglonViewSet, ServicioWiewSet, PersonaViewSet, EmpleadoViewSet, ContratoViewSet, PermisoViewSet, VacacionViewSet, SancionViewSet, MovimientoPersonalViewSet

router = DefaultRouter()
router.register(r'roles', RolViewSet, basename='roles')
router.register(r'renglones', RenglonViewSet)
router.register(r'servicios', ServicioWiewSet)
router.register(r'personas', PersonaViewSet)
router.register(r'empleados', EmpleadoViewSet)
router.register(r'contratos', ContratoViewSet)
router.register(r'permisos', PermisoViewSet)
router.register(r'vacaciones', VacacionViewSet, basename='vacasiones')
router.register(r'sanciones', SancionViewSet, basename='sanciones')
router.register(r'movimientos-personal', MovimientoPersonalViewSet, basename='movimientos-personal')

urlpatterns = router.urls