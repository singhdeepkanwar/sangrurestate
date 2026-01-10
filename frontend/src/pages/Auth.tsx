import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loginUser, registerUser } from "@/api";
import { toast } from "sonner";
import { Lock, User, Mail, Phone, Loader2, Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login State (Identifier can be email or phone)
  const [loginData, setLoginData] = useState({ identifier: "", password: "" });
  
  // Register State (Matches your backend requirements)
  const [registerData, setRegisterData] = useState({ 
    full_name: "", 
    email: "", 
    phone: "",      // Changed from phone_number to phone to match your previous prompt
    password: "", 
    confirmPassword: "" 
  });

  // --- LOGIN HANDLER ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Note: Even if user types Email/Phone, Django JWT usually expects the key 'username'
      // If your backend specifically asks for 'email' or 'phone' keys, change 'username' below.
      const payload = {
        username: loginData.identifier, 
        password: loginData.password
      };

      const { data } = await loginUser(payload);
      
      // Save token
      localStorage.setItem("token", data.access);
      toast.success("Welcome back!");
      
      // Redirect to previous page or Home
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
      
    } catch (error: any) {
      console.error("Login Error:", error);
      toast.error("Invalid Email/Phone or Password");
    } finally {
      setIsLoading(false);
    }
  };

  // --- REGISTER HANDLER ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Client-side Validation
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (registerData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      // 2. Prepare Payload (Exclude confirmPassword)
      const payload = {
        full_name: registerData.full_name,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password
      };

      await registerUser(payload);
      
      toast.success("Account created successfully! Please login.");
      
      // Switch to Login Tab
      const loginTabBtn = document.querySelector('[value="login"]') as HTMLButtonElement;
      if (loginTabBtn) loginTabBtn.click();
      
      // Pre-fill login identifier for convenience
      setLoginData(prev => ({ ...prev, identifier: registerData.email }));

    } catch (error: any) {
      console.error("Registration Error:", error);
      
      // 3. Show Specific Backend Errors
      if (error.response?.data) {
        const errorData = error.response.data;
        // Grab the first error message available
        const firstKey = Object.keys(errorData)[0];
        const msg = Array.isArray(errorData[firstKey]) ? errorData[firstKey][0] : errorData[firstKey];
        toast.error(`${firstKey.toUpperCase()}: ${msg}`);
      } else {
        toast.error("Registration failed. Please check your details.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4 pt-24 pb-12">
        <Card className="w-full max-w-md border-primary/10 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold font-display">Welcome to SangrurEstate</CardTitle>
            <CardDescription>Login or create an account to manage properties</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>
              
              {/* --- LOGIN TAB --- */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="identifier">Email or Phone Number</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="identifier" 
                        placeholder="Enter email or phone" 
                        className="pl-9"
                        value={loginData.identifier}
                        onChange={(e) => setLoginData({...loginData, identifier: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="login-pass">Password</Label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="login-pass" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="pl-9 pr-9"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              {/* --- REGISTER TAB --- */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="John Doe" 
                        className="pl-9"
                        value={registerData.full_name}
                        onChange={(e) => setRegisterData({...registerData, full_name: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="9876543210" 
                        className="pl-9"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        type="email" 
                        placeholder="you@example.com" 
                        className="pl-9"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        type="password" 
                        placeholder="Min 8 characters" 
                        className="pl-9"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        type="password" 
                        placeholder="Re-enter password" 
                        className="pl-9"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                     {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                     {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Auth;