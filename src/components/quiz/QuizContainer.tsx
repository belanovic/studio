
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { QuizQuestion, QuizState } from "@/lib/types";
import { fetchQuizQuestionsAction } from "@/app/actions";
import { QuestionDisplay } from "./QuestionDisplay";
import { QuizResults } from "./QuizResults";
import { Loader2, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { KulturniKrugLogo } from "@/components/icons/KulturniKrugLogo";

const TOTAL_QUESTIONS = 5;

export function QuizContainer() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizState, setQuizState] = useState<QuizState>("welcome");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const loadQuestions = useCallback(async () => {
    setQuizState("loading");
    setFeedbackMessage(null);
    try {
      const fetchedQuestions = await fetchQuizQuestionsAction();
      if (fetchedQuestions && fetchedQuestions.length > 0) {
        // Ensure we only use up to TOTAL_QUESTIONS, even if API returns more or less due to generation issues
        setQuestions(fetchedQuestions.slice(0, TOTAL_QUESTIONS));
        setCurrentQuestionIndex(0);
        setSelectedAnswerIndex(null);
        setScore(0);
        setQuizState("playing");
      } else {
        setFeedbackMessage("Грешка: Није могуће учитати питања. Покушајте поново.");
        setQuizState("error");
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      setFeedbackMessage("Грешка приликом учитавања питања. Проверите интернет конекцију и покушајте поново.");
      setQuizState("error");
    }
  }, []);

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

  const handleRestart = () => {
    setQuizState("welcome");
    // Questions will be re-fetched when 'welcome' state transitions to 'loading' via start button
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl p-4 md:p-6 space-y-6 md:space-y-8">
      {quizState === "welcome" && (
        <div className="text-center space-y-8 animate-in fade-in-0 zoom-in-95 duration-500">
          <KulturniKrugLogo className="mx-auto" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-400 to-amber-500">
            Културни Круг
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Тестирајте своје знање из опште културе!
          </p>
          <Button
            size="lg"
            onClick={loadQuestions}
            className="text-xl px-8 py-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Започни Квиз
          </Button>
        </div>
      )}

      {quizState === "loading" && (
        <div className="text-center space-y-4 py-10">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
          <p className="text-xl text-muted-foreground">Учитавање питања...</p>
        </div>
      )}

      {quizState === "error" && (
         <div className="text-center space-y-4 py-10 animate-in fade-in-0 duration-500">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto" />
          <p className="text-xl text-destructive">{feedbackMessage || "Дошло је до грешке."}</p>
          <Button
            size="lg"
            onClick={handleRestart}
            variant="outline"
            className="text-lg shadow-md hover:shadow-lg"
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
          {quizState === "feedback" && (
            <div className="flex flex-col items-center space-y-4 w-full pt-4 animate-in fade-in-0 duration-300">
              {feedbackMessage && (
                <div className={`flex items-center text-2xl font-semibold p-3 rounded-md ${selectedAnswerIndex !== null && questions[currentQuestionIndex].answers[selectedAnswerIndex] && selectedAnswerIndex === questions[currentQuestionIndex].correctAnswerIndex ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
                  {selectedAnswerIndex !== null && questions[currentQuestionIndex].answers[selectedAnswerIndex] && selectedAnswerIndex === questions[currentQuestionIndex].correctAnswerIndex ? 
                    <CheckCircle2 className="mr-2 h-7 w-7"/> : 
                    <XCircle className="mr-2 h-7 w-7"/>}
                  {feedbackMessage}
                </div>
              )}
               <Button
                size="lg"
                onClick={handleNext}
                className="w-full md:w-auto text-lg shadow-lg hover:shadow-xl"
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
