
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PartyPopper, RotateCcw } from "lucide-react";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export function QuizResults({ score, totalQuestions, onRestart }: QuizResultsProps) {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  let message = "Сјајно!";
  if (percentage < 50) message = "Више среће следећи пут!";
  else if (percentage < 80) message = "Добро урађено!";

  return (
    <Card className="w-full text-center shadow-3d hover-shadow-3d transition-all duration-300 ease-in-out transform hover:-translate-y-1 animate-in fade-in-0 zoom-in-95">
      <CardHeader>
        <div className="mx-auto mb-4">
          <PartyPopper className="w-16 h-16 text-primary drop-shadow-[0_0_10px_hsl(var(--primary)/0.6)]" />
        </div>
        <CardTitle className="text-3xl md:text-4xl text-shadow">Резултати Квиза</CardTitle>
        <CardDescription className="text-lg !mt-2 text-shadow-sm">
          {message}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-5xl font-bold text-primary text-shadow-glow-primary">
          {score} <span className="text-2xl text-foreground text-shadow-sm">/ {totalQuestions}</span>
        </p>
        <p className="text-xl text-muted-foreground text-shadow-sm">
          Остварили сте {percentage}% тачности.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          size="lg"
          onClick={onRestart}
          className="text-lg shadow-button-3d hover-shadow-button-3d-primary transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 ease-in-out"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Покушај поново
        </Button>
      </CardFooter>
    </Card>
  );
}
