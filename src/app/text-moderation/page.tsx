'use client';

import {moderateText} from '@/ai/flows/moderate-text';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

const TextModerationPage = () => {
  const [text, setText] = useState('');
  const [result, setResult<{ isHateSpeech: boolean; reason: string } | null>] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAnalyzeText = async () => {
    setIsLoading(true);
    try {
      const moderationResult = await moderateText({text});
      setResult(moderationResult);
    } catch (error) {
      console.error('Error analyzing text:', error);
      setResult({
        isHateSpeech: true,
        reason: 'An error occurred while analyzing the text.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Text Analysis</h1>
      <p className="mb-4">
        Analyze text content for hate speech and harmful elements. It is important to moderate text to prevent the spread of hate speech, bullying, and other forms of online abuse, fostering a safer online environment.
      </p>

      <div className="mb-4">
        <Textarea
          placeholder="Enter text to analyze"
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full mb-2"
        />
        <Button onClick={handleAnalyzeText} disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze Text'}
        </Button>
      </div>

      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">Analysis Result:</h2>
          <p>
            <strong>Hate Speech Detected:</strong> {result.isHateSpeech ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Reason:</strong> {result.reason}
          </p>
        </div>
      )}
    </div>
  );
};

export default TextModerationPage;
