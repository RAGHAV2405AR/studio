'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Icons} from '@/components/icons';
import {detectDeepfake} from '../../ai/flows/deepfake-detection';

const DeepfakeDetectionPage = () => {
  const [media, setMedia] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      setMediaUrl(URL.createObjectURL(file));
    }
  };

  const handleAnalyzeMedia = async () => {
    if (!mediaUrl) {
      alert('Please select an image or video to analyze.');
      return;
    }

    setIsLoading(true);
    try {
      const deepfakeResult = await detectDeepfake({mediaUrl: mediaUrl});
      setResult(
        `Deepfake analysis complete.\nDeepfake Detected: ${deepfakeResult.isDeepfake ? 'Yes' : 'No'}\nConfidence: ${deepfakeResult.confidence}\nReason: ${deepfakeResult.reason}`
      );
    } catch (error) {
      console.error('Error analyzing media:', error);
      setResult('An error occurred while analyzing the media.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Deepfake Detection</h1>
      <p className="mb-4">Analyze images and videos for deepfakes and manipulated media.</p>

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
        <Button onClick={handleAnalyzeMedia} disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze Media'}
        </Button>
      </div>

      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">Analysis Result:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default DeepfakeDetectionPage;
