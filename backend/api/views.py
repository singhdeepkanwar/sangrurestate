from rest_framework import viewsets, permissions, status, mixins, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Property, Lead, Contact, PropertyImage
from .serializers import PropertySerializer, LeadSerializer, RegisterSerializer, ContactSerializer, UserProfileSerializer, DashboardPropertySerializer, MyInterestSerializer
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny
from django.db.models import Count

class ManageUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "email": user.email,
            "full_name": user.profile.full_name,
            "phone": user.profile.phone,
            "city": user.profile.city,
            "address": user.profile.address
        })
    
# 1. Registration View
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 2. Property ViewSet (Handles GET, POST, DELETE automatically)
class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all().order_by('-created_at')
    serializer_class = PropertySerializer
    parser_classes = (MultiPartParser, FormParser) # To handle image uploads

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()] # Everyone can see properties
        return [permissions.IsAuthenticated()] # Only logged in can add

    def perform_create(self, serializer):
        # Automatically set the user who is logged in
        serializer.save(owner=self.request.user)         # <--- CORRECT

# 3. Lead ViewSet
class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [permissions.AllowAny] # Allow public to submit leads


class ContactViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [permissions.AllowAny] # Allow anyone to submit a form


class SellerLeadsView(generics.ListAPIView):
    serializer_class = LeadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # This logic finds leads for all properties 
        # submitted by the logged-in user
        return Lead.objects.filter(property__submitted_by=self.request.user).order_by('-created_at')
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    # request.user is automatically populated because of the Token in the header
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)


# ... keep login/register/profile views ...

# --- PROPERTY ENDPOINTS ---

@api_view(['GET'])
@permission_classes([AllowAny])
def get_properties(request):
    properties = Property.objects.all().order_by('-created_at')
    serializer = PropertySerializer(properties, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated]) # Must be logged in to post
@parser_classes([MultiPartParser, FormParser])
def create_property(request):
    # Pass context to serializer to access request.user if needed, 
    # but manually saving owner is easier here:
    
    data = request.data
    images = request.FILES.getlist('uploaded_images')

    # Create Property Object
    new_property = Property.objects.create(
        owner=request.user,  # <--- SAVE THE OWNER
        title=data.get('title'),
        price=data.get('price'),
        location=data.get('location'),
        colony=data.get('colony'),
        type=data.get('type'),
        area=data.get('area'),
        beds=data.get('beds') if data.get('beds') else None,
        baths=data.get('baths') if data.get('baths') else None,
        description=data.get('description'),
        status='Available'
    )

    # Save Images
    for image in images:
        PropertyImage.objects.create(property=new_property, image=image)

    return Response({"message": "Property created successfully", "id": new_property.id})

# --- DASHBOARD ENDPOINTS (NEW) ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_listings(request):
    # Fetch properties owned by current user AND count their leads
    properties = Property.objects.filter(owner=request.user).annotate(leads_count=Count('leads')).order_by('-created_at')
    serializer = DashboardPropertySerializer(properties, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_interests(request):
    # FILTER BY BUYER (The new field)
    leads = Lead.objects.filter(buyer=request.user).select_related('property').order_by('-created_at')
    serializer = MyInterestSerializer(leads, many=True)
    return Response(serializer.data)

# --- LEAD ENDPOINTS ---

@api_view(['POST'])
@permission_classes([AllowAny])
def submit_lead(request):
    data = request.data
    try:
        property_instance = Property.objects.get(id=data.get('property'))
        
        # Determine Buyer (User object or None)
        buyer_user = request.user if request.user.is_authenticated else None
        
        # Determine Seller (The owner of the property)
        seller_user = property_instance.owner

        Lead.objects.create(
            property=property_instance,
            buyer=buyer_user,       # Save the logged-in buyer
            seller=seller_user,     # Save the property owner
            buyer_name=data.get('buyer_name'),
            buyer_phone=data.get('buyer_phone')
        )
        return Response({"message": "Lead submitted successfully"})
    except Property.DoesNotExist:
        return Response({"error": "Property not found"}, status=404)