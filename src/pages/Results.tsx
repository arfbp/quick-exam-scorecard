
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Award, ChevronDown, ChevronUp, Home, RotateCcw, CheckCircle, XCircle, Info } from "lucide-react";

const Results = () => {
  const [results, setResults] = useState<any>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const savedResults = localStorage.getItem("examResults");
    if (!savedResults) {
      navigate("/dashboard");
    } else {
      setResults(JSON.parse(savedResults));
    }
  }, [navigate]);

  const toggleExpanded = (questionIndex: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionIndex)) {
      newExpanded.delete(questionIndex);
    } else {
      newExpanded.add(questionIndex);
    }
    setExpandedQuestions(newExpanded);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (percentage: number) => {
    if (percentage >= 90) return { label: "Excellent", class: "bg-green-100 text-green-800" };
    if (percentage >= 70) return { label: "Good", class: "bg-blue-100 text-blue-800" };
    if (percentage >= 50) return { label: "Average", class: "bg-yellow-100 text-yellow-800" };
    return { label: "Needs Improvement", class: "bg-red-100 text-red-800" };
  };

  if (!results) return null;

  const percentage = Math.round((results.score / results.totalQuestions) * 100);
  const scoreBadge = getScoreBadge(percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Exam Results</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                size="sm"
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Take Another Test
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Score Summary */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Award className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                Your Score
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-2">
                <div className={`text-6xl font-bold ${getScoreColor(percentage)}`}>
                  {percentage}%
                </div>
                <div className="text-2xl text-gray-600">
                  {results.score} out of {results.totalQuestions} correct
                </div>
              </div>
              
              <Badge className={`text-lg px-4 py-2 ${scoreBadge.class}`}>
                {scoreBadge.label}
              </Badge>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{results.totalQuestions}</div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{results.score}</div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{results.totalQuestions - results.score}</div>
                  <div className="text-sm text-gray-600">Incorrect</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Review */}
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-blue-600" />
                <span>Question Review</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.questions.map((question: any, index: number) => {
                const userAnswer = results.answers[index];
                const isCorrect = userAnswer === question.correct;
                const wasAnswered = userAnswer !== undefined;
                
                return (
                  <Collapsible key={index}>
                    <CollapsibleTrigger 
                      onClick={() => toggleExpanded(index)}
                      className="w-full"
                    >
                      <Card className={`border-2 transition-colors ${
                        isCorrect ? "border-green-200 bg-green-50" : 
                        wasAnswered ? "border-red-200 bg-red-50" : 
                        "border-yellow-200 bg-yellow-50"
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isCorrect ? "bg-green-500" : 
                                wasAnswered ? "bg-red-500" : 
                                "bg-yellow-500"
                              }`}>
                                {isCorrect ? (
                                  <CheckCircle className="h-5 w-5 text-white" />
                                ) : wasAnswered ? (
                                  <XCircle className="h-5 w-5 text-white" />
                                ) : (
                                  <span className="text-white text-sm font-bold">?</span>
                                )}
                              </div>
                              <div className="text-left">
                                <p className="font-medium text-gray-900">
                                  Question {index + 1}
                                </p>
                                <p className="text-sm text-gray-600 truncate max-w-md">
                                  {question.question}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={
                                isCorrect ? "bg-green-100 text-green-800" :
                                wasAnswered ? "bg-red-100 text-red-800" :
                                "bg-yellow-100 text-yellow-800"
                              }>
                                {isCorrect ? "Correct" : wasAnswered ? "Incorrect" : "Not Answered"}
                              </Badge>
                              {expandedQuestions.has(index) ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <Card className="mt-2 border-0 bg-white/80">
                        <CardContent className="p-6 space-y-4">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {question.question}
                          </h3>
                          
                          <div className="space-y-2">
                            {question.choices.map((choice: string, choiceIndex: number) => (
                              <div
                                key={choiceIndex}
                                className={`p-3 rounded-lg border ${
                                  choiceIndex === question.correct ? "border-green-500 bg-green-50" :
                                  choiceIndex === userAnswer ? "border-red-500 bg-red-50" :
                                  "border-gray-200 bg-gray-50"
                                }`}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">
                                    {String.fromCharCode(65 + choiceIndex)}.
                                  </span>
                                  <span>{choice}</span>
                                  {choiceIndex === question.correct && (
                                    <Badge className="bg-green-100 text-green-800 text-xs">
                                      Correct Answer
                                    </Badge>
                                  )}
                                  {choiceIndex === userAnswer && choiceIndex !== question.correct && (
                                    <Badge className="bg-red-100 text-red-800 text-xs">
                                      Your Answer
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {question.explanation && (
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
                              <p className="text-blue-800">{question.explanation}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Results;
