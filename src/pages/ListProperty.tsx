import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Home, CheckCircle, LogOut, User } from "lucide-react";
import { toast } from "sonner";

const ListProperty = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  // Auth form states
  const [loginData, setLoginData] = useState({ phone: "", password: "" });
  const [signupData, setSignupData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "Sangrur",
    password: "",
    confirmPassword: ""
  });

  // Property form state
  const [propertyData, setPropertyData] = useState({
    title: "",
    price: "",
    location: "",
    colony: "",
    type: "House",
    area: "",
    beds: "",
    baths: "",
    description: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Use phone as email format for login
      const email = `${loginData.phone}@sangrurestate.local`;
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: loginData.password
      });
      if (error) throw error;
      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    try {
      // Use phone as email format
      const email = `${signupData.phone}@sangrurestate.local`;
      const { error } = await supabase.auth.signUp({
        email,
        password: signupData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: signupData.fullName,
            phone: signupData.phone,
            address: signupData.address,
            city: signupData.city
          }
        }
      });
      if (error) throw error;
      toast.success("Account created! You can now list properties.");
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      let imageUrl = null;

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('property-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      // Insert property
      const { error } = await supabase.from("properties").insert({
        title: propertyData.title,
        price: propertyData.price,
        location: propertyData.location,
        colony: propertyData.colony,
        type: propertyData.type,
        area: propertyData.area,
        beds: parseInt(propertyData.beds) || 0,
        baths: parseInt(propertyData.baths) || 0,
        description: propertyData.description,
        image_url: imageUrl,
        submitted_by: user.id,
        is_verified: false,
        status: "Available"
      });

      if (error) throw error;

      toast.success("Property submitted! Our team will verify and publish it soon.");
      setPropertyData({
        title: "",
        price: "",
        location: "",
        colony: "",
        type: "House",
        area: "",
        beds: "",
        baths: "",
        description: ""
      });
      setImageFile(null);
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to submit property");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              List Your Property
            </h1>
            <p className="text-muted-foreground">
              Reach thousands of potential buyers in Sangrur
            </p>
          </div>

          {user ? (
            // Logged in - Show property form
            <Card className="card-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Welcome!</p>
                      <p className="text-sm text-muted-foreground">Submit your property details below</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePropertySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label>Property Title</Label>
                      <Input
                        placeholder="e.g., 3 BHK House in Model Town"
                        value={propertyData.title}
                        onChange={(e) => setPropertyData({ ...propertyData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Price (e.g., 45 Lakh)</Label>
                      <Input
                        placeholder="45 Lakh"
                        value={propertyData.price}
                        onChange={(e) => setPropertyData({ ...propertyData, price: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Property Type</Label>
                      <Select
                        value={propertyData.type}
                        onValueChange={(v) => setPropertyData({ ...propertyData, type: v })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="House">House</SelectItem>
                          <SelectItem value="Plot">Plot</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        placeholder="Sangrur"
                        value={propertyData.location}
                        onChange={(e) => setPropertyData({ ...propertyData, location: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Colony/Area</Label>
                      <Input
                        placeholder="Model Town"
                        value={propertyData.colony}
                        onChange={(e) => setPropertyData({ ...propertyData, colony: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Area (e.g., 5 Marla)</Label>
                      <Input
                        placeholder="5 Marla"
                        value={propertyData.area}
                        onChange={(e) => setPropertyData({ ...propertyData, area: e.target.value })}
                        required
                      />
                    </div>
                    { propertyData.type !== "House" ? null : (
                      <div>
                    <div>
                      <Label>Bedrooms</Label>
                      <Input
                        type="number"
                        placeholder="3"
                        value={propertyData.beds}
                        onChange={(e) => setPropertyData({ ...propertyData, beds: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Bathrooms</Label>
                      <Input
                        type="number"
                        placeholder="2"
                        value={propertyData.baths}
                        onChange={(e) => setPropertyData({ ...propertyData, baths: e.target.value })}
                      />
                    </div>
                    </div>
                    )}
                    <div className="md:col-span-2">
                      <Label>Property Image</Label>
                      <div className="mt-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="cursor-pointer"
                        />
                        {imageFile && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Selected: {imageFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe your property (features, amenities, etc.)"
                        value={propertyData.description}
                        onChange={(e) => setPropertyData({ ...propertyData, description: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="bg-secondary rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Your property will be reviewed by our team before it's published. 
                      This ensures all listings on SangrurEstate are verified and accurate.
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    <Upload className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Submitting..." : "Submit Property"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            // Not logged in - Show auth forms
            <Card className="card-shadow">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label>Phone Number</Label>
                        <Input
                          placeholder="9876543210"
                          value={loginData.phone}
                          onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Password</Label>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input
                          placeholder="Your full name"
                          value={signupData.fullName}
                          onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Phone Number</Label>
                        <Input
                          placeholder="9876543210"
                          value={signupData.phone}
                          onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Phone verification will be added soon
                        </p>
                      </div>
                      <div>
                        <Label>Email (Optional)</Label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Address</Label>
                        <Input
                          placeholder="Your address"
                          value={signupData.address}
                          onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>City</Label>
                        <Input
                          placeholder="Sangrur"
                          value={signupData.city}
                          onChange={(e) => setSignupData({ ...signupData, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Password</Label>
                        <Input
                          type="password"
                          placeholder="Create a password"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Confirm Password</Label>
                        <Input
                          type="password"
                          placeholder="Confirm your password"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListProperty;