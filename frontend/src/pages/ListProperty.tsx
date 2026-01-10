import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, X, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { addProperty, getMyProfile } from "@/api"; 

const ListProperty = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Auth State
  const [user, setUser] = useState<{ full_name: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
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

  // 1. Check Auth & Profile on Load
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      // Not logged in? Send to Auth page
      toast.error("Please login to list a property");
      // "state: { from: location }" tells Auth page where to return after login
      navigate("/auth", { state: { from: location } });
      return;
    }

    try {
      const response = await getMyProfile(token);
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Session expired");
      localStorage.removeItem("token");
      navigate("/auth", { state: { from: location } });
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // 2. Handle Image Selection & Preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Store raw files for upload
      setImageFiles((prev) => [...prev, ...newFiles]);
      
      // Create preview URLs for display
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  // 3. Submit Property
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      // Append all text fields
      Object.entries(propertyData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append all images
      imageFiles.forEach((file) => {
        formData.append('uploaded_images', file);
      });

      await addProperty(formData, token);

      toast.success("Property listed successfully!");
      navigate("/properties"); // Redirect to listings page
      
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Failed to list property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading Screen while checking token
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If check finished but not authenticated, return null (redirection happens in useEffect)
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold font-display">List Your Property</h1>
            <p className="text-muted-foreground">Reaching thousands of buyers in Sangrur</p>
          </div>

          <Card className="border-primary/10 shadow-lg">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Posting as {user?.full_name || "User"}</CardTitle>
                  <p className="text-sm text-muted-foreground">Fill in the details below</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* --- TITLE & PRICE --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label>Property Title</Label>
                    <Input
                      placeholder="e.g. Luxury 3BHK Villa near Bhawanigarh Road"
                      value={propertyData.title}
                      onChange={(e) => setPropertyData({ ...propertyData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input
                      placeholder="e.g. 45 Lakh"
                      value={propertyData.price}
                      onChange={(e) => setPropertyData({ ...propertyData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
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
                </div>

                {/* --- LOCATION DETAILS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>City / Location</Label>
                    <Input
                      placeholder="e.g. Sangrur"
                      value={propertyData.location}
                      onChange={(e) => setPropertyData({ ...propertyData, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Colony / Area</Label>
                    <Input
                      placeholder="e.g. Model Town"
                      value={propertyData.colony}
                      onChange={(e) => setPropertyData({ ...propertyData, colony: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* --- SPECS (Only for Houses) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Area / Size</Label>
                    <Input
                      placeholder="e.g. 200 Sq. Yards"
                      value={propertyData.area}
                      onChange={(e) => setPropertyData({ ...propertyData, area: e.target.value })}
                      required
                    />
                  </div>

                  {propertyData.type === "House" && (
                    <>
                      <div className="space-y-2">
                        <Label>Bedrooms</Label>
                        <Input
                          type="number"
                          value={propertyData.beds}
                          onChange={(e) => setPropertyData({ ...propertyData, beds: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bathrooms</Label>
                        <Input
                          type="number"
                          value={propertyData.baths}
                          onChange={(e) => setPropertyData({ ...propertyData, baths: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* --- DESCRIPTION --- */}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Tell potential buyers about key features, nearby amenities, etc."
                    value={propertyData.description}
                    onChange={(e) => setPropertyData({ ...propertyData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                {/* --- IMAGE UPLOAD --- */}
                <div className="space-y-4 pt-4 border-t">
                  <Label>Property Images</Label>
                  
                  {/* Image Previews */}
                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                          <img src={url} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Button */}
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors border-muted-foreground/25">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 5MB (Multiple allowed)
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                {/* --- SUBMIT BUTTON --- */}
                <Button type="submit" size="lg" className="w-full text-lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Uploading Property...
                    </>
                  ) : (
                    "Submit Listing"
                  )}
                </Button>

              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListProperty;