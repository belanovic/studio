
"use client";

import type { QuizQuestion } from "@/lib/types";
import { AnswerOption } from "./AnswerOption";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionDisplayProps {
  question: QuizQuestion;
  onAnswerSelect: (answerIndex: number) => void;
  selectedAnswerIndex: number | null;
  showFeedback: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionDisplay({
  question,
  onAnswerSelect,
  selectedAnswerIndex,
  showFeedback,
  questionNumber,
  totalQuestions,
}: QuestionDisplayProps) {
  return (
    <Card className="w-full shadow-3d hover-shadow-3d transition-all duration-300 ease-in-out transform hover:-translate-y-1 animate-in fade-in-0 slide-in-from-bottom-5">
      <CardHeader>
        <CardDescription className="text-lg text-primary text-shadow-sm">
          Питање {questionNumber} од {totalQuestions}
        </CardDescription>
        <CardTitle className="text-2xl md:text-3xl !mt-2 leading-tight text-shadow">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 md:space-y-4">
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
