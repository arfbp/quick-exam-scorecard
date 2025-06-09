
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestions } from "@/hooks/useQuestions";
import { useCategories } from "@/hooks/useCategories";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Upload, Plus, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useCustomAuth();
  const { questions, addQuestion, deleteQuestion, addBulkQuestions } = useQuestions();
  const { categories } = useCategories();
  
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    choice_a: "",
    choice_b: "",
    choice_c: "",
    choice_d: "",
    correct_answer: "A" as 'A' | 'B' | 'C' | 'D',
    explanation: "",
    category_id: undefined as number | undefined
  });

  const [csvData, setCsvData] = useState("");

  // Redirect if not admin
  if (!user || !isAdmin) {
    navigate("/dashboard");
    return null;
  }

  const handleAddQuestion = async () => {
    if (newQuestion.question_text && newQuestion.choice_a && newQuestion.choice_b && newQuestion.choice_c && newQuestion.choice_d) {
      try {
        await addQuestion(newQuestion);
        setNewQuestion({
          question_text: "",
          choice_a: "",
          choice_b: "",
          choice_c: "",
          choice_d: "",
          correct_answer: "A",
          explanation: "",
          category_id: undefined
        });
        toast.success("Question added successfully!");
      } catch (error) {
        toast.error("Failed to add question");
      }
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    try {
      await deleteQuestion(id);
      toast.success("Question deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete question");
    }
  };

  const handleCSVUpload = async () => {
    try {
      const lines = csvData.split('\n');
      const questionsData = lines.slice(1).map((line) => {
        const [question_text, choice_a, choice_b, choice_c, choice_d, correct_answer, explanation, categoryName] = line.split(',');
        const category = categories.find(c => c.name.toLowerCase() === categoryName?.trim().toLowerCase());
        
        return {
          question_text: question_text?.trim(),
          choice_a: choice_a?.trim(),
          choice_b: choice_b?.trim(), 
          choice_c: choice_c?.trim(),
          choice_d: choice_d?.trim(),
          correct_answer: correct_answer?.trim() as 'A' | 'B' | 'C' | 'D',
          explanation: explanation?.trim() || "",
          category_id: category?.id
        };
      }).filter(q => q.question_text);
      
      await addBulkQuestions(questionsData);
      setCsvData("");
      toast.success("Questions uploaded successfully!");
    } catch (error) {
      toast.error("Error parsing CSV data. Please check the format.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {questions.length} Questions in Database
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="add-question" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="add-question" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Question</span>
              </TabsTrigger>
              <TabsTrigger value="bulk-upload" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Bulk Upload</span>
              </TabsTrigger>
              <TabsTrigger value="manage-questions" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Manage Questions</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="add-question">
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5 text-blue-600" />
                    <span>Add New Question</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={newQuestion.category_id?.toString() || ""} 
                      onValueChange={(value) => setNewQuestion({ ...newQuestion, category_id: value ? parseInt(value) : undefined })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="question">Question</Label>
                    <Textarea
                      id="question"
                      placeholder="Enter your question here..."
                      value={newQuestion.question_text}
                      onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="choiceA">Choice A</Label>
                      <Input
                        id="choiceA"
                        placeholder="First option..."
                        value={newQuestion.choice_a}
                        onChange={(e) => setNewQuestion({ ...newQuestion, choice_a: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="choiceB">Choice B</Label>
                      <Input
                        id="choiceB"
                        placeholder="Second option..."
                        value={newQuestion.choice_b}
                        onChange={(e) => setNewQuestion({ ...newQuestion, choice_b: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="choiceC">Choice C</Label>
                      <Input
                        id="choiceC"
                        placeholder="Third option..."
                        value={newQuestion.choice_c}
                        onChange={(e) => setNewQuestion({ ...newQuestion, choice_c: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="choiceD">Choice D</Label>
                      <Input
                        id="choiceD"
                        placeholder="Fourth option..."
                        value={newQuestion.choice_d}
                        onChange={(e) => setNewQuestion({ ...newQuestion, choice_d: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="correct">Correct Answer</Label>
                      <Select 
                        value={newQuestion.correct_answer} 
                        onValueChange={(value) => setNewQuestion({ ...newQuestion, correct_answer: value as 'A' | 'B' | 'C' | 'D' })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="explanation">Explanation (Optional)</Label>
                    <Textarea
                      id="explanation"
                      placeholder="Explain why this answer is correct..."
                      value={newQuestion.explanation}
                      onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                    />
                  </div>

                  <Button 
                    onClick={handleAddQuestion}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bulk-upload">
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5 text-blue-600" />
                    <span>Bulk Upload Questions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">CSV Format:</h3>
                    <p className="text-blue-800 text-sm mb-2">
                      Question, Choice A, Choice B, Choice C, Choice D, Correct Answer, Explanation, Category
                    </p>
                    <code className="text-xs bg-white p-2 rounded block text-gray-700">
                      What is 2+2?, 3, 4, 5, 6, B, Basic addition, Mathematics
                    </code>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="csv">CSV Data</Label>
                    <Textarea
                      id="csv"
                      placeholder="Paste your CSV data here..."
                      value={csvData}
                      onChange={(e) => setCsvData(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </div>

                  <Button 
                    onClick={handleCSVUpload}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                    disabled={!csvData.trim()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Questions
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manage-questions">
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Question Database</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <Card key={question.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900">
                                  {index + 1}. {question.question_text}
                                </h3>
                                {question.exam_categories && (
                                  <Badge variant="outline" className="text-xs">
                                    {question.exam_categories.name}
                                  </Badge>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {[question.choice_a, question.choice_b, question.choice_c, question.choice_d].map((choice, choiceIndex) => (
                                  <div 
                                    key={choiceIndex}
                                    className={`p-2 rounded ${
                                      String.fromCharCode(65 + choiceIndex) === question.correct_answer 
                                        ? "bg-green-100 text-green-800" 
                                        : "bg-gray-100"
                                    }`}
                                  >
                                    {String.fromCharCode(65 + choiceIndex)}. {choice}
                                  </div>
                                ))}
                              </div>
                              {question.explanation && (
                                <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                                  <strong>Explanation:</strong> {question.explanation}
                                </div>
                              )}
                            </div>
                            <Button
                              onClick={() => handleDeleteQuestion(question.id)}
                              variant="outline"
                              size="sm"
                              className="ml-4 text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {questions.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No questions in the database yet.</p>
                        <p className="text-sm">Add questions using the tabs above.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;
