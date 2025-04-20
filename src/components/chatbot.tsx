'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent} from '@/components/ui/card';

const Chatbot = () => {
  const [messages, setMessages] = useState<
    {text: string; isUser: boolean}[]
  >([]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim() !== '') {
      setMessages([...messages, {text: inputText, isUser: true}]);
      // Here you would typically send the inputText to an AI and get a response
      // For now, let's simulate an AI response
      setTimeout(() => {
        setMessages(currentMessages => [
          ...currentMessages,
          {text: 'This is a dummy response from the AI.', isUser: false},
        ]);
      }, 500);
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
