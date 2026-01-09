import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// REMOVE: import { supabase } from "@/integrations/supabase/client"; 
import { login, register, addProperty, getMyProfile } from "@/api"; // Use your new API helper
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, LogOut, User, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const ListProperty = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  // Auth form states
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    full_name: "",
    phone: "",
    email: "",
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
  
  // Handle Multiple Images
  const [imageFiles, setImageFiles] = useState([]); // Changed to array
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Check if user is logged in on load
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await getMyProfile(token);
        setUser(response.data);
      } catch (error) {
        console.error("Token expired or invalid");
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  // 2. Handle Login (Replaces Supabase Auth)
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // API Call
      const response = await login({
        username: loginData.email,
        password: loginData.password
      });

      // Save Token
      // Django returns { access: "...", refresh: "..." }
      const token = response.data.access; 
      localStorage.setItem("token", token);

      toast.success("Logged in successfully!");
      
      // Fetch User Profile immediately to update UI
      await checkUser(); 
      
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    try {
      await register({
        email: signupData.email,
        password: signupData.password,
        full_name: signupData.full_name,
        phone: signupData.phone
      });
      
      toast.success("Account created! Please login.");
      setActiveTab("login"); // Switch to login tab
    } catch (error) {
      console.error(error);
      toast.error("Signup failed. Email might be taken.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
  };

  // 4. Handle Multiple Images
  const handleImageChange = (e) => {
    if (e.target.files) {
      // Convert FileList to Array
      setImageFiles(Array.from(e.target.files));
    }
  };

  // 5. Submit Property (Replaces Supabase Insert)
  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsSubmitting(true);
    try {
      // We pass the raw data and let api.js handle FormData conversion
      // or we can do it here. Based on previous api.js, we do it here:
      
      const formData = new FormData();
      formData.append('title', propertyData.title);
      formData.append('price', propertyData.price);
      formData.append('location', propertyData.location);
      formData.append('colony', propertyData.colony);
      formData.append('type', propertyData.type);
      formData.append('area', propertyData.area);
      formData.append('beds', propertyData.beds);
      formData.append('baths', propertyData.baths);
      formData.append('description', propertyData.description);

      // Append multiple images
      imageFiles.forEach((file) => {
        formData.append('uploaded_images', file);
      });

      // Call API
      await addProperty(formData, token); // This function (in api.js) sets the headers

      toast.success("Property submitted successfully!");
      
      // Reset Form
      setPropertyData({
        title: "", price: "", location: "", colony: "", type: "House",
        area: "", beds: "", baths: "", description: ""
      });
      setImageFiles([]);
      
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit property. Try smaller images.");
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
            // --- LOGGED IN VIEW ---
            <Card className="card-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Welcome, {user.full_name}!</p>
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
                  {/* ... Inputs remain mostly the same, just removed some supabase specific logic ... */}
                  
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
                    {/* ... Other inputs (Price, Location, etc.) are standard state updates, no changes needed ... */}
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
                    
                    {/* Conditional rendering for Beds/Baths */}
                    { propertyData.type === "House" && (
                      <>
                        <div>
                          <Label>Bedrooms</Label>
                          <Input
                            type="number"
                            value={propertyData.beds}
                            onChange={(e) => setPropertyData({ ...propertyData, beds: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Bathrooms</Label>
                          <Input
                            type="number"
                            value={propertyData.baths}
                            onChange={(e) => setPropertyData({ ...propertyData, baths: e.target.value })}
                          />
                        </div>
                      </>
                    )}

                    {/* IMAGES INPUT (Updated for Multiple Files) */}
                    <div className="md:col-span-2">
                      <Label>Property Images</Label>
                      <div className="mt-2">
                        <Input
                          type="file"
                          accept="image/*"
                          multiple // Allow multiple selection
                          onChange={handleImageChange}
                          className="cursor-pointer"
                        />
                        {imageFiles.length > 0 && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {imageFiles.length} files selected
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe your property..."
                        value={propertyData.description}
                        onChange={(e) => setPropertyData({ ...propertyData, description: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    <Upload className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Uploading..." : "Submit Property"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            // --- LOGOUT VIEW (LOGIN/SIGNUP) ---
            <Card className="card-shadow">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  {/* LOGIN FORM */}
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          placeholder="user@example.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
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

                  {/* SIGNUP FORM */}
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input
                          placeholder="Your full name"
                          value={signupData.full_name}
                          onChange={(e) => setSignupData({ ...signupData, full_name: e.target.value })}
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
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          required
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