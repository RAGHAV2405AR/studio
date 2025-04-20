'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {visualModeration} from '@/ai/flows/visual-moderation';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Icons} from '@/components/icons';

const VisualModerationPage = () => {
  const [media, setMedia] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [result, setResult<{ isSafe: boolean; reason: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      setMediaUrl(URL.createObjectURL(file));
    }
  };

  const handleAnalyzeImage = async () => {
    if (!media) {
      alert('Please select an image or video to analyze.');
      return;
    }

    setIsLoading(true);
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const moderationResult = await visualModeration({image: base64String});
        setResult(moderationResult);
      };
      reader.readAsDataURL(media);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setResult({
        isSafe: false,
        reason: 'An error occurred while analyzing the image.',
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Visual Analysis</h1>
      <p className="mb-4">Analyze images and videos for violent content and policy violations.</p>

      <div className="mb-4">
        <Input
          type="file"
          accept="image/*, video/*"
          onChange={handleMediaChange}
          className="w-full mb-2"
        />
        {mediaUrl && (
          <Card className="w-64">
            <CardContent>
              {media?.type.startsWith('image') ? (
                <img src={mediaUrl} alt="Media Preview" className="w-full h-auto rounded-md" />
              ) : (
                <video src={mediaUrl} controls className="w-full h-auto rounded-md" />
              )}
            </CardContent>
          </Card>
        )}
        <Button onClick={handleAnalyzeImage} disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze Media'}
        </Button>
      </div>

      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">Analysis Result:</h2>
          <p>
            <strong>Safe Content:</strong> {result.isSafe ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Reason:</strong> {result.reason}
          </p>
        </div>
      )}
    </div>
  );
};

export default VisualModerationPage;
