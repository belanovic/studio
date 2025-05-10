
"use client";

import type { QuizQuestion } from "@/lib/types";
import { AnswerOption } from "./AnswerOption";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Info icon import is removed as it's no longer used here.

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
    <Card className="w-full shadow-2xl animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
      <CardHeader>
        <CardDescription className="text-lg text-primary">
          Питање {questionNumber} од {totalQuestions}
        </CardDescription>
        <CardTitle className="text-2xl md:text-3xl !mt-2 leading-tight">
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
        {/* Explanation section has been removed from here. It will be handled by QuizContainer. */}
      </CardContent>
    </Card>
  );
}

