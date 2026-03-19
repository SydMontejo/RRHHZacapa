from rest_framework.routers import DefaultRouter
from .views import RolViewSet, RenglonViewSet, ServicioWiewSet

router = DefaultRouter()
router.register(r'roles', RolViewSet, basename='roles')
router.register(r'renglones', RenglonViewSet)
router.register(r'servicios', ServicioWiewSet)

urlpatterns = router.urls