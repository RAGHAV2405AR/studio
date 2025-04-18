'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {visualModeration} from '@/ai/flows/visual-moderation';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Icons} from '@/components/icons';

const VisualModerationPage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [result, setResult] = useState<{ isSafe: boolean; reason: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudio(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  };


  const handleAnalyzeImage = async () => {
    if (!image) {
      alert('Please select an image to analyze.');
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
      reader.readAsDataURL(image);
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

  const handleAnalyzeAudio = async () => {
    if (!audio) {
      alert('Please select an audio to analyze.');
      return;
    }

    setIsLoading(true);
    try {
      // Placeholder for audio analysis logic
      setTimeout(() => {
        setResult({
          isSafe: true,
          reason: 'Audio analysis complete. No policy violations detected.',
        });
      }, 2000); // Simulate analysis time
    } catch (error) {
      console.error('Error analyzing audio:', error);
      setResult({
        isSafe: false,
        reason: 'An error occurred while analyzing the audio.',
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Visual Moderation</h1>
      <p className="mb-4">Analyze images for violent content and policy violations.</p>

      <div className="mb-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full mb-2"
        />
        {imageUrl && (
          <Card className="w-64">
            <CardContent>
              <img src={imageUrl} alt="Image Preview" className="w-full h-auto rounded-md" />
            </CardContent>
          </Card>
        )}
        <Button onClick={handleAnalyzeImage} disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze Image'}
        </Button>
      </div>

      <div className="mb-4">
        <Input
          type="file"
          accept="audio/*"
          onChange={handleAudioChange}
          className="w-full mb-2"
        />
        {audioUrl && (
          <Card className="w-64">
            <CardContent>
              <audio src={audioUrl} controls className="w-full h-auto rounded-md" />
            </CardContent>
          </Card>
        )}
        <Button onClick={handleAnalyzeAudio} disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze Audio'}
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

    