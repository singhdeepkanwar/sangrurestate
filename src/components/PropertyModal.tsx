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
import { supabase } from "@/integrations/supabase/client";
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

  if (!property) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("leads").insert({
        property_id: property.id,
        buyer_name: formData.name,
        buyer_phone: formData.phone,
      });

      if (error) throw error;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Image */}
        <div className="relative h-64 md:h-80">
          <img
            src={property.image_url || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60"}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <StatusBadge status={property.status} />
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
              <BadgeCheck className="w-3.5 h-3.5" />
              Verified
            </div>
          </div>
        </div>

        <div className="p-6">
          <DialogHeader className="mb-4">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl font-display font-bold text-foreground mb-2">
                  {property.title}
                </DialogTitle>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{property.colony}, {property.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  ₹{property.price}
                </div>
                <div className="text-sm text-muted-foreground">
                  {property.type}
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Features */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted rounded-xl">
            {property.beds !== null && property.beds > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
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
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                  <Bath className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{property.baths}</div>
                  <div className="text-xs text-muted-foreground">Bathrooms</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                <Maximize className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{property.area}</div>
                <div className="text-xs text-muted-foreground">Area</div>
              </div>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="mb-6">
              <h4 className="font-semibold text-foreground mb-2">Description</h4>
              <p className="text-muted-foreground">{property.description}</p>
            </div>
          )}

          {/* Inspection Request Form */}
          <div className="border-t pt-6">
            <h4 className="font-semibold text-foreground mb-4">
              Request Property Inspection
            </h4>
            
            {showSuccess ? (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-center animate-scale-in">
                <div className="text-2xl mb-2">✓</div>
                <div className="font-semibold">Request Submitted!</div>
                <div className="text-sm">Our team will contact you shortly.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Enter your name"
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
                        placeholder="+91 98765 43210"
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Request Inspection"}
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
