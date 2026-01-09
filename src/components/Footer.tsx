import { Link } from "react-router-dom";
import { Home, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-display font-bold text-lg">SangrurEstate</span>
              </div>
            </div>
            <p className="text-primary-foreground/70 mb-4 max-w-md">
              Your trusted partner for finding the perfect property in Sangrur, Punjab. 
              We specialize in houses, plots, and commercial properties with verified listings.
            </p>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
              <a href="tel:+919872180369" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
                <Phone className="w-4 h-4" />
                +91 98721 80369
              </a>
              <a href="mailto:info@sangrurestate.com" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
                <Mail className="w-4 h-4" />
                info@sangrurestate.com
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Sangrur, Punjab, India
              </div>
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link to="/#properties" className="hover:text-primary-foreground transition-colors">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link to="/list-property" className="hover:text-primary-foreground transition-colors">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types & Legal */}
          <div>
            <h4 className="font-semibold mb-4">Property Types</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Houses for Sale
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Plots & Land
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Commercial Spaces
                </a>
              </li>
            </ul>

            <h4 className="font-semibold mb-4 mt-6">Legal</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link to="/privacy-policy" className="hover:text-primary-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary-foreground transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/50">
            <div className="text-center md:text-left">
              <p>© {currentYear} SangrurEstate. All rights reserved.</p>
              <p className="text-xs mt-1">
                A project under Shree Ananta Consultancy and Solutions LLP (MakeBetter Technologies)
              </p>
            </div>
            <Link 
              to="/admin" 
              className="hover:text-primary-foreground transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;