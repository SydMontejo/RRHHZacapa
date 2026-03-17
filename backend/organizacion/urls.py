from rest_framework.routers import DefaultRouter
from .views import RolViewSet, RenglonViewSet

router = DefaultRouter()
router.register(r'roles', RolViewSet, basename='roles')
router.register(r'renglones', RenglonViewSet)

urlpatterns = router.urls