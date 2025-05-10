
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

  const initialLoadRef = useRef(false); // To track if initial load attempt has been made

  const loadQuestions = useCallback(async () => {
    setQuizState("loading");
    setFeedbackMessage(null);
    // Do not reset game-specific state like score/index here.
    // That should be handled by the function calling loadQuestions if it's a restart or new game.
    try {
      const fetchedQuestions = await fetchQuizQuestionsAction();
      initialLoadRef.current = true; // Mark that an attempt to load has been made.
      if (fetchedQuestions && fetchedQuestions.length > 0) {
        setQuestions(fetchedQuestions.slice(0, TOTAL_QUESTIONS));
        setQuizState("welcome"); // Ready to show welcome screen with active start button.
      } else {
        setQuestions([]); // Ensure questions are empty if fetch failed to return any.
        setFeedbackMessage("Грешка: Није могуће учитати питања. Покушајте поново.");
        setQuizState("error");
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      setQuestions([]); // Ensure questions are empty on error.
      setFeedbackMessage("Грешка приликом учитавања питања. Проверите интернет конекцију и покушајте поново.");
      setQuizState("error");
    }
  }, []); // Empty dependency array: loadQuestions is stable.

  // Effect for initial question loading
  useEffect(() => {
    // Only attempt to load if it hasn't been attempted yet and we are in the initial welcome state.
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
      // Ensure game state is reset for a fresh start
      setCurrentQuestionIndex(0);
      setSelectedAnswerIndex(null);
      setScore(0);
      setFeedbackMessage(null);
      setQuizState("playing");
    } else if (quizState !== 'loading' && quizState !== 'error') {
      // If no questions, and not already loading or in error, attempt to load.
      loadQuestions();
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setScore(0);
    setFeedbackMessage(null);
    setQuestions([]); // Clear questions
    initialLoadRef.current = false; // Reset the initial load flag to allow useEffect to reload
    setQuizState("welcome"); // This will trigger the useEffect in the next render cycle
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Display global loader only during the very first loading attempt phase
  if (quizState === "loading" && !initialLoadRef.current) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl min-h-screen p-4 md:p-6 space-y-6 md:space-y-8">
        <div className="text-center space-y-4 py-10">
          <KulturniKrugLogo className="mx-auto drop-shadow-lg mb-6" />
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
          <p className="text-xl text-muted-foreground text-shadow-sm">Учитавање питања...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl p-4 md:p-6 space-y-6 md:space-y-8">
      {quizState === "welcome" && (
        <div className="text-center space-y-8 animate-in fade-in-0 zoom-in-95 duration-500">
          <KulturniKrugLogo className="mx-auto drop-shadow-lg" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-400 to-amber-500 text-shadow-glow-primary">
            Културни Круг
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-shadow-sm">
            Тестирајте своје знање из опште културе!
          </p>
          <Button
            size="lg"
            onClick={handleStartQuiz}
            // Disable button if questions are currently being loaded (and none are available yet for playing)
            disabled={quizState === 'loading' && questions.length === 0}
            className="text-xl px-8 py-6 shadow-button-3d hover-shadow-button-3d-primary transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 ease-in-out"
          >
            {/* Show loading indicator on button if it triggered a load and questions are not yet ready */}
            {quizState === 'loading' && questions.length === 0 ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Учитавање...
              </>
            ) : (
              "Започни Квиз"
            )}
          </Button>
        </div>
      )}

      {/* This specific loading state is for when loadQuestions is called by the start button itself,
          or if a reload is triggered while already on the welcome screen.
          The full-page initial loader is handled above. */}
      {quizState === "loading" && initialLoadRef.current && questions.length === 0 && (
         <div className="text-center space-y-4 py-10">
          <KulturniKrugLogo className="mx-auto drop-shadow-lg mb-6" />
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
          <p className="text-xl text-muted-foreground text-shadow-sm">Учитавање питања...</p>
        </div>
      )}


      {quizState === "error" && (
         <div className="text-center space-y-4 py-10 animate-in fade-in-0 duration-500">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto drop-shadow-[0_0_8px_hsl(var(--destructive)/0.5)]" />
          <p className="text-xl text-destructive text-shadow">
            {feedbackMessage || "Дошло је до грешке."}
          </p>
          <Button
            size="lg"
            onClick={handleRestart} // Restart will attempt to load questions again
            variant="outline"
            className="text-lg shadow-button-3d hover-shadow-button-3d-neutral transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Покушај поново
          </Button>
        </div>
      )}

      {(quizState === "playing" || quizState === "feedback") && currentQuestion && (
        <>
          <QuestionDisplay
            question={currentQuestion}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswerIndex={selectedAnswerIndex}
            showFeedback={quizState === "feedback"}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length > 0 ? questions.length : TOTAL_QUESTIONS}
          />

          {quizState === "feedback" && currentQuestion.explanation && (
            <Card className="w-full mt-6 shadow-3d hover-shadow-3d animate-in fade-in-0 slide-in-from-bottom-5 duration-500 bg-card text-card-foreground transition-all ease-in-out transform hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center">
                  <Info className="h-6 w-6 text-primary mr-3 shrink-0 drop-shadow-[0_0_5px_hsl(var(--primary)/0.5)]" />
                  <CardTitle className="text-xl font-semibold text-primary text-shadow-glow-primary">Додатне информације:</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground leading-relaxed text-shadow-sm">
                  {currentQuestion.explanation}
                </p>
              </CardContent>
            </Card>
          )}

          {quizState === "feedback" && (
            <div className="flex flex-col items-center space-y-4 w-full pt-4 animate-in fade-in-0 duration-300">
              {feedbackMessage && (
                <div className={`flex items-center text-2xl font-semibold p-3 rounded-md ${selectedAnswerIndex !== null && questions[currentQuestionIndex].answers[selectedAnswerIndex] && selectedAnswerIndex === questions[currentQuestionIndex].correctAnswerIndex ? 'text-green-400 bg-green-500/10 text-shadow-glow-success' : 'text-red-400 bg-red-500/10 text-shadow-glow-destructive'}`}>
                  {selectedAnswerIndex !== null && questions[currentQuestionIndex].answers[selectedAnswerIndex] && selectedAnswerIndex === questions[currentQuestionIndex].correctAnswerIndex ?
                    <CheckCircle2 className="mr-2 h-7 w-7"/> :
                    <XCircle className="mr-2 h-7 w-7"/>}
                  {feedbackMessage}
                </div>
              )}
               <Button
                size="lg"
                onClick={handleNext}
                className="w-full md:w-auto text-lg shadow-button-3d hover-shadow-button-3d-primary transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
               >
                {currentQuestionIndex < questions.length - 1 ? "Следеће питање" : "Види Резултате"}
              </Button>
            </div>
          )}
        </>
      )}

      {quizState === "results" && (
        <QuizResults
          score={score}
          totalQuestions={questions.length}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
