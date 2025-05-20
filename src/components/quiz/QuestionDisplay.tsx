
"use client";

import type { QuizQuestion } from "@/lib/types";
import { AnswerOption } from "./AnswerOption";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuestionDisplayProps {
  question: QuizQuestion;
  onAnswerSelect: (answerIndex: number) => void;
  selectedAnswerIndex: number | null;
  showFeedback: boolean;
  questionNumber: number;
  totalQuestions: number;
  className?: string;
}

export function QuestionDisplay({
  question,
  onAnswerSelect,
  selectedAnswerIndex,
  showFeedback,
  questionNumber,
  totalQuestions,
  className,
}: QuestionDisplayProps) {
  return (
    <Card className={cn(
      "w-full shadow-3d hover-shadow-3d transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 animate-in fade-in-0 slide-in-from-bottom-3",
      "flex flex-col", 
      className
      )}>
      <CardHeader className="p-2">
        <CardDescription className="text-xs text-primary text-shadow-sm">
          Питање {questionNumber} од {totalQuestions}
        </CardDescription>
        <CardTitle className="text-base md:text-lg !mt-0.5 leading-tight text-shadow">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0 space-y-1.5 md:space-y-2 flex-grow">
        <div className="space-y-1.5 md:space-y-2">
          {question.answers.map((answer, index) => (
            <AnswerOption
              key={`${question.id}-answer-${index}`}
              answerText={answer}
              onClick={() => onAnswerSelect(index)}
              isSelected={selectedAnswerIndex === index}
              isCorrect={index === question.correctAnswerIndex}
              isActualCorrect={index === question.correctAnswerIndex}
              showFeedback={showFeedback}
              disabled={showFeedback}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
