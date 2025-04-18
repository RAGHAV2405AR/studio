// SummarizeModerationGuidelines
'use server';

/**
 * @fileOverview Summarizes moderation guidelines into key points.
 *
 * - summarizeModerationGuidelines - A function that summarizes moderation guidelines.
 * - SummarizeModerationGuidelinesInput - The input type for the summarizeModerationGuidelines function.
 * - SummarizeModerationGuidelinesOutput - The return type for the summarizeModerationGuidelines function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeModerationGuidelinesInputSchema = z.object({
  guidelines: z.string().describe('The moderation guidelines to summarize.'),
});
export type SummarizeModerationGuidelinesInput = z.infer<typeof SummarizeModerationGuidelinesInputSchema>;

const SummarizeModerationGuidelinesOutputSchema = z.object({
  summary: z.string().describe('The summarized key points of the moderation guidelines.'),
});
export type SummarizeModerationGuidelinesOutput = z.infer<typeof SummarizeModerationGuidelinesOutputSchema>;

export async function summarizeModerationGuidelines(input: SummarizeModerationGuidelinesInput): Promise<SummarizeModerationGuidelinesOutput> {
  return summarizeModerationGuidelinesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeModerationGuidelinesPrompt',
  input: {
    schema: z.object({
      guidelines: z.string().describe('The moderation guidelines to summarize.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('The summarized key points of the moderation guidelines.'),
    }),
  },
  prompt: `You are an expert at summarizing complex documents.

  Please summarize the following moderation guidelines into key points that moderators can quickly reference.
  Guidelines: {{{guidelines}}}`,
});

const summarizeModerationGuidelinesFlow = ai.defineFlow<
  typeof SummarizeModerationGuidelinesInputSchema,
  typeof SummarizeModerationGuidelinesOutputSchema
>({
  name: 'summarizeModerationGuidelinesFlow',
  inputSchema: SummarizeModerationGuidelinesInputSchema,
  outputSchema: SummarizeModerationGuidelinesOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
