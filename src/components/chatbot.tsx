'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent} from '@/components/ui/card';
import {chat} from '@/ai/flows/chatbot-flow';
import Link from 'next/link';

const Chatbot = () => {
  const [messages, setMessages] = useState<
    {text: string; isUser: boolean}[]
  >([]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = async () => {
    if (inputText.trim() !== '') {
      const userMessage = {text: inputText, isUser: true};
      setMessages([...messages, userMessage]);

      // Basic intent detection for harmful content inquiries
      let aiResponse;
      if (inputText.toLowerCase().includes('harmful') || inputText.toLowerCase().includes('hate') || inputText.toLowerCase().includes('deepfake') || inputText.toLowerCase().includes('violent')) {
        const suggestion = 'It seems you\'re asking about harmful content. For specific content moderation, please navigate to the appropriate section:';
        aiResponse = {response: suggestion};
      } else {
        try {
          aiResponse = await chat({
            message: inputText,
            conversationHistory: messages.map(msg => ({
              role: msg.isUser ? 'user' : 'assistant',
              content: msg.text,
            })),
          });
        } catch (error) {
          console.error('Error getting AI response:', error);
          aiResponse = {response: 'Sorry, I encountered an error. Please try again.'};
        }
      }

      setMessages(currentMessages => [
        ...currentMessages,
        {text: aiResponse.response, isUser: false},
      ]);

      setInputText('');
    }
  };

  return (
    <Card className="w-full mt-4">
      <CardContent className="flex flex-col space-y-4">
        <h2 className="text-lg font-bold">Chatbot</h2>
        <div className="flex flex-col space-y-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded-md ${
                message.isUser ? 'bg-secondary text-secondary-foreground self-end' : 'bg-muted text-muted-foreground self-start'
              }`}
            >
              {message.text}
            </div>
          ))}
          {messages.length > 0 && messages[messages.length - 1].text.includes('navigate to the appropriate section:') && (
            <div className="flex flex-col items-start">
              <Link href="/text-moderation" className="text-blue-500 hover:underline">Text Moderation</Link>
              <Link href="/audio-moderation" className="text-blue-500 hover:underline">Audio Moderation</Link>
              <Link href="/visual-moderation" className="text-blue-500 hover:underline">Visual Moderation</Link>
              <Link href="/deepfake-detection" className="text-blue-500 hover:underline">Deepfake Detection</Link>
              <Link href="/url-moderation" className="text-blue-500 hover:underline">URL Moderation</Link>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Textarea
            placeholder="Enter your message"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;
