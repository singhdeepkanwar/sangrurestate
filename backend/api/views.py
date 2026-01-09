from rest_framework import viewsets, permissions, status, mixins, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Property, Lead, Contact
from .serializers import PropertySerializer, LeadSerializer, RegisterSerializer, ContactSerializer
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer

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
        serializer.save(submitted_by=self.request.user)

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