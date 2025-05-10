// src/ai/flows/validate-quiz-quality.ts
'use server';
/**
 * @fileOverview A flow to validate the quality of generated quiz questions and answers.
 *
 * - validateQuizQuality - A function that validates the quality of a quiz question and its answers.
 * - ValidateQuizQualityInput - The input type for the validateQuizQuality function.
 * - ValidateQuizQualityOutput - The return type for the validateQuizQuality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateQuizQualityInputSchema = z.object({
  question: z.string().describe('The quiz question to validate.'),
  answers: z.array(z.string()).describe('The possible answers to the question.'),
  correctAnswerIndex: z.number().min(0).max(3).describe('The index of the correct answer in the answers array.'),
});
export type ValidateQuizQualityInput = z.infer<typeof ValidateQuizQualityInputSchema>;

const ValidateQuizQualityOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the quiz question and answers are valid.'),
  reason: z.string().optional().describe('The reason why the quiz question and answers are invalid, if applicable.'),
});
export type ValidateQuizQualityOutput = z.infer<typeof ValidateQuizQualityOutputSchema>;

export async function validateQuizQuality(input: ValidateQuizQualityInput): Promise<ValidateQuizQualityOutput> {
  return validateQuizQualityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateQuizQualityPrompt',
  input: {schema: ValidateQuizQualityInputSchema},
  output: {schema: ValidateQuizQualityOutputSchema},
  prompt: `You are an expert quiz validator. Your job is to validate the quality of a given quiz question and its answers.

  Here's the quiz question:
  Question: {{{question}}}

  Here are the possible answers:
  {{#each answers}}
  - {{{this}}}
  {{/each}}

  The correct answer is at index: {{{correctAnswerIndex}}}

  Determine if the question and answers are valid. A valid question should be:
  - Accurate: The correct answer should be factually correct.
  - Relevant: The question should be related to general knowledge about Serbia, the region, or the world.
  - Appropriately challenging: The question should not be too simple (e.g., "What is the capital of Serbia?").
  - Unambiguous: There should be only one correct answer, and the other answers should be clearly incorrect.

  Respond with a JSON object that has:
  - isValid (boolean): true if the question is valid, false otherwise.
  - reason (string, optional): If isValid is false, provide a brief explanation of why the question is invalid.
`,
});

const validateQuizQualityFlow = ai.defineFlow(
  {
    name: 'validateQuizQualityFlow',
    inputSchema: ValidateQuizQualityInputSchema,
    outputSchema: ValidateQuizQualityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
