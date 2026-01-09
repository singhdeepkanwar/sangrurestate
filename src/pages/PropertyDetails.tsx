import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Home, 
  Phone, 
  ArrowLeft, 
  CheckCircle,
  Share2,
  Heart
} from "lucide-react";
import { toast } from "sonner";

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  colony: string;
  type: string;
  area: string;
  beds: number | null;
  baths: number | null;
  image_url: string | null;
  status: string;
  description: string | null;
  created_at: string;
}

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error("Error fetching property:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInspectionRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        property_id: property.id,
        buyer_name: formData.name,
        buyer_phone: formData.phone,
      });

      if (error) throw error;

      toast.success("Request submitted! We'll contact you soon.");
      setFormData({ name: "", phone: "" });
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: `Check out this property: ${property?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-4">
              <div className="h-96 bg-muted rounded-2xl" />
              <div className="h-8 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-1/4" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-foreground mb-4">Property Not Found</h1>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Listings
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Property Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-muted">
                {property.image_url ? (
                  <img
                    src={property.image_url}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <StatusBadge status={property.status} />
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-foreground" />
                  </button>
                  <button className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
                    <Heart className="w-5 h-5 text-foreground" />
                  </button>
                </div>
              </div>

              {/* Property Info */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{property.colony}, {property.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl md:text-3xl font-bold text-primary">
                      ₹{property.price}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {property.type}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex items-center gap-6 py-4 border-y border-border">
                  {property.beds !== null && property.beds > 0 && (
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{property.beds} Beds</span>
                    </div>
                  )}
                  {property.baths !== null && property.baths > 0 && (
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{property.baths} Baths</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Maximize className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{property.area}</span>
                  </div>
                </div>

                {/* Description */}
                {property.description && (
                  <div>
                    <h2 className="font-semibold text-lg text-foreground mb-2">About this Property</h2>
                    <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                  </div>
                )}

                {/* Verified Badge */}
                <div className="flex items-center gap-2 p-4 rounded-lg bg-secondary">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-secondary-foreground">
                    This property has been verified by SangrurEstate
                  </span>
                </div>
              </div>
            </div>

            {/* Sidebar - Contact Form */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 card-shadow">
                <CardContent className="p-6">
                  <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                    Request Site Visit
                  </h3>
                  <form onSubmit={handleInspectionRequest} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting || property.status === "Sold"}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Submitting..." : "Request Inspection"}
                    </Button>
                  </form>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center">
                      Our team will contact you within 24 hours to schedule a visit.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetails;