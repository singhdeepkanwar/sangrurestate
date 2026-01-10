import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMyProperties, getMyInterests, getMyProfile } from "@/api";
import { 
  Building2, 
  Users, 
  MessageSquare, 
  Plus, 
  MapPin, 
  Trash2, 
  Edit, 
  ExternalLink,
  Loader2,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

// 1. Define Base URL (Same as PropertyCard)
const BASE_URL = import.meta.env.MODE === "development"
  ? "http://127.0.0.1:8000"
  : "https://sangrurestate-production.up.railway.app";

// Interface matches your Backend API structure
interface DashboardProperty {
  id: string;
  title: string;
  price: string;
  location: string;
  status: string;
  image: string; // The dashboard serializer sends a single string
  leads_count: number;
  views: number;
  created_at: string;
}

interface InterestProperty {
  id: string;
  property_title: string;
  property_location: string;
  property_price: string;
  owner_contact: string;
  date_contacted: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ full_name: string } | null>(null);
  
  // Data States
  const [myListings, setMyListings] = useState<DashboardProperty[]>([]);
  const [myInterests, setMyInterests] = useState<InterestProperty[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      // 1. Get User Profile
      const profileRes = await getMyProfile(token);
      setUser(profileRes.data);

      // 2. Get My Listings
      try {
        const listingsRes = await getMyProperties(token);
        setMyListings(listingsRes.data);
      } catch (e) {
        console.log("No listings found");
      }

      // 3. Get My Interests
      try {
        const interestsRes = await getMyInterests(token);
        setMyInterests(interestsRes.data);
      } catch (e) {
        console.log("No interests found");
      }

    } catch (error) {
      console.error("Dashboard Error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    toast.error("Delete functionality coming soon!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate Stats
  const totalLeadsReceived = myListings.reduce((acc, curr) => acc + (curr.leads_count || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 container mx-auto px-4">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold font-display">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, <span className="font-semibold text-foreground">{user?.full_name}</span>
            </p>
          </div>
          <Button onClick={() => navigate("/list-property")} className="gap-2">
            <Plus className="w-4 h-4" /> Post New Property
          </Button>
        </div>

        {/* --- STATS OVERVIEW --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Properties Posted</CardTitle>
              <Building2 className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myListings.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active listings</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads Received</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLeadsReceived}</div>
              <p className="text-xs text-muted-foreground mt-1">People interested in your assets</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Interests Sent</CardTitle>
              <MessageSquare className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myInterests.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Properties you contacted</p>
            </CardContent>
          </Card>
        </div>

        {/* --- MAIN TABS --- */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="w-full md:w-auto grid grid-cols-2 md:inline-flex">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="interests">My Interests</TabsTrigger>
          </TabsList>

          {/* === TAB 1: MY LISTINGS === */}
          <TabsContent value="listings" className="space-y-6">
            {myListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map((property) => {
                  
                  // --- FIX IMAGE URL LOGIC ---
                  let displayImage = property.image;
                  // If it exists and starts with a slash, prepend the Base URL
                  if (displayImage && displayImage.startsWith("/")) {
                    displayImage = `${BASE_URL}${displayImage}`;
                  }
                  // ---------------------------

                  return (
                    <Card key={property.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="relative h-48 bg-muted">
                        {displayImage ? (
                          <img 
                            src={displayImage} 
                            alt={property.title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                            <Building2 className="w-8 h-8 opacity-20" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
                          {property.status}
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold truncate pr-2">{property.title}</h3>
                          <span className="font-bold text-primary whitespace-nowrap">₹{property.price}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{property.location}</span>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            {property.leads_count || 0} Interested
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDelete(property.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed rounded-xl bg-muted/30">
                <Building2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Properties Posted Yet</h3>
                <p className="text-muted-foreground mb-6">Start your journey by listing your first property.</p>
                <Button onClick={() => navigate("/list-property")}>List Property Now</Button>
              </div>
            )}
          </TabsContent>

          {/* === TAB 2: MY INTERESTS === */}
          <TabsContent value="interests">
             {myInterests.length > 0 ? (
               <div className="space-y-4">
                 {myInterests.map((item) => (
                   <Card key={item.id} className="flex flex-col md:flex-row items-start md:items-center p-4 gap-4">
                     <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                       <ExternalLink className="w-5 h-5 text-primary" />
                     </div>
                     <div className="flex-1">
                       <h4 className="font-semibold">{item.property_title}</h4>
                       <p className="text-sm text-muted-foreground">{item.property_location}</p>
                     </div>
                     <div className="text-right">
                        <div className="text-sm font-medium">Contacted Owner</div>
                        <div className="text-xs text-muted-foreground">{item.date_contacted}</div>
                     </div>
                     <Button variant="outline" size="sm" onClick={() => navigate(`/property/${item.id}`)}>
                       View Property
                     </Button>
                   </Card>
                 ))}
               </div>
             ) : (
              <div className="text-center py-16 border-2 border-dashed rounded-xl bg-muted/30">
                <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Interests Yet</h3>
                <p className="text-muted-foreground mb-6">Browse properties and contact owners to see them here.</p>
                <Button onClick={() => navigate("/properties")} variant="outline">Browse Listings</Button>
              </div>
             )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;