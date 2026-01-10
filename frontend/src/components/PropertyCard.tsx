import { MapPin, Bed, Bath, Maximize, BadgeCheck } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Card, CardContent } from "@/components/ui/card";

// 1. Define Base URL to point to Django
const BASE_URL = import.meta.env.MODE === "development" 
  ? "http://127.0.0.1:8000" 
  : "https://sangrurestate-production.up.railway.app";

export interface PropertyImage {
  id: number;
  image: string; 
}

export interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  colony: string;
  type: string;
  area: string;
  beds: number | null;
  baths: number | null;
  images: PropertyImage[];
  status: string;
  description: string | null;
  created_at: string;
}

interface PropertyCardProps {
  property: Property;
  onClick: (property: Property) => void;
}

const PropertyCard = ({ property, onClick }: PropertyCardProps) => {
  
  // --- FIXED IMAGE LOGIC START ---
  let mainImage = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60";

  if (property.images && property.images.length > 0) {
    const imgPath = property.images[0].image;
    
    // Check if the path is relative (starts with /) and add the backend URL
    if (imgPath.startsWith('/')) {
      mainImage = `${BASE_URL}${imgPath}`;
    } else {
      mainImage = imgPath;
    }
  }
  // --- FIXED IMAGE LOGIC END ---

  return (
    <Card
      className="overflow-hidden cursor-pointer card-shadow card-hover bg-card border-0 group"
      onClick={() => onClick(property)}
    >
      {/* ... Rest of your JSX stays exactly the same ... */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        
        <div className="absolute top-3 left-3">
          <StatusBadge status={property.status} />
        </div>
        
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
          <BadgeCheck className="w-3.5 h-3.5" />
          Verified
        </div>
        
        <div className="absolute bottom-3 left-3">
          <div className="text-xl font-bold text-primary-foreground">
            ₹{property.price}
          </div>
        </div>
        
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-primary-foreground/20 backdrop-blur-sm text-xs font-medium text-primary-foreground">
          {property.type}
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1">
          {property.title}
        </h3>
        
        <div className="flex items-center gap-1 text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm line-clamp-1">
            {property.colony}, {property.location}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {property.beds !== null && property.beds > 0 && (
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4" />
              <span>{property.beds} Beds</span>
            </div>
          )}
          {property.baths !== null && property.baths > 0 && (
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" /> {/* Fixed: Changed Bed to Bath icon here */}
              <span>{property.baths} Bath</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Maximize className="w-4 h-4" />
            <span>{property.area}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;