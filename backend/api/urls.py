from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, LeadViewSet, RegisterView, ContactViewSet, ManageUserView, SellerLeadsView,get_profile, get_properties, create_property, get_my_listings, get_my_interests, submit_lead
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'properties', PropertyViewSet)
router.register(r'leads', LeadViewSet)
router.register(r'contact', ContactViewSet)

urlpatterns = [
    path('properties/', get_properties, name='get_properties'),
    path('properties/create/', create_property, name='create_property'),
    path('properties/my-listings/', get_my_listings, name='my_listings'),
    path('leads/my-interests/', get_my_interests, name='my_interests'),
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Returns access/refresh tokens
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', get_profile, name='get_profile'),

    path('users/me/', ManageUserView.as_view(), name='me'),
    path('seller/leads/', SellerLeadsView.as_view(), name='seller-leads'),

    
    # path('properties/<int:pk>/', get_property_detail, name='property_detail'),



    path('leads/', submit_lead, name='submit_lead'),

]