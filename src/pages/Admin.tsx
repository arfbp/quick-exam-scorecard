
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Upload, Plus, Trash2, FileText, Users } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    choiceA: "",
    choiceB: "",
    choiceC: "",
    choiceD: "",
    correct: "A",
    explanation: ""
  });

  const [csvData, setCsvData] = useState("");
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "What is the capital of France?",
      choices: ["London", "Berlin", "Paris", "Madrid"],
      correct: "C",
      explanation: "Paris is the capital and most populous city of France."
    }
  ]);

  const handleAddQuestion = () => {
    if (newQuestion.question && newQuestion.choiceA && newQuestion.choiceB && newQuestion.choiceC && newQuestion.choiceD) {
      const question = {
        id: Date.now(),
        question: newQuestion.question,
        choices: [newQuestion.choiceA, newQuestion.choiceB, newQuestion.choiceC, newQuestion.choiceD],
        correct: newQuestion.correct,
        explanation: newQuestion.explanation
      };
      
      setQuestions([...questions, question]);
      setNewQuestion({
        question: "",
        choiceA: "",
        choiceB: "",
        choiceC: "",
        choiceD: "",
        correct: "A",
        explanation: ""
      });
    }
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleCSVUpload = () => {
    try {
      const lines = csvData.split('\n');
      const newQuestions = lines.slice(1).map((line, index) => {
        const [question, choiceA, choiceB, choiceC, choiceD, correct, explanation] = line.split(',');
        return {
          id: Date.now() + index,
          question: question.trim(),
          choices: [choiceA.trim(), choiceB.trim(), choiceC.trim(), choiceD.trim()],
          correct: correct.trim(),
          explanation: explanation ? explanation.trim() : ""
        };
      }).filter(q => q.question);
      
      setQuestions([...questions, ...newQuestions]);
      setCsvData("");
    } catch (error) {
      alert("Error parsing CSV data. Please check the format.");
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
                    <Label htmlFor="question">Question</Label>
                    <Textarea
                      id="question"
                      placeholder="Enter your question here..."
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="choiceA">Choice A</Label>
                      <Input
                        id="choiceA"
                        placeholder="First option..."
                        value={newQuestion.choiceA}
                        onChange={(e) => setNewQuestion({ ...newQuestion, choiceA: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="choiceB">Choice B</Label>
                      <Input
                        id="choiceB"
                        placeholder="Second option..."
                        value={newQuestion.choiceB}
                        onChange={(e) => setNewQuestion({ ...newQuestion, choiceB: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="choiceC">Choice C</Label>
                      <Input
                        id="choiceC"
                        placeholder="Third option..."
                        value={newQuestion.choiceC}
                        onChange={(e) => setNewQuestion({ ...newQuestion, choiceC: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="choiceD">Choice D</Label>
                      <Input
                        id="choiceD"
                        placeholder="Fourth option..."
                        value={newQuestion.choiceD}
                        onChange={(e) => setNewQuestion({ ...newQuestion, choiceD: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="correct">Correct Answer</Label>
                      <select
                        id="correct"
                        value={newQuestion.correct}
                        onChange={(e) => setNewQuestion({ ...newQuestion, correct: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
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
                      Question, Choice A, Choice B, Choice C, Choice D, Correct Answer, Explanation
                    </p>
                    <code className="text-xs bg-white p-2 rounded block text-gray-700">
                      What is 2+2?, 3, 4, 5, 6, B, Basic addition
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
                              <h3 className="font-semibold text-gray-900">
                                {index + 1}. {question.question}
                              </h3>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {question.choices.map((choice, choiceIndex) => (
                                  <div 
                                    key={choiceIndex}
                                    className={`p-2 rounded ${
                                      String.fromCharCode(65 + choiceIndex) === question.correct 
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
