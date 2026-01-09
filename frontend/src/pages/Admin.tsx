import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, LogOut, Plus, Trash2, Phone, User, CheckCircle, Upload, Image } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ 
    title: "", price: "", location: "", colony: "", type: "House", area: "", beds: "", baths: "", description: "" 
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/admin/login");
      else { setUser(session.user); fetchData(); }
    });
  }, [navigate]);

  const fetchData = async () => {
    const [propRes, leadRes] = await Promise.all([
      supabase.from("properties").select("*").order("created_at", { ascending: false }),
      supabase.from("leads").select("*, properties(title)").order("created_at", { ascending: false })
    ]);
    setProperties(propRes.data || []);
    setLeads(leadRes.data || []);
    setIsLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/admin/login"); };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = null;

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `admin-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      const { error } = await supabase.from("properties").insert({ 
        ...formData, 
        beds: parseInt(formData.beds) || 0, 
        baths: parseInt(formData.baths) || 0,
        image_url: imageUrl,
        is_verified: true
      });

      if (error) throw error;

      toast.success("Property added!");
      setFormData({ title: "", price: "", location: "", colony: "", type: "House", area: "", beds: "", baths: "", description: "" });
      setImageFile(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to add property");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    await supabase.from("properties").update({ status }).eq("id", id);
    fetchData();
  };

  const handleDeleteProperty = async (id: string) => {
    await supabase.from("properties").delete().eq("id", id);
    toast.success("Property deleted");
    fetchData();
  };

  const handleMarkContacted = async (id: string) => {
    await supabase.from("leads").update({ status: "Contacted" }).eq("id", id);
    fetchData();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Home className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">Admin Panel</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="properties">
          <TabsList className="mb-6">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="leads">Leads ({leads.filter(l => l.status === 'New').length})</TabsTrigger>
            <TabsTrigger value="add">Add Property</TabsTrigger>
          </TabsList>

          <TabsContent value="properties">
            <Card>
              <CardHeader><CardTitle>Manage Properties</CardTitle></CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.title} className="w-16 h-12 object-cover rounded" />
                          ) : (
                            <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                              <Image className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{p.title}</TableCell>
                        <TableCell>₹{p.price}</TableCell>
                        <TableCell>{p.colony}</TableCell>
                        <TableCell>
                          <Select value={p.status} onValueChange={(v) => handleStatusChange(p.id, v)}>
                            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Available">Available</SelectItem>
                              <SelectItem value="Reserved">Reserved</SelectItem>
                              <SelectItem value="Sold">Sold</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteProperty(p.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads">
            <Card>
              <CardHeader><CardTitle>Inspection Requests</CardTitle></CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><User className="w-4 h-4 inline mr-1" />Name</TableHead>
                      <TableHead><Phone className="w-4 h-4 inline mr-1" />Phone</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((l) => (
                      <TableRow key={l.id}>
                        <TableCell>{l.buyer_name}</TableCell>
                        <TableCell>{l.buyer_phone}</TableCell>
                        <TableCell>{l.properties?.title || 'N/A'}</TableCell>
                        <TableCell>
                          <span className={l.status === 'New' ? 'text-primary font-medium' : 'text-muted-foreground'}>
                            {l.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {l.status === 'New' && (
                            <Button size="sm" onClick={() => handleMarkContacted(l.id)}>
                              <CheckCircle className="w-4 h-4 mr-1" />Contacted
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle><Plus className="w-5 h-5 inline mr-2" />Add New Property</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProperty} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Title</Label>
                    <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Price (e.g., 45 Lakh)</Label>
                    <Input value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Colony</Label>
                    <Input value={formData.colony} onChange={(e) => setFormData({...formData, colony: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Plot">Plot</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Area (e.g., 5 Marla)</Label>
                    <Input value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Beds</Label>
                    <Input type="number" value={formData.beds} onChange={(e) => setFormData({...formData, beds: e.target.value})} />
                  </div>
                  <div>
                    <Label>Baths</Label>
                    <Input type="number" value={formData.baths} onChange={(e) => setFormData({...formData, baths: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Property Image</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="cursor-pointer"
                      />
                      {imageFile && (
                        <span className="text-sm text-muted-foreground">{imageFile.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Description</Label>
                    <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                  </div>
                  <Button type="submit" className="md:col-span-2" disabled={isSubmitting}>
                    <Upload className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Adding..." : "Add Property"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;