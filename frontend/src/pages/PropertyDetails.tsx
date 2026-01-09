import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { getProperty, submitLead } from "@/api"; // Import new API functions
import { 
  MapPin, Bed, Bath, Maximize, Home, Phone, ArrowLeft, 
  CheckCircle, Share2, Heart 
} from "lucide-react";
import { toast } from "sonner";

// Updated Interface matching Django
interface PropertyImage {
  id: number;
  image: string;
}

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
  images: PropertyImage[]; // Changed from image_url
  status: string;
  description: string | null;
  created_at: string;
}

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [activeImage, setActiveImage] = useState<string>(""); // For Gallery
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) fetchPropertyData();
  }, [id]);

  const fetchPropertyData = async () => {
    try {
      const response = await getProperty(id!);
      const data = response.data;
      setProperty(data);
      
      // Set the first image as active by default
      if (data.images && data.images.length > 0) {
        setActiveImage(data.images[0].image);
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      toast.error("Could not load property details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInspectionRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setIsSubmitting(true);
    try {
      // Use the new Django API
      await submitLead({
        property: property.id,
        buyer_name: formData.name,
        buyer_phone: formData.phone,
      });

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
        <div className="pt-24 pb-16 container mx-auto px-4">
           <div className="h-96 bg-muted animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <Link to="/properties"><Button>Back to Listings</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/properties" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Listings
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- MAIN CONTENT --- */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* IMAGE GALLERY SECTION */}
              <div className="space-y-4">
                {/* Main Large Image */}
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-muted border border-border">
                  {activeImage ? (
                    <img
                      src={activeImage}
                      alt={property.title}
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  )}
                  
                  {/* Badges & Actions */}
                  <div className="absolute top-4 left-4">
                    <StatusBadge status={property.status} />
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Thumbnails (Only if > 1 image) */}
                {property.images && property.images.length > 1 && (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {property.images.map((img) => (
                      <button
                        key={img.id}
                        onClick={() => setActiveImage(img.image)}
                        className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          activeImage === img.image ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img.image} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* PROPERTY INFO */}
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4 flex-wrap border-b border-border pb-6">
                  <div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground text-lg">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span>{property.colony}, {property.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-3xl md:text-4xl font-bold text-primary">
                      ₹{property.price}
                    </div>
                    <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      {property.type}
                    </span>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-3 gap-4 py-4">
                  {property.beds !== null && property.beds > 0 && (
                    <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-xl">
                      <Bed className="w-6 h-6 text-primary mb-2" />
                      <span className="font-bold text-lg">{property.beds} Beds</span>
                    </div>
                  )}
                  {property.baths !== null && property.baths > 0 && (
                    <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-xl">
                      <Bath className="w-6 h-6 text-primary mb-2" />
                      <span className="font-bold text-lg">{property.baths} Baths</span>
                    </div>
                  )}
                  <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-xl">
                    <Maximize className="w-6 h-6 text-primary mb-2" />
                    <span className="font-bold text-lg">{property.area}</span>
                  </div>
                </div>

                {/* Description */}
                {property.description && (
                  <div className="prose max-w-none text-muted-foreground">
                    <h3 className="text-xl font-bold text-foreground mb-3">About this Property</h3>
                    <p className="leading-relaxed whitespace-pre-line">{property.description}</p>
                  </div>
                )}

                {/* Verification Badge */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="font-bold text-emerald-900">Verified Listing</p>
                    <p className="text-sm text-emerald-700">Documents and physical location verified by SangrurEstate team.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- SIDEBAR CONTACT FORM --- */}
            <div className="lg:col-span-1">
              <Card className="sticky top-28 shadow-lg border-primary/10">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="font-display font-bold text-xl text-foreground">
                      Interested?
                    </h3>
                    <p className="text-muted-foreground text-sm">Fill the form to get owner details</p>
                  </div>
                  
                  <form onSubmit={handleInspectionRequest} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="bg-muted/50"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full h-12 text-lg font-semibold"
                      disabled={isSubmitting || property.status.toLowerCase() === "sold"}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Sending..." : "Request Call Back"}
                    </Button>
                  </form>
                  
                  <div className="mt-6 pt-6 border-t border-dashed text-center">
                    <p className="text-xs text-muted-foreground">
                      By submitting this form, you agree to our Terms of Service.
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