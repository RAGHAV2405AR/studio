'use server';

/**
 * @fileOverview A URL moderation AI agent.
 *
 * - moderateURL - A function that moderates a URL to check for harmful content.
 * - ModerateURLInput - The input type for the moderateURL function.
 * - ModerateURLOutput - The return type for the moderateURL function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ModerateURLInputSchema = z.object({
  url: z.string().describe('The URL to moderate.'),
});
export type ModerateURLInput = z.infer<typeof ModerateURLInputSchema>;

const ModerateURLOutputSchema = z.object({
  isHarmful: z.boolean().describe('Whether the URL leads to harmful content.'),
  reason: z.string().describe('The reason for the determination.'),
});
export type ModerateURLOutput = z.infer<typeof ModerateURLOutputSchema>;

export async function moderateURL(input: ModerateURLInput): Promise<ModerateURLOutput> {
  return moderateURLFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moderateURLPrompt',
  input: {
    schema: z.object({
      url: z.string().describe('The URL to moderate.'),
    }),
  },
  output: {
    schema: z.object({
      isHarmful: z.boolean().describe('Whether the URL leads to harmful content.'),
      reason: z.string().describe('The reason for the determination.'),
    }),
  },
  prompt: `You are an AI content moderation expert. Your task is to analyze the content at the given URL and determine if it contains harmful material.

URL: {{{url}}}

Determine whether the URL leads to harmful content. If it does, set isHarmful to true and provide a detailed reason. If not, set isHarmful to false and explain why it is not considered harmful.
`,
});

const moderateURLFlow = ai.defineFlow<
  typeof ModerateURLInputSchema,
  typeof ModerateURLOutputSchema
>({
  name: 'moderateURLFlow',
  inputSchema: ModerateURLInputSchema,
  outputSchema: ModerateURLOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});

    