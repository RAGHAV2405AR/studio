'use client';

import {Button} from '@/components/ui/button';
import {useState, useRef, useEffect} from 'react';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Input} from '@/components/ui/input';
import {Card, CardContent} from '@/components/ui/card';
import {moderateAudio} from '@/ai/flows/moderate-audio';

const AudioModerationPage = () => {
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ isHarmful: boolean; reason: string } | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);

  useEffect(() => {
    const getMicrophonePermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        setHasMicrophonePermission(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setHasMicrophonePermission(false);
      }
    };

    getMicrophonePermission();
  }, []);

  const startRecording = async () => {
    if (!hasMicrophonePermission) {
      alert('Please enable microphone permissions in your browser settings to use this app.');
      return;
    }

    audioChunks.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = event => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, {type: 'audio/webm'});
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      setAudioFile(new File([audioBlob], 'recording.webm', {type: 'audio/webm'}));
    };

    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioURL(URL.createObjectURL(file));
    }
  };

  const analyzeAudio = async () => {
    if (!audioFile) {
      alert('Please record or upload audio first.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const moderationResult = await moderateAudio({audio: base64String});
        setAnalysisResult(moderationResult);
      };
      reader.readAsDataURL(audioFile);
    } catch (error) {
      console.error('Error analyzing audio:', error);
      setAnalysisResult({ isHarmful: true, reason: 'An error occurred while analyzing the audio.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
       <Card className="w-full">
        <CardContent className="flex flex-col space-y-4">
        <div className="flex items-center justify-between ml-4">
      <h1 className="text-2xl font-bold mb-4">Audio Analysis</h1>
      <p className="mb-4">
        Analyze audio files for harmful speech and aggressive tones. It is important to moderate audio to detect and prevent the spread of harmful content such as hate speech, threats, and harassment, promoting a more inclusive and respectful communication environment.
      </p>
      </div>

      { !(hasMicrophonePermission) && (
        <Alert variant="destructive">
          <AlertTitle>Microphone Access Required</AlertTitle>
          <AlertDescription>
            Please allow microphone access to use this feature.
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-4 flex gap-2">
        <Button onClick={startRecording} disabled={isRecording || isAnalyzing}>
          {isRecording ? 'Recording...' : 'Start Recording'}
        </Button>
        <Button onClick={stopRecording} disabled={!isRecording || isAnalyzing}>
          Stop Recording
        </Button>
        <Input
          type="file"
          accept="audio/*"
          onChange={handleAudioUpload}
          className="w-full mb-2"
        />
        <Button onClick={analyzeAudio} disabled={!audioURL || isAnalyzing}>
          {isAnalyzing ? 'Analyzing...' : 'Analyze Audio'}
        </Button>
      </div>

      {audioURL && (
        <div className="mb-4">
          <audio src={audioURL} controls className="w-full"></audio>
        </div>
      )}

      {analysisResult && (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">Analysis Result:</h2>
          <p>
            <strong>Harmful Content:</strong> {analysisResult.isHarmful ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Reason:</strong> {analysisResult.reason}
          </p>
        </div>
      )}
      </CardContent>
        </Card>
    </div>
  );
};

export default AudioModerationPage;
