'use server';

/**
 * @fileOverview An audio moderation AI agent.
 *
 * - moderateAudio - A function that moderates audio input.
 * - ModerateAudioInput - The input type for the moderateAudio function.
 * - ModerateAudioOutput - The return type for the moderateAudio function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ModerateAudioInputSchema = z.object({
  audio: z.string().describe('The base64 encoded audio to moderate.'),
});
export type ModerateAudioInput = z.infer<typeof ModerateAudioInputSchema>;

const ModerateAudioOutputSchema = z.object({
  isHarmful: z.boolean().describe('Whether the audio contains harmful speech.'),
  reason: z.string().describe('The reason for the determination.'),
});
export type ModerateAudioOutput = z.infer<typeof ModerateAudioOutputSchema>;

export async function moderateAudio(input: ModerateAudioInput): Promise<ModerateAudioOutput> {
  return moderateAudioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moderateAudioPrompt',
  input: {
    schema: z.object({
      audio: z.string().describe('The base64 encoded audio to moderate.'),
    }),
  },
  output: {
    schema: z.object({
      isHarmful: z.boolean().describe('Whether the audio contains harmful speech.'),
      reason: z.string().describe('The reason for the determination.'),
    }),
  },
  prompt: `You are an AI content moderation expert. Your task is to analyze the given audio and determine if it contains harmful speech, aggressive tones, or trigger words.

Audio: {{media url=audio}}

Determine whether the audio contains harmful content. If it does, set isHarmful to true and provide a detailed reason. If not, set isHarmful to false and explain why it is not considered harmful.
`,
});

const moderateAudioFlow = ai.defineFlow<
  typeof ModerateAudioInputSchema,
  typeof ModerateAudioOutputSchema
>({
  name: 'moderateAudioFlow',
  inputSchema: ModerateAudioInputSchema,
  outputSchema: ModerateAudioOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
