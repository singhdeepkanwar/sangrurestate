from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, LeadViewSet, RegisterView, ContactViewSet, ManageUserView, SellerLeadsView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'properties', PropertyViewSet)
router.register(r'leads', LeadViewSet)
router.register(r'contact', ContactViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Returns access/refresh tokens
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/me/', ManageUserView.as_view(), name='me'),
    path('seller/leads/', SellerLeadsView.as_view(), name='seller-leads'),
]