
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import type { QuizQuestion, QuizState } from "@/lib/types";
import { fetchQuizQuestionsAction } from "@/app/actions";
import { QuestionDisplay } from "./QuestionDisplay";
import { QuizResults } from "./QuizResults";
import { Loader2, AlertTriangle, CheckCircle2, XCircle, Info } from "lucide-react";
import { KulturniKrugLogo } from "@/components/icons/KulturniKrugLogo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TOTAL_QUESTIONS = 5;

export function QuizContainer() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizState, setQuizState] = useState<QuizState>("welcome");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const initialLoadRef = useRef(false);

  const loadQuestions = useCallback(async () => {
    setQuizState("loading");
    setFeedbackMessage(null);
    try {
      const fetchedQuestions = await fetchQuizQuestionsAction();
      initialLoadRef.current = true;
      if (fetchedQuestions && fetchedQuestions.length > 0) {
        setQuestions(fetchedQuestions.slice(0, TOTAL_QUESTIONS));
        setQuizState("welcome");
      } else {
        setQuestions([]);
        setFeedbackMessage("Грешка: Није могуће учитати питања. Покушајте поново.");
        setQuizState("error");
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      setQuestions([]);
      setFeedbackMessage("Грешка приликом учитавања питања. Проверите интернет конекцију и покушајте поново.");
      setQuizState("error");
    }
  }, []);

  useEffect(() => {
    if (quizState === "welcome" && !initialLoadRef.current) {
      loadQuestions();
    }
  }, [quizState, loadQuestions]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (quizState !== "playing") return;

    setSelectedAnswerIndex(answerIndex);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswerIndex;

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      setFeedbackMessage("Тачно!");
    } else {
      setFeedbackMessage("Нетачно!");
    }
    setQuizState("feedback");
  };

  const handleNext = () => {
    setSelectedAnswerIndex(null);
    setFeedbackMessage(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setQuizState("playing");
    } else {
      setQuizState("results");
    }
  };

  const handleStartQuiz = () => {
    if (questions.length > 0) {
      setCurrentQuestionIndex(0);
      setSelectedAnswerIndex(null);
      setScore(0);
      setFeedbackMessage(null);
      setQuizState("playing");
    } else if (quizState !== 'loading' && quizState !== 'error') {
      loadQuestions();
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setScore(0);
    setFeedbackMessage(null);
    setQuestions([]);
    initialLoadRef.current = false;
    setQuizState("welcome");
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (quizState === "loading" && !initialLoadRef.current) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-xl h-full p-2 space-y-3">
        <div className="text-center space-y-2">
          <KulturniKrugLogo width={50} height={50} className="mx-auto drop-shadow-lg mb-3" />
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
          <p className="text-base text-muted-foreground text-shadow-sm">Учитавање питања...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl h-full p-2 space-y-2">
      {quizState === "welcome" && (
        <div className="flex flex-col justify-center items-center flex-grow text-center space-y-3 animate-in fade-in-0 zoom-in-95 duration-500">
          <KulturniKrugLogo width={50} height={50} className="mx-auto drop-shadow-lg" />
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-400 to-amber-500 text-shadow-glow-primary">
            Културни Круг
          </h1>
          <p className="text-sm text-muted-foreground text-shadow-sm">
            Тестирајте своје знање из опште културе!
          </p>
          <Button
            size="sm"
            onClick={handleStartQuiz}
            disabled={quizState === 'loading' && questions.length === 0}
            className="text-sm px-5 py-2.5 shadow-button-3d hover-shadow-button-3d-primary transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 ease-in-out"
          >
            {quizState === 'loading' && questions.length === 0 ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Учитавање...
              </>
            ) : (
              "Започни Квиз"
            )}
          </Button>
        </div>
      )}

      {quizState === "loading" && initialLoadRef.current && questions.length === 0 && (
         <div className="flex flex-col justify-center items-center flex-grow text-center space-y-2">
          <KulturniKrugLogo width={50} height={50} className="mx-auto drop-shadow-lg mb-3" />
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
          <p className="text-base text-muted-foreground text-shadow-sm">Учитавање питања...</p>
        </div>
      )}


      {quizState === "error" && (
         <div className="flex flex-col justify-center items-center flex-grow text-center space-y-2 animate-in fade-in-0 duration-500">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto drop-shadow-[0_0_8px_hsl(var(--destructive)/0.5)]" />
          <p className="text-base text-destructive text-shadow">
            {feedbackMessage || "Дошло је до грешке."}
          </p>
          <Button
            size="sm"
            onClick={handleRestart}
            variant="outline"
            className="text-sm shadow-button-3d hover-shadow-button-3d-neutral transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Покушај поново
          </Button>
        </div>
      )}

      {(quizState === "playing" || quizState === "feedback") && currentQuestion && (
        <div className="flex flex-col w-full flex-grow">
          <QuestionDisplay
            question={currentQuestion}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswerIndex={selectedAnswerIndex}
            showFeedback={quizState === "feedback"}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length > 0 ? questions.length : TOTAL_QUESTIONS}
            className="flex-grow mb-1.5" 
          />

          {quizState === "feedback" && (
            <div className="shrink-0"> 
              {currentQuestion.explanation && (
                <Card className="w-full mt-0.5 shadow-md animate-in fade-in-0 slide-in-from-bottom-3 duration-300 bg-card text-card-foreground">
                  <CardHeader className="p-1.5">
                    <div className="flex items-center">
                      <Info className="h-4 w-4 text-primary mr-1.5 shrink-0 drop-shadow-[0_0_5px_hsl(var(--primary)/0.5)]" />
                      <CardTitle className="text-sm font-semibold text-primary text-shadow-glow-primary">Инфо:</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-1.5 pt-0">
                    <p className="text-xs text-muted-foreground leading-snug text-shadow-sm">
                      {currentQuestion.explanation}
                    </p>
                  </CardContent>
                </Card>
              )}
              <div className="flex flex-col items-center space-y-1.5 w-full pt-1.5 animate-in fade-in-0 duration-300">
                {feedbackMessage && (
                  <div className={`flex items-center text-base font-semibold p-1 rounded-md ${selectedAnswerIndex !== null && questions[currentQuestionIndex].answers[selectedAnswerIndex] && selectedAnswerIndex === questions[currentQuestionIndex].correctAnswerIndex ? 'text-green-400 bg-green-500/10 text-shadow-glow-success' : 'text-red-400 bg-red-500/10 text-shadow-glow-destructive'}`}>
                    {selectedAnswerIndex !== null && questions[currentQuestionIndex].answers[selectedAnswerIndex] && selectedAnswerIndex === questions[currentQuestionIndex].correctAnswerIndex ?
                      <CheckCircle2 className="mr-1 h-4 w-4"/> :
                      <XCircle className="mr-1 h-4 w-4"/>}
                    {feedbackMessage}
                  </div>
                )}
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="w-full md:w-auto text-sm py-1.5 shadow-button-3d hover-shadow-button-3d-primary transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
                >
                  {currentQuestionIndex < questions.length - 1 ? "Следеће питање" : "Види Резултате"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {quizState === "results" && (
        <div className="flex flex-col justify-center items-center flex-grow w-full">
          <QuizResults
            score={score}
            totalQuestions={questions.length}
            onRestart={handleRestart}
          />
        </div>
      )}
    </div>
  );
}
