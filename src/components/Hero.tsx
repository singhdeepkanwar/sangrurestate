import { Search, MapPin, Home, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroProps {
  onSearch: (filters: {
    location: string;
    type: string;
    budget: string;
  }) => void;
}

const Hero = ({ onSearch }: HeroProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSearch({
      location: formData.get("location") as string || "",
      type: formData.get("type") as string || "",
      budget: formData.get("budget") as string || "",
    });
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Sangrur Properties"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-6 animate-fade-up">
            <MapPin className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">
              Sangrur's First Dedicated Real Estate Platform
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Find Your Dream Property<br />
            <span className="text-emerald-200">in Sangrur</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Discover houses, plots, and commercial properties with verified listings and transparent pricing.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSubmit}
            className="glass-effect rounded-2xl p-4 md:p-6 shadow-xl animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Location */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  name="location"
                  placeholder="Colony or Location"
                  className="pl-10 h-12 bg-background border-input"
                />
              </div>

              {/* Property Type */}
              <Select name="type">
                <SelectTrigger className="h-12 bg-background">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-muted-foreground" />
                    <SelectValue placeholder="Property Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Plot">Plot</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>

              {/* Budget */}
              <Select name="budget">
                <SelectTrigger className="h-12 bg-background">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-muted-foreground" />
                    <SelectValue placeholder="Budget" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Budget</SelectItem>
                  <SelectItem value="0-25">Under ₹25 Lakh</SelectItem>
                  <SelectItem value="25-50">₹25 - 50 Lakh</SelectItem>
                  <SelectItem value="50-100">₹50 Lakh - 1 Cr</SelectItem>
                  <SelectItem value="100+">Above ₹1 Cr</SelectItem>
                </SelectContent>
              </Select>

              {/* Search Button */}
              <Button type="submit" size="lg" className="h-12 font-semibold">
                <Search className="w-5 h-5 mr-2" />
                Search Properties
              </Button>
            </div>
          </form>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-10 max-w-xl mx-auto animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "500+", label: "Properties Listed" },
              { value: "1000+", label: "Happy Families" },
              { value: "50+", label: "Verified Colonies" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
