
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
        return isCorrect ? "default" : "destructive"; 
      }
      if (isActualCorrect) {
        return "outline"; 
      }
    }
    return "secondary";
  };

  const getIcon = () => {
    if (showFeedback && isSelected) {
      return isCorrect ? (
        <CheckCircle2 className="text-green-400 drop-shadow-[0_0_3px_rgba(74,222,128,0.7)]" />
      ) : (
        <XCircle className="text-red-400 drop-shadow-[0_0_3px_rgba(239,68,68,0.7)]" />
      );
    }
    if (showFeedback && isActualCorrect && !isSelected){
       return <CheckCircle2 className="text-green-400 opacity-70 drop-shadow-[0_0_3px_rgba(74,222,128,0.5)]" />
    }
    return null;
  };

  return (
    <Button
      variant={getVariant()}
      className={cn(
        "w-full h-auto min-h-[3.5rem] justify-start text-left py-3 px-4 whitespace-normal break-words transition-all duration-300 ease-in-out",
        "shadow-button-3d hover-shadow-button-3d-neutral transform hover:scale-[1.03] hover:-translate-y-0.5",
        showFeedback && isSelected && isCorrect && "ring-2 ring-green-500/70 border-green-500/70 bg-green-500/20 hover:bg-green-500/30 shadow-glow-green",
        showFeedback && isSelected && !isCorrect && "ring-2 ring-destructive/70 border-destructive/70 bg-red-500/20 hover:bg-red-500/30 shadow-glow-red",
        showFeedback && isActualCorrect && !isSelected && "ring-1 ring-green-500/50 border-green-500/50 opacity-80 hover:opacity-100",
        disabled && "opacity-70 cursor-not-allowed",
        "text-shadow-sm"
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
