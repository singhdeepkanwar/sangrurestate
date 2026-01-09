from django.contrib import admin
from .models import Property, Lead, Contact, PropertyImage

# Register your models here.
# admin.site.register(Property)
admin.site.register(Lead)
admin.site.register(Contact)
admin.site.register(PropertyImage)

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    inlines = [PropertyImageInline]