import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyGrid from "@/components/PropertyGrid";
// Remove PropertyModal import if you aren't using it anymore
import { getProperties } from "@/api";
import { Property } from "@/components/PropertyCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Search, SlidersHorizontal } from "lucide-react";

const Properties = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // We don't need selectedProperty or isModalOpen anymore for the main grid
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [filters, setFilters] = useState({
    location: queryParams.get("location") || "",
    type: queryParams.get("type") || "all",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilters({
      location: queryParams.get("location") || "",
      type: queryParams.get("type") || "all",
    });
  }, [location.search]);

  useEffect(() => {
    if (properties.length > 0) {
      applyFilters();
    }
  }, [filters, properties]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getProperties();
      const data = response.data.results || response.data;
      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...properties];

    if (filters.location.trim() !== "") {
      const search = filters.location.toLowerCase();
      result = result.filter(p => 
        (p.location || "").toLowerCase().includes(search) || 
        (p.colony || "").toLowerCase().includes(search)
      );
    }

    if (filters.type !== "all") {
      result = result.filter(p => p.type === filters.type);
    }

    setFilteredProperties(result);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-28 pb-20 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR (Same as before) */}
          <aside className="w-full lg:w-72 space-y-6">
            <div className="p-6 bg-card rounded-2xl border border-border shadow-sm sticky top-28">
              <div className="flex items-center gap-2 mb-6 text-primary">
                <SlidersHorizontal className="w-5 h-5" />
                <h2 className="font-bold text-lg">Modify Search</h2>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="e.g. Model Town" 
                      className="pl-9 h-11"
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select 
                    value={filters.type} 
                    onValueChange={(v) => setFilters({...filters, type: v})}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="House">House</SelectItem>
                      <SelectItem value="Plot">Plot</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <button 
                   onClick={() => setFilters({ location: "", type: "all" })}
                   className="text-sm text-primary underline w-full text-center"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN GRID */}
          <main className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Properties in Sangrur</h1>
              <p className="text-muted-foreground">
                Showing {filteredProperties.length} verified results
              </p>
            </div>

            <PropertyGrid
              properties={filteredProperties}
              isLoading={isLoading}
              // UPDATE: Navigate to the detail page ID
              onPropertyClick={(property) => navigate(`/property/${property.id}`)}
            />
            
            {!isLoading && filteredProperties.length === 0 && (
              <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed border-border">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-xl font-semibold">No Properties Found</p>
                <p className="text-muted-foreground mb-6">Try adjusting your filters.</p>
                <button onClick={() => setFilters({location: "", type: "all"})} className="text-primary font-bold">
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Properties;