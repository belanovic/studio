
export interface QuizQuestion {
  id: string; // Unique ID for React keys
  question: string; // The quiz question in Serbian Cyrillic.
  answers: string[]; // Four possible answers to the question, in Serbian Cyrillic. (length 4)
  correctAnswerIndex: number; // The index (0-3) of the correct answer in the answers array.
  explanation: string; // A short explanation or interesting fact about the correct answer (1-3 sentences), in Serbian Cyrillic.
}

export type QuizState = "welcome" | "loading" | "playing" | "feedback" | "results" | "error";
