import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, UserPlus, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ParentAuthProps {
  onAuthSuccess: (parentEmail: string) => void;
}

export const ParentAuth = ({ onAuthSuccess }: ParentAuthProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    // For demo purposes, we'll just simulate authentication
    // In a real app, this would connect to a backend authentication service
    
    if (isLogin) {
      // Simulate login
      const savedParent = localStorage.getItem("kidsInterestIndicator_parent");
      if (savedParent) {
        const parentData = JSON.parse(savedParent);
        if (parentData.email === email) {
          onAuthSuccess(email);
          toast({
            title: "Welcome back!",
            description: "Successfully logged in to your account",
          });
          return;
        }
      }
      
      toast({
        title: "Account not found",
        description: "Please check your credentials or sign up",
        variant: "destructive",
      });
    } else {
      // Simulate registration
      const parentData = {
        email,
        password, // In a real app, this would be hashed
        registrationDate: new Date().toISOString()
      };
      
      localStorage.setItem("kidsInterestIndicator_parent", JSON.stringify(parentData));
      onAuthSuccess(email);
      
      toast({
        title: "Account created!",
        description: "Welcome to Kids Interest Indicator",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">👨‍👩‍👧‍👦</div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Kids Interest Indicator
          </h1>
          <p className="text-muted-foreground">
            Parent Login Required
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="parent@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLogin ? (
              <>
                <User className="w-4 h-4 mr-2" />
                Login
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </>
            )}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-primary/80"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            🔒 Your child's data is secure and private
          </p>
        </div>
      </Card>
    </div>
  );
};