
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle } from "lucide-react";

// Sample questions data
const sampleQuestions = [
  {
    id: 1,
    question: "What is the capital of France?",
    choices: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2,
    explanation: "Paris is the capital and most populous city of France. It has been the country's capital since 508 AD."
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    choices: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
    explanation: "Mars is called the Red Planet because of its reddish appearance, which comes from iron oxide (rust) on its surface."
  },
  {
    id: 3,
    question: "What is 2 + 2?",
    choices: ["3", "4", "5", "6"],
    correct: 1,
    explanation: "Basic arithmetic: 2 + 2 = 4. This is fundamental addition."
  }
];

const Exam = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const questionCount = parseInt(searchParams.get("questions") || "20");
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(questionCount === 20 ? 1800 : 4500); // 30 min or 75 min
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    // Generate questions based on count and randomize choices
    const generateQuestions = () => {
      const generatedQuestions = Array.from({ length: questionCount }, (_, index) => {
        const baseQuestion = sampleQuestions[index % sampleQuestions.length];
        const shuffledChoices = [...baseQuestion.choices];
        
        // Shuffle choices and track new correct answer index
        const correctAnswer = baseQuestion.choices[baseQuestion.correct];
        for (let i = shuffledChoices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledChoices[i], shuffledChoices[j]] = [shuffledChoices[j], shuffledChoices[i]];
        }
        
        const newCorrectIndex = shuffledChoices.indexOf(correctAnswer);
        
        return {
          ...baseQuestion,
          id: index + 1,
          question: `${baseQuestion.question} (Question ${index + 1})`,
          choices: shuffledChoices,
          correct: newCorrectIndex
        };
      });
      
      setQuestions(generatedQuestions);
    };

    generateQuestions();
  }, [questionCount]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (choiceIndex: number) => {
    setAnswers({ ...answers, [currentQuestion]: choiceIndex });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const results = {
      answers,
      questions,
      totalQuestions: questions.length,
      answeredQuestions: Object.keys(answers).length,
      score: Object.entries(answers).reduce((score, [qIndex, answer]) => {
        return questions[parseInt(qIndex)]?.correct === answer ? score + 1 : score;
      }, 0)
    };
    
    localStorage.setItem("examResults", JSON.stringify(results));
    navigate("/results");
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isAnswered = answers[currentQuestion] !== undefined;
  const answeredCount = Object.keys(answers).length;

  if (questions.length === 0) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="font-mono">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
              <Badge variant="secondary">
                {answeredCount} answered
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-mono text-lg font-semibold text-gray-900">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Button 
                onClick={handleSubmit}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Flag className="h-4 w-4 mr-2" />
                Submit Exam
              </Button>
            </div>
          </div>
          <Progress value={progress} className="mt-3 h-2" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 leading-relaxed">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3">
                {currentQ.choices.map((choice: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      answers[currentQuestion] === index
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestion] === index
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}>
                        {answers[currentQuestion] === index && (
                          <CheckCircle className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <span className="font-medium text-gray-700">
                        {String.fromCharCode(65 + index)}. 
                      </span>
                      <span className="text-gray-900">{choice}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>

                <div className="flex items-center space-x-2">
                  {isAnswered && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Answered
                    </Badge>
                  )}
                </div>

                {currentQuestion < questions.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                  >
                    <Flag className="h-4 w-4" />
                    <span>Submit Exam</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Exam;
