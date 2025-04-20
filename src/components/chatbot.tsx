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

      // Enhanced intent detection for harmful content inquiries, providing specific links
      let aiResponse;
      const inputTextLower = inputText.toLowerCase();
      if (inputTextLower.includes('harmful') || inputTextLower.includes('hate') || inputTextLower.includes('deepfake') || inputTextLower.includes('violent')) {
        let suggestion = 'It seems you\'re asking about potentially harmful content. Here are some relevant analysis tools:\n';
        if (inputTextLower.includes('text')) {
          suggestion += `- <Link href="/text-moderation" className="text-blue-500 hover:underline">Text Analysis</Link>\n`;
        }
        if (inputTextLower.includes('audio')) {
          suggestion += `- <Link href="/audio-moderation" className="text-blue-500 hover:underline">Audio Analysis</Link>\n`;
        }
        if (inputTextLower.includes('visual') || inputTextLower.includes('image') || inputTextLower.includes('video')) {
          suggestion += `- <Link href="/visual-moderation" className="text-blue-500 hover:underline">Visual Analysis</Link>\n`;
        }
        if (inputTextLower.includes('deepfake')) {
          suggestion += `- <Link href="/deepfake-detection" className="text-blue-500 hover:underline">Deepfake Detection</Link>\n`;
        }
        if (inputTextLower.includes('url')) {
          suggestion += `- <Link href="/url-moderation" className="text-blue-500 hover:underline">URL Analysis</Link>\n`;
        }
        suggestion += 'For more specific content analysis, please use the provided links.';
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
          {messages.length > 0 && messages[messages.length - 1].text.includes('relevant analysis tools:') && (
            <div className="flex flex-col items-start">
              {/* Render links based on the chatbot's response */}
              {messages[messages.length - 1].text.split('\n').map((line, index) => {
                if (line.startsWith('-')) {
                  // Extract the URL and link text
                  const parts = line.substring(2).split('>');
                  const url = parts[0].trim();
                  const linkText = parts[1].substring(0, parts[1].length - 3); // Remove '</a'
                  return (
                    <Link key={index} href={url} className="text-blue-500 hover:underline">
                      {linkText}
                    </Link>
                  );
                }
                return null;
              })}
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
