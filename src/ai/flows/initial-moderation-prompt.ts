// moderation-prompt.ts
'use server';
/**
 * @fileOverview A prompt generator AI agent that provides example prompts for different moderation types.
 *
 * - generateInitialModerationPrompts - A function that generates example prompts for text, audio, visual and deepfake moderation.
 * - InitialModerationPromptsInput - The input type for the generateInitialModerationPrompts function.
 * - InitialModerationPromptsOutput - The return type for the generateInitialModerationPrompts function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const InitialModerationPromptsInputSchema = z.object({
  textModerationTask: z.string().optional().describe('The task for text moderation, such as hate speech detection.'),
  audioModerationTask: z.string().optional().describe('The task for audio moderation, such as detecting harmful speech.'),
  visualModerationTask: z.string().optional().describe('The task for visual moderation, such as identifying violent content.'),
  deepfakeDetectionTask: z.string().optional().describe('The task for deepfake detection, such as verifying media authenticity.'),
});
export type InitialModerationPromptsInput = z.infer<typeof InitialModerationPromptsInputSchema>;

const InitialModerationPromptsOutputSchema = z.object({
  textPrompt: z.string().describe('An example prompt for text moderation.'),
  audioPrompt: z.string().describe('An example prompt for audio moderation.'),
  visualPrompt: z.string().describe('An example prompt for visual moderation.'),
  deepfakePrompt: z.string().describe('An example prompt for deepfake detection.'),
});
export type InitialModerationPromptsOutput = z.infer<typeof InitialModerationPromptsOutputSchema>;

export async function generateInitialModerationPrompts(
  input: InitialModerationPromptsInput
): Promise<InitialModerationPromptsOutput> {
  return initialModerationPromptsFlow(input);
}

const initialModerationPromptsPrompt = ai.definePrompt({
  name: 'initialModerationPromptsPrompt',
  input: {
    schema: z.object({
      textModerationTask: z.string().optional().describe('The task for text moderation, such as hate speech detection.'),
      audioModerationTask: z.string().optional().describe('The task for audio moderation, such as detecting harmful speech.'),
      visualModerationTask: z.string().optional().describe('The task for visual moderation, such as identifying violent content.'),
      deepfakeDetectionTask: z.string().optional().describe('The task for deepfake detection, such as verifying media authenticity.'),
    }),
  },
  output: {
    schema: z.object({
      textPrompt: z.string().describe('An example prompt for text moderation.'),
      audioPrompt: z.string().describe('An example prompt for audio moderation.'),
      visualPrompt: z.string().describe('An example prompt for visual moderation.'),
      deepfakePrompt: z.string().describe('An example prompt for deepfake detection.'),
    }),
  },
  prompt: `You are an AI prompt generator. Generate example prompts for different types of moderation tasks. The prompts should be clear and concise, guiding the user on how to effectively use the moderation system.\n\nIf the user specifies a task, create a prompt for that task; otherwise, create a generic prompt.\n\nText Moderation Task: {{{textModerationTask}}}\nAudio Moderation Task: {{{audioModerationTask}}}\nVisual Moderation Task: {{{visualModerationTask}}}\nDeepfake Detection Task: {{{deepfakeDetectionTask}}}\n\nOutput the result as a JSON object.
`,
});

const initialModerationPromptsFlow = ai.defineFlow<
  typeof InitialModerationPromptsInputSchema,
  typeof InitialModerationPromptsOutputSchema
>(
  {
    name: 'initialModerationPromptsFlow',
    inputSchema: InitialModerationPromptsInputSchema,
    outputSchema: InitialModerationPromptsOutputSchema,
  },
  async input => {
    const {output} = await initialModerationPromptsPrompt(input);
    return output!;
  }
);
