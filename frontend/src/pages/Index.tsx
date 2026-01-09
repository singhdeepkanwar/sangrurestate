import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Building2, ShieldCheck, PhoneCall, ArrowRight, Home, MapPin, CheckCircle2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handleSearch = (filters: { location: string; type: string; budget: string }) => {
    // Send search parameters to the properties page
    const params = new URLSearchParams();
    if (filters.location) params.append("location", filters.location);
    if (filters.type) params.append("type", filters.type);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Hero onSearch={handleSearch} />

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Finding a Home in Sangrur is Easy</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Follow our simple 3-step process to secure your dream property.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <MapPin className="w-6 h-6"/>, title: "Pick Location", desc: "Choose from prime colonies like Model Town, Punia Colony, or Patiala Road." },
            { icon: <Home className="w-6 h-6"/>, title: "Book Visit", desc: "Found something you like? Request a callback for a physical site inspection." },
            { icon: <CheckCircle2 className="w-6 h-6"/>, title: "Close Deal", desc: "We help verify documents and ensure a smooth ownership transfer." }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-8 rounded-2xl bg-muted/50 border border-border">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-xl mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- BIG CALL TO ACTION --- */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Explore 500+ Verified Listings</h2>
          <p className="mb-8 text-lg opacity-90">Browse the most comprehensive database of properties in Sangrur district.</p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="group px-8 py-6 text-lg"
            onClick={() => navigate('/properties')}
          >
            View All Properties
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* --- TRUST & ABOUT SECTION --- */}
      <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
              <ShieldCheck className="w-4 h-4" />
              Trusted by 1000+ Families
            </div>
            <h2 className="font-display text-4xl font-bold leading-tight">We are Sangrur's Most <br/> Reliable Property Portal</h2>
            <p className="text-muted-foreground text-lg">Every plot and house listed on our platform undergoes a rigorous 3-point verification check to ensure you never have to deal with fake listings.</p>
            
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <h4 className="font-bold text-2xl text-primary">100%</h4>
                <p className="text-sm text-muted-foreground">Verified Listings</p>
              </div>
              <div>
                <h4 className="font-bold text-2xl text-primary">0%</h4>
                <p className="text-sm text-muted-foreground">Brokerage for Buyers</p>
              </div>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1582408921715-18e7806365c1?w=800" 
              alt="Sangrur Real Estate"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;