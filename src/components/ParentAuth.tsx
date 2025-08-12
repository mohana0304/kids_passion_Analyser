import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; // Assumes Firestore (db) is initialized alongside auth
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock, UserPlus, User, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const logo = "/logo.png";

interface ParentAuthProps {
  onAuthSuccess: (parentEmail: string) => void;
}

export const ParentAuth = ({ onAuthSuccess }: ParentAuthProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [parentName, setParentName] = useState("");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [childGender, setChildGender] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Set Firebase persistence for persistent login
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .catch((error) => {
        toast({
          title: "Persistence Error",
          description: "Failed to set up persistent login: " + error.message,
          variant: "destructive",
        });
      });
  }, []);

  const validateInputs = () => {
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Email and password are required",
        variant: "destructive",
      });
      return false;
    }
    if (!isLogin) {
      if (!parentName || !childName || !childAge || !childGender) {
        toast({
          title: "Missing Information",
          description: "All fields are required for registration",
          variant: "destructive",
        });
        return false;
      }
      const age = parseInt(childAge);
      if (isNaN(age) || age < 5 || age > 16) {
        toast({
          title: "Invalid Age",
          description: "Child's age must be between 5 and 16 years",
          variant: "destructive",
        });
        return false;
      }
      if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
        toast({
          title: "Weak Password",
          description: "Password must be at least 8 characters, including letters and numbers",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess(email);
        toast({
          title: "Welcome back!",
          description: `Logged in as ${email}`,
        });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Store parent and child data in Firestore
        await setDoc(doc(db, "parents", user.uid), {
          email,
          parentName,
          childName,
          childAge: parseInt(childAge),
          childGender,
          createdAt: new Date().toISOString(),
        });
        onAuthSuccess(email);
        toast({
          title: "Account created!",
          description: `Welcome to Kids Passion Analyser, ${parentName}!`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">
            <center>
              <img src={logo} alt="Logo" width={100} height={100} />
            </center>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Kids Passion Analyser
          </h1>
          <p className="text-muted-foreground">Parent Account Management</p>
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

          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="parentName">Parent's Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="parentName"
                    type="text"
                    placeholder="Enter your name"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="childName">Child's Name</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="childName"
                    type="text"
                    placeholder="Enter child's name"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="childAge">Child's Age</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="childAge"
                    type="number"
                    placeholder="Enter child's age (5-16)"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="pl-10"
                    min="5"
                    max="16"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="childGender">Child's Gender</Label>
                <Select value={childGender} onValueChange={setChildGender} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={loading}
          >
            {loading ? (
              "Processing..."
            ) : isLogin ? (
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