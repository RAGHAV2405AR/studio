'use server';

/**
 * @fileOverview A text moderation AI agent.
 *
 * - moderateText - A function that moderates text input.
 * - ModerateTextInput - The input type for the moderateText function.
 * - ModerateTextOutput - The return type for the moderateText function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ModerateTextInputSchema = z.object({
  text: z.string().describe('The text to moderate.'),
});
export type ModerateTextInput = z.infer<typeof ModerateTextInputSchema>;

const ModerateTextOutputSchema = z.object({
  isHateSpeech: z.boolean().describe('Whether the text contains hate speech.'),
  reason: z.string().describe('The reason for the hate speech determination.'),
});
export type ModerateTextOutput = z.infer<typeof ModerateTextOutputSchema>;

export async function moderateText(input: ModerateTextInput): Promise<ModerateTextOutput> {
  return moderateTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moderateTextPrompt',
  input: {
    schema: z.object({
      text: z.string().describe('The text to moderate.'),
    }),
  },
  output: {
    schema: z.object({
      isHateSpeech: z.boolean().describe('Whether the text contains hate speech.'),
      reason: z.string().describe('The reason for the hate speech determination.'),
    }),
  },
  prompt: `You are an AI content moderation expert. Your task is to analyze the given text and determine if it contains hate speech.

Text: {{{text}}}

Determine whether the text contains hate speech. If it does, set isHateSpeech to true and provide a detailed reason. If not, set isHateSpeech to false and explain why it is not considered hate speech.
`,
});

const moderateTextFlow = ai.defineFlow<
  typeof ModerateTextInputSchema,
  typeof ModerateTextOutputSchema
>({
  name: 'moderateTextFlow',
  inputSchema: ModerateTextInputSchema,
  outputSchema: ModerateTextOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
