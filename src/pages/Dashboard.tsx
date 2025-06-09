
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Users, Settings, LogOut, FileText, Award } from "lucide-react";

const Dashboard = () => {
  const { user, signOut, loading, isAdmin } = useCustomAuth();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleStartExam = (questionCount: number) => {
    const categoryParam = selectedCategory ? `&category=${selectedCategory}` : '';
    navigate(`/exam?questions=${questionCount}${categoryParam}`);
  };

  const examOptions = [
    {
      title: "Quick Test",
      description: "20 multiple-choice questions",
      questionCount: 20,
      duration: "30 minutes",
      difficulty: "Standard",
      color: "bg-blue-500"
    },
    {
      title: "Full Test",
      description: "50 multiple-choice questions", 
      questionCount: 50,
      duration: "75 minutes",
      difficulty: "Comprehensive",
      color: "bg-green-500"
    }
  ];

  const stats = [
    { label: "Tests Taken", value: "0", icon: <FileText className="h-5 w-5" /> },
    { label: "Average Score", value: "0%", icon: <Award className="h-5 w-5" /> },
    { label: "Best Score", value: "0%", icon: <Award className="h-5 w-5" /> },
    { label: "Time Spent", value: "0h", icon: <Clock className="h-5 w-5" /> }
  ];

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">ExamLab</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.username}</span>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/admin")}
                  className="hidden sm:flex"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose your exam category and test format to begin your examination.
            </p>
          </div>

          {/* Category Selection */}
          <Card className="max-w-4xl mx-auto border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Select Exam Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  onClick={() => setSelectedCategory(null)}
                  className="h-auto p-3 text-center"
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="h-auto p-3 text-center"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Exam Options */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {examOptions.map((option, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {option.title}
                    </CardTitle>
                    <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                  </div>
                  <p className="text-gray-600">{option.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Clock className="h-3 w-3 mr-1" />
                      {option.duration}
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {option.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {option.questionCount} Questions
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'All Categories'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 mr-2" />
                      Detailed explanations included
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleStartExam(option.questionCount)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium group-hover:bg-blue-700 transition-colors"
                    size="lg"
                  >
                    Start {option.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
