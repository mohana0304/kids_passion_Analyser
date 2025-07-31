import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
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

// Firebase config from .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // Add other config fields as needed
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !password) {
    toast({
      title: "Missing Information",
      description: "Please enter both email and password",
      variant: "destructive",
    });
    return;
  }

  try {
    if (isLogin) {
      // Firebase login
      await signInWithEmailAndPassword(auth, email, password);
      onAuthSuccess(email);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your account",
      });
    } else {
      // Firebase registration
      await createUserWithEmailAndPassword(auth, email, password);
      onAuthSuccess(email);
      toast({
        title: "Account created!",
        description: "Welcome to Kids Interest Indicator",
      });
    }
  } catch (error: any) {
    toast({
      title: "Authentication Error",
      description: error.message,
      variant: "destructive",
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