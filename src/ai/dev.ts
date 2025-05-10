import { config } from 'dotenv';
config();

import '@/ai/flows/validate-quiz-quality.ts';
import '@/ai/flows/generate-quiz-question.ts';