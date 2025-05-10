
"use client";

import type { QuizQuestion } from "@/lib/types";
import { AnswerOption } from "./AnswerOption";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

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
        {showFeedback && question.explanation && (
          <div className="mt-6 p-4 bg-secondary/20 rounded-md border border-border shadow-sm">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-primary mb-1">Додатне информације:</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

