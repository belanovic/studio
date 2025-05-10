
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

interface AnswerOptionProps {
  answerText: string;
  onClick: () => void;
  isSelected: boolean;
  isCorrect: boolean;
  showFeedback: boolean;
  disabled: boolean;
  isActualCorrect: boolean; // To highlight the correct answer if a wrong one was selected
}

export function AnswerOption({
  answerText,
  onClick,
  isSelected,
  isCorrect,
  showFeedback,
  disabled,
  isActualCorrect,
}: AnswerOptionProps) {
  const getVariant = () => {
    if (showFeedback) {
      if (isSelected) {
        return isCorrect ? "default" : "destructive"; // 'default' uses primary (orange) for correct selected
      }
      if (isActualCorrect) {
        return "outline"; // Highlight actual correct answer subtly if user chose wrong
      }
    }
    return "secondary"; // Default appearance before feedback
  };

  const getIcon = () => {
    if (showFeedback && isSelected) {
      return isCorrect ? (
        <CheckCircle2 className="text-green-400" />
      ) : (
        <XCircle className="text-red-400" />
      );
    }
    if (showFeedback && isActualCorrect && !isSelected){
       return <CheckCircle2 className="text-green-400 opacity-70" />
    }
    return null;
  };

  return (
    <Button
      variant={getVariant()}
      className={cn(
        "w-full h-auto min-h-[3.5rem] justify-start text-left py-3 px-4 whitespace-normal break-words transition-all duration-300 ease-in-out transform hover:scale-[1.02]",
        "shadow-md hover:shadow-lg",
        showFeedback && isSelected && isCorrect && "ring-2 ring-green-500 border-green-500 bg-green-500/20 hover:bg-green-500/30",
        showFeedback && isSelected && !isCorrect && "ring-2 ring-destructive border-destructive bg-red-500/20 hover:bg-red-500/30",
        showFeedback && isActualCorrect && !isSelected && "ring-1 ring-green-500 border-green-500 opacity-80",
        disabled && "opacity-70 cursor-not-allowed"
      )}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isSelected}
    >
      <span className="flex-grow">{answerText}</span>
      {getIcon()}
    </Button>
  );
}
