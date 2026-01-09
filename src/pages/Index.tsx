import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PropertyGrid from "@/components/PropertyGrid";
import PropertyModal from "@/components/PropertyModal";
import Footer from "@/components/Footer";
import { Property } from "@/components/PropertyCard";
import { supabase } from "@/integrations/supabase/client";
import { Building2 } from "lucide-react";

const Index = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProperties(data || []);
      setFilteredProperties(data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (filters: { location: string; type: string; budget: string }) => {
    let filtered = [...properties];

    if (filters.location) {
      const searchTerm = filters.location.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.colony.toLowerCase().includes(searchTerm) ||
          p.location.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter((p) => p.type === filters.type);
    }

    // Budget filtering would need price parsing logic for Lakh/Cr format
    // Simplified for now

    setFilteredProperties(filtered);

    // Scroll to properties section
    document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Hero onSearch={handleSearch} />

      {/* Properties Section */}
      <section id="properties" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground mb-4">
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-medium">Featured Listings</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Discover Properties in Sangrur
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse through our verified listings of houses, plots, and commercial properties 
              in prime locations across Sangrur.
            </p>
          </div>

          <PropertyGrid
            properties={filteredProperties}
            isLoading={isLoading}
            onPropertyClick={handlePropertyClick}
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why Choose SangrurEstate?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🏠",
                  title: "Verified Properties",
                  description: "Every listing is personally verified for authenticity and accuracy.",
                },
                {
                  icon: "💰",
                  title: "Best Prices",
                  description: "Get the best deals with transparent pricing in Lakh and Crore.",
                },
                {
                  icon: "🤝",
                  title: "Trusted Service",
                  description: "Local expertise with a personal touch for all your property needs.",
                },
              ].map((feature) => (
                <div key={feature.title} className="bg-background rounded-xl p-6 card-shadow">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <PropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Index;
