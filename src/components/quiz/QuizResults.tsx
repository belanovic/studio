
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
    <Card className="w-full text-center shadow-2xl animate-in fade-in-0 zoom-in-95 duration-500">
      <CardHeader>
        <div className="mx-auto mb-4">
          <PartyPopper className="w-16 h-16 text-primary" />
        </div>
        <CardTitle className="text-3xl md:text-4xl">Резултати Квиза</CardTitle>
        <CardDescription className="text-lg !mt-2">
          {message}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-5xl font-bold text-primary">
          {score} <span className="text-2xl text-foreground">/ {totalQuestions}</span>
        </p>
        <p className="text-xl text-muted-foreground">
          Остварили сте {percentage}% тачности.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          size="lg"
          onClick={onRestart}
          className="text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Покушај поново
        </Button>
      </CardFooter>
    </Card>
  );
}
