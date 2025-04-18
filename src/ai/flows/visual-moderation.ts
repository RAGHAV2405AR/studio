'use server';

/**
 * @fileOverview A visual moderation AI agent.
 *
 * - visualModerate - A function that moderates visual content.
 * - VisualModerateInput - The input type for the visualModerate function.
 * - VisualModerateOutput - The return type for the visualModerate function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const VisualModerateInputSchema = z.object({
  image: z.string().describe('The base64 encoded image to moderate.'),
});

export type VisualModerateInput = z.infer<typeof VisualModerateInputSchema>;

const VisualModerateOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the image is safe or violates policy.'),
  reason: z.string().describe('The reason for the moderation decision.'),
});

export type VisualModerateOutput = z.infer<typeof VisualModerateOutputSchema>;

export async function visualModeration(input: VisualModerateInput): Promise<VisualModerateOutput> {
  return visualModerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'visualModerationPrompt',
  input: {
    schema: z.object({
      image: z.string().describe('The base64 encoded image to moderate.'),
    }),
  },
  output: {
    schema: z.object({
      isSafe: z.boolean().describe('Whether the image is safe or violates policy.'),
      reason: z.string().describe('The reason for the moderation decision.'),
    }),
  },
  prompt: `You are an AI visual content moderation expert. Your task is to analyze the given image and determine if it violates any content policies.

Image: {{media url=image}}

Analyze the image and determine if it is safe or violates any content policies. If it violates, set isSafe to false and provide a detailed reason. If it is safe, set isSafe to true and explain why it is considered safe.`,
});

const visualModerationFlow = ai.defineFlow<
  typeof VisualModerateInputSchema,
  typeof VisualModerateOutputSchema
>({
  name: 'visualModerationFlow',
  inputSchema: VisualModerateInputSchema,
  outputSchema: VisualModerateOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
