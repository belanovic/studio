
"use server";

import { generateQuizQuestion, type GenerateQuizQuestionOutput } from "@/ai/flows/generate-quiz-question";
import { validateQuizQuality } from "@/ai/flows/validate-quiz-quality";
import type { QuizQuestion } from "@/lib/types";

const TOTAL_QUESTIONS_PER_ROUND = 5;
const MAX_RETRIES_PER_QUESTION = 3;

export async function fetchQuizQuestionsAction(): Promise<QuizQuestion[]> {
  const questions: QuizQuestion[] = [];
  let attemptsToFetchAll = 0;
  const MAX_TOTAL_ATTEMPTS = TOTAL_QUESTIONS_PER_ROUND + 5; // Allow some buffer for retries

  while (questions.length < TOTAL_QUESTIONS_PER_ROUND && attemptsToFetchAll < MAX_TOTAL_ATTEMPTS) {
    attemptsToFetchAll++;
    let currentQuestionRetries = 0;
    let questionIsValid = false;
    let generatedQuestionData: GenerateQuizQuestionOutput | null = null;

    console.log(`Attempting to generate question #${questions.length + 1}`);

    while (currentQuestionRetries < MAX_RETRIES_PER_QUESTION && !questionIsValid) {
      try {
        generatedQuestionData = await generateQuizQuestion({});
        if (generatedQuestionData) {
          console.log(`Validating question: ${generatedQuestionData.question}`);
          const validationResult = await validateQuizQuality({
            question: generatedQuestionData.question,
            answers: generatedQuestionData.answers,
            correctAnswerIndex: generatedQuestionData.correctAnswerIndex,
          });

          if (validationResult.isValid) {
            questionIsValid = true;
            console.log("Question is valid.");
          } else {
            console.warn(`Generated question invalid: ${validationResult.reason || 'No reason provided'}. Retry ${currentQuestionRetries + 1}/${MAX_RETRIES_PER_QUESTION}`);
            currentQuestionRetries++;
          }
        } else {
          console.warn(`Failed to generate question data. Retry ${currentQuestionRetries + 1}/${MAX_RETRIES_PER_QUESTION}`);
          currentQuestionRetries++;
        }
      } catch (error) {
        console.error(`Error during question generation/validation (Retry ${currentQuestionRetries + 1}/${MAX_RETRIES_PER_QUESTION}):`, error);
        currentQuestionRetries++;
      }
    }

    if (questionIsValid && generatedQuestionData) {
      questions.push({
        ...generatedQuestionData,
        id: `q-${Date.now()}-${questions.length}`, // Simple unique ID
      });
    } else {
      console.error(`Failed to generate a valid question for slot ${questions.length + 1} after ${MAX_RETRIES_PER_QUESTION} retries.`);
      // If we can't generate enough valid questions, it might be better to throw an error
      // or return what we have and let the client decide. For now, we continue.
    }
  }

  if (questions.length < TOTAL_QUESTIONS_PER_ROUND) {
    console.warn(`Could only fetch ${questions.length} valid questions out of ${TOTAL_QUESTIONS_PER_ROUND} requested.`);
    // Optionally throw an error here if 5 questions are strictly required.
    // throw new Error(`Неуспешно генерисање довољно питања. Покушајте поново касније.`);
  }
  
  console.log(`Fetched ${questions.length} questions successfully.`);
  return questions;
}
