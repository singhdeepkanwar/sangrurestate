from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Property, Lead, Profile, Contact, PropertyImage

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image']
    
class PropertySerializer(serializers.ModelSerializer):
    # --- READ: Show nested images and owner name ---
    images = PropertyImageSerializer(many=True, read_only=True)
    submitted_by = serializers.SerializerMethodField()
    
    # --- WRITE: Accept file uploads ---
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True
    )

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'price', 'location', 'colony', 'type', 'area', 
            'beds', 'baths', 'status', 'description', 
            'submitted_by',  # <--- Field we fixed
            'created_at', 
            'images',        # <--- Field that shows photos
            'uploaded_images' # <--- Field for uploading
        ]
        read_only_fields = ['submitted_by', 'created_at']

    # --- LOGIC for Owner Name ---
    def get_submitted_by(self, obj):
        if obj.owner:
            return obj.owner.first_name if obj.owner.first_name else obj.owner.username
        return "Sangrur Estate"

    # --- LOGIC for Saving Property + Images ---
    def create(self, validated_data):
        # 1. Pop images
        uploaded_images = validated_data.pop('uploaded_images')
        
        # 2. Get the user from context (passed by the View)
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['owner'] = request.user

        # 3. Create Property
        property = Property.objects.create(**validated_data)
        
        # 4. Create Images
        for image in uploaded_images:
            PropertyImage.objects.create(property=property, image=image)
            
        return property
    
class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email'] # username will be used as email

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['full_name', 'phone', 'city']
class UserProfileSerializer(serializers.ModelSerializer):
    # This combines first_name and last_name, or returns username if empty
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name']

    def get_full_name(self, obj):
        # If you saved 'full_name' into first_name during register, return that
        return obj.first_name if obj.first_name else obj.username
    
class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)
    phone = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'full_name', 'phone']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'], # Use email as username
            email=validated_data['email'],
            password=validated_data['password']
        )
        # Update the auto-created profile
        user.profile.full_name = validated_data['full_name']
        user.profile.phone = validated_data['phone']
        user.profile.save()
        return user



class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = '__all__'

class DashboardPropertySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    leads_count = serializers.IntegerField(read_only=True) # Calculated field

    class Meta:
        model = Property
        fields = ['id', 'title', 'price', 'location', 'status', 'image', 'leads_count', 'created_at']

    def get_image(self, obj):
        first_image = obj.images.first()
        if first_image:
            return first_image.image.url
        return None

# Update the MyInterestSerializer to use the new 'buyer' field filter
class MyInterestSerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(source='property.title', read_only=True)
    property_location = serializers.CharField(source='property.location', read_only=True)
    property_price = serializers.CharField(source='property.price', read_only=True)
    property_id = serializers.IntegerField(source='property.id', read_only=True)
    date_contacted = serializers.DateTimeField(source='created_at', format="%Y-%m-%d")

    class Meta:
        model = Lead
        fields = ['id', 'property_id', 'property_title', 'property_location', 'property_price', 'date_contacted']