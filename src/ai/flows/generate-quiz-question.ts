// src/ai/flows/generate-quiz-question.ts
'use server';

/**
 * @fileOverview Generates a quiz question with four answer options, focusing on general knowledge about Serbia, the region, and the world. The questions are designed to be engaging and not overly simplistic, with only one correct answer among four options. It also provides a short explanation for the correct answer.
 *
 * - generateQuizQuestion - A function that handles the quiz question generation process.
 * - GenerateQuizQuestionInput - The input type for the generateQuizQuestion function.
 * - GenerateQuizQuestionOutput - The return type for the generateQuizQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizQuestionInputSchema = z.object({
  topic: z
    .string()
    .describe(
      'The topic of the quiz question.  If not provided, the question will be on a random topic related to Serbia, the region, or the world.'
    )
    .optional(),
});
export type GenerateQuizQuestionInput = z.infer<typeof GenerateQuizQuestionInputSchema>;

const GenerateQuizQuestionOutputSchema = z.object({
  question: z.string().describe('The quiz question in Serbian Cyrillic.'),
  answers: z
    .array(z.string())
    .length(4)
    .describe('Four possible answers to the question, in Serbian Cyrillic.'),
  correctAnswerIndex: z
    .number()
    .int()
    .min(0)
    .max(3)
    .describe('The index (0-3) of the correct answer in the answers array.'),
  explanation: z
    .string()
    .describe(
      'A short explanation or interesting fact about the correct answer (1-3 sentences), in Serbian Cyrillic.'
    ),
});
export type GenerateQuizQuestionOutput = z.infer<typeof GenerateQuizQuestionOutputSchema>;

export async function generateQuizQuestion(input: GenerateQuizQuestionInput): Promise<GenerateQuizQuestionOutput> {
  return generateQuizQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizQuestionPrompt',
  input: {schema: GenerateQuizQuestionInputSchema},
  output: {schema: GenerateQuizQuestionOutputSchema},
  prompt: `Generišite питање опште културе на српском језику (ћирилица) о Србији, региону или свету.

Pitanje treba da bude zanimljivo i ne previse jednostavno, sa jednim tacnim odgovorom od cetiri ponudjena.
Pitanja ne treba da budu previse jednostavna, kao npr koji je glavni grad Srbije, nego malo mastovitija, po uzoru na druge kvizove
obrati paznju na to da postoji samo jedan tacan odgovor od ponudjena cetiri.

Уверите се да су сви одговори релевантни и да имају смисла у контексту питања.
Такође, након тачног одговора, пружите кратко објашњење или занимљивост у вези са тачним одговором, у једној до три реченице.

Odgovorite u JSON formatu:
{
  "question": "Питање?",
  "answers": ["Одговор 1", "Одговор 2", "Одговор 3", "Одговор 4"],
  "correctAnswerIndex": 0, // Индекс тачног одговора (0-3)
  "explanation": "Кратко објашњење или занимљивост о тачном одговору, у једној до три реченице, на српском језику (ћирилица)."
}

{% if topic %}Tema pitanja: {{topic}}{% endif %}`,
});

const generateQuizQuestionFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionFlow',
    inputSchema: GenerateQuizQuestionInputSchema,
    outputSchema: GenerateQuizQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

