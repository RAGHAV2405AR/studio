'use server';

/**
 * @fileOverview An AI-powered chatbot flow.
 *
 * - chat - A function that handles the chatbot conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  message: z.string().describe('The user message to respond to.'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']).describe('The role of the message sender.'),
    content: z.string().describe('The content of the message.'),
  })).optional().describe('The conversation history.'),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user message.'),
});

export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {
    schema: z.object({
      message: z.string().describe('The user message to respond to.'),
      conversationHistory: z.array(z.object({
        role: z.enum(['user', 'assistant']).describe('The role of the message sender.'),
        content: z.string().describe('The content of the message.'),
      })).optional().describe('The conversation history.'),
    }),
  },
  output: {
    schema: z.object({
      response: z.string().describe('The chatbot response to the user message.'),
    }),
  },
  prompt: `You are a helpful AI assistant. Engage in a conversation with the user, providing informative and relevant responses.

  {% if conversationHistory %}
  Here's the conversation history:
  {% for message in conversationHistory %}
  {{message.role}}: {{message.content}}
  {% endfor %}
  {% endif %}

  User: {{{message}}}
  Assistant:`,
});

const chatFlow = ai.defineFlow<typeof ChatInputSchema, typeof ChatOutputSchema>(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {response: output!.response};
  }
);
