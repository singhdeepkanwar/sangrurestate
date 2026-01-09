import { X, MapPin, Bed, Bath, Maximize, BadgeCheck, Phone, User } from "lucide-react";
import { Property } from "./PropertyCard";
import StatusBadge from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { submitLead } from "@/api"; // Use your new API helper
import { toast } from "sonner";

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyModal = ({ property, isOpen, onClose }: PropertyModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  
  // State to track which image is currently being viewed in the main frame
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!property) return null;

  // Handle lead submission via Django API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call Django API: POST /api/leads/
      await submitLead({
        property: property.id, // Linking the lead to this property ID
        buyer_name: formData.name,
        buyer_phone: formData.phone,
      });

      setShowSuccess(true);
      setFormData({ name: "", phone: "" });
      toast.success("Request submitted successfully!");
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine the current image to show
  const hasImages = property.images && property.images.length > 0;
  const currentImage = hasImages 
    ? property.images[activeImageIndex].image 
    : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        
        {/* Main Image Gallery Container */}
        <div className="relative group">
          <div className="h-64 md:h-96">
            <img
              src={currentImage}
              alt={property.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Status & Verification Badges */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <StatusBadge status={property.status} />
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
              <BadgeCheck className="w-3.5 h-3.5" />
              Verified Listing
            </div>
          </div>

          {/* Thumbnail Strip (Only shows if there's more than 1 image) */}
          {hasImages && property.images.length > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-2">
               {property.images.map((img, index) => (
                 <button 
                  key={img.id}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-12 h-12 rounded border-2 overflow-hidden transition-all ${
                    activeImageIndex === index ? 'border-primary' : 'border-transparent opacity-70'
                  }`}
                 >
                   <img src={img.image} className="w-full h-full object-cover" />
                 </button>
               ))}
            </div>
          )}
        </div>

        <div className="p-6">
          <DialogHeader className="mb-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-2xl font-display font-bold text-foreground mb-2">
                  {property.title}
                </DialogTitle>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{property.colony}, {property.location}</span>
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className="text-3xl font-bold text-primary">
                  ₹{property.price}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {property.type}
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Property Stats Grid */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/50 rounded-xl border border-border">
            {property.beds !== null && property.beds > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shadow-sm">
                  <Bed className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{property.beds}</div>
                  <div className="text-xs text-muted-foreground">Bedrooms</div>
                </div>
              </div>
            )}
            {property.baths !== null && property.baths > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shadow-sm">
                  <Bath className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{property.baths}</div>
                  <div className="text-xs text-muted-foreground">Bathrooms</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shadow-sm">
                <Maximize className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{property.area}</div>
                <div className="text-xs text-muted-foreground">Plot/Area</div>
              </div>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="mb-8">
              <h4 className="font-semibold text-foreground mb-2">About this property</h4>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </div>
          )}

          {/* Lead Submission Form */}
          <div className="border-t pt-6">
            <h4 className="font-semibold text-foreground mb-4">
              Interested in this property?
            </h4>
            
            {showSuccess ? (
              <div className="bg-emerald-50 text-emerald-700 p-6 rounded-xl text-center border border-emerald-100">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <BadgeCheck className="w-8 h-8" />
                </div>
                <div className="font-bold text-lg">Request Sent!</div>
                <div className="text-sm opacity-90">Our team will call you at {formData.phone} shortly.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="e.g. Rahul Singh"
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="+91 XXXXX XXXXX"
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Request Call Back"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyModal;