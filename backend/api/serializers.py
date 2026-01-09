from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Property, Lead, Profile, Contact, PropertyImage

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image']

class PropertySerializer(serializers.ModelSerializer):
    # For Reading: This will show a list of nested image objects
    images = PropertyImageSerializer(many=True, read_only=True)
    
    # For Writing: This accepts a list of files in the POST request
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True
    )

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'price', 'location', 'colony', 'type', 'area', 
            'beds', 'baths', 'status', 'description', 'submitted_by', 
            'created_at', 'images', 'uploaded_images' 
        ]
        read_only_fields = ['submitted_by', 'created_at']

    def create(self, validated_data):
        # 1. Pop the images out of the data
        uploaded_images = validated_data.pop('uploaded_images')
        
        # 2. Create the Property
        property = Property.objects.create(**validated_data)
        
        # 3. Create each PropertyImage linked to the Property
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