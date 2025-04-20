'use client';

import {moderateURL} from '@/ai/flows/moderate-url';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useState} from 'react';

const URLModerationPage = () => {
  const [url, setURL] = useState('');
  const [result, setResult<{ isHarmful: boolean; reason: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyzeURL = async () => {
    setIsLoading(true);
    try {
      const moderationResult = await moderateURL({url});
      setResult(moderationResult);
    } catch (error) {
      console.error('Error analyzing URL:', error);
      setResult({
        isHarmful: true,
        reason: 'An error occurred while analyzing the URL.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">URL Analysis</h1>
      <p className="mb-4">Analyze URLs for harmful content and policy violations.</p>

      <div className="mb-4">
        <Input
          type="url"
          placeholder="Enter URL to analyze"
          value={url}
          onChange={e => setURL(e.target.value)}
          className="w-full mb-2"
        />
        <Button onClick={handleAnalyzeURL} disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze URL'}
        </Button>
      </div>

      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">Analysis Result:</h2>
          <p>
            <strong>Harmful Content Detected:</strong> {result.isHarmful ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Reason:</strong> {result.reason}
          </p>
        </div>
      )}
    </div>
  );
};

export default URLModerationPage;

    
