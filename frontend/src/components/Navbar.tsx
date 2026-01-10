import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, Menu, X, User, LogOut, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check login state whenever the route changes or component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
    // Optional: Add a toast here for "Logged out"
  };

  const NavLinks = () => (
    <>
      <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        Home
      </Link>
      <Link to="/properties" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        Properties
      </Link>
      <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        About
      </Link>
      <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        Contact
      </Link>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg text-foreground leading-tight">
                SangrurEstate
              </span>
              <span className="text-xs text-muted-foreground -mt-0.5">
                Your Trusted Property Partner
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
            
            {isLoggedIn ? (
              // --- LOGGED IN VIEW ---
              <div className="flex items-center gap-3 ml-2">
                <Link to="/list-property">
                  <Button size="sm" variant="outline">
                    List Property
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              // --- LOGGED OUT VIEW ---
              <div className="flex items-center gap-3 ml-2">
              <Link to="/auth"> 
                <Button variant="ghost" size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Login/ Sign Up
                </Button>
              </Link>
              <Link to="/list-property">  
                <Button size="sm">
                  List Property
                </Button>
              </Link>
            </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link to="/properties" onClick={() => setIsOpen(false)} className="text-sm font-medium p-2 hover:bg-muted rounded">
                Properties
              </Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="text-sm font-medium p-2 hover:bg-muted rounded">
                About
              </Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="text-sm font-medium p-2 hover:bg-muted rounded">
                Contact
              </Link>
              
              <div className="border-t pt-4 mt-2 flex flex-col gap-3">
                {isLoggedIn ? (
                  <>
                    <Link to="/list-property" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">
                        Dashboard / List Property
                      </Button>
                    </Link>
                    <Button variant="destructive" onClick={() => { handleLogout(); setIsOpen(false); }}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/list-property" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/list-property" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">
                        Sign Up / List Property
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;