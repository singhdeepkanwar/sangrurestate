import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Users, Building2, Award, Target } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              About SangrurEstate
            </h1>
            <p className="text-lg text-muted-foreground">
              Your trusted partner for finding the perfect property in Sangrur, Punjab. 
              We specialize in houses, plots, and commercial properties with verified listings.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-secondary rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To simplify the property buying and selling experience in Sangrur by providing 
                verified listings, transparent pricing, and personalized service that our clients can trust.
              </p>
            </div>
            <div className="bg-secondary rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To become the most trusted real estate platform in Sangrur, known for 
                integrity, innovation, and exceptional customer service in the property market.
              </p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-16">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              Why Choose Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: CheckCircle,
                  title: "Verified Properties",
                  description: "Every listing is personally verified by our team for authenticity and accurate details."
                },
                {
                  icon: Users,
                  title: "Local Expertise",
                  description: "Deep knowledge of Sangrur's neighborhoods, pricing trends, and best locations."
                },
                {
                  icon: Building2,
                  title: "Wide Selection",
                  description: "Houses, plots, and commercial spaces across all colonies in Sangrur."
                }
              ].map((feature) => (
                <div key={feature.title} className="bg-background border border-border rounded-xl p-6 card-shadow">
                  <feature.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-8">
              Our Track Record
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "500+", label: "Properties Listed" },
                { value: "200+", label: "Happy Clients" },
                { value: "10+", label: "Years Experience" },
                { value: "50+", label: "Colonies Covered" }
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-primary-foreground/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Info */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">
              A project under <span className="font-semibold text-foreground">Shree Ananta Consultancy and Solutions LLP</span> (MakeBetter Technologies)
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;