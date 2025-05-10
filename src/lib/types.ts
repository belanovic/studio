
import type { GenerateQuizQuestionOutput } from "@/ai/flows/generate-quiz-question";

export interface QuizQuestion extends GenerateQuizQuestionOutput {
  id: string; // Unique ID for React keys
}

export type QuizState = "welcome" | "loading" | "playing" | "feedback" | "results" | "error";
