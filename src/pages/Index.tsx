
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Users, Award, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      await signIn(credentials.email, credentials.password);
      toast.success("Successfully logged in!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      title: "Smart Question Bank",
      description: "Comprehensive database of multiple-choice questions with detailed explanations"
    },
    {
      icon: <Users className="h-6 w-6 text-green-600" />,
      title: "User Management",
      description: "Secure authentication system for exam takers and administrators"
    },
    {
      icon: <Award className="h-6 w-6 text-purple-600" />,
      title: "Flexible Testing",
      description: "Choose between 20 or 50 question tests with randomized answer choices"
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-orange-600" />,
      title: "Detailed Analytics",
      description: "Comprehensive results with explanations and performance insights"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">ExamPortal</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Modern Online
                <span className="text-blue-600 block">Exam Platform</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Fast, secure, and user-friendly platform for hosting multiple-choice exams
                with detailed analytics and explanations.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {feature.icon}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Login Card */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Sign in to access your exams
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={credentials.email}
                      onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 ExamPortal. Built for fast, secure online examinations.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
