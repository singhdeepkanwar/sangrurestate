from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    city = models.CharField(max_length=100, default='Sangrur')
    address = models.TextField(null=True, blank=True)
    is_phone_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name

class Property(models.Model):
    submitted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='properties')
    title = models.CharField(max_length=200)
    price = models.CharField(max_length=100) # Text for now (e.g. "1.5 Cr")
    location = models.CharField(max_length=200)
    colony = models.CharField(max_length=200)
    type = models.CharField(max_length=50, default='House')
    area = models.CharField(max_length=100)
    beds = models.IntegerField(default=0)
    baths = models.IntegerField(default=0)
    status = models.CharField(max_length=50, default='Available')
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='property_images/')
    
    def __str__(self):
        return f"Image for {self.property.title}"
    
class Lead(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='leads', null=True)
    buyer_name = models.CharField(max_length=200)
    buyer_phone = models.CharField(max_length=20)
    status = models.CharField(max_length=50, default='New')
    created_at = models.DateTimeField(auto_now_add=True)

class Contact(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} - {self.email}"
    
# Signal to auto-create Profile when User is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)