"use server";

import type { QuizQuestion } from "@/lib/types";
import { allQuestions } from "@/lib/questions";

const TOTAL_QUESTIONS_PER_ROUND = 5;

// Helper function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

export async function fetchQuizQuestionsAction(): Promise<QuizQuestion[]> {
  console.log(`Attempting to fetch ${TOTAL_QUESTIONS_PER_ROUND} static questions.`);

  if (!allQuestions || allQuestions.length === 0) {
    console.error("Static questions list is empty or not loaded.");
    throw new Error("Нема доступних питања. Молимо контактирајте администратора.");
  }

  const shuffledQuestions = shuffleArray(allQuestions);
  
  const selectedQuestions = shuffledQuestions.slice(0, TOTAL_QUESTIONS_PER_ROUND);

  if (selectedQuestions.length < TOTAL_QUESTIONS_PER_ROUND && allQuestions.length < TOTAL_QUESTIONS_PER_ROUND) {
    console.warn(`Could only fetch ${selectedQuestions.length} questions because only ${allQuestions.length} are available in total.`);
  } else if (selectedQuestions.length < TOTAL_QUESTIONS_PER_ROUND) {
     console.warn(`Could only fetch ${selectedQuestions.length} questions for the round. This usually means there are fewer than ${TOTAL_QUESTIONS_PER_ROUND} questions defined.`);
  }
  
  console.log(`Fetched ${selectedQuestions.length} questions successfully.`);
  return selectedQuestions;
}