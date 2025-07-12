'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// Metadata moved to a separate layout.tsx since this is now a client component

export default function DashboardPage() {
  const [transcript, setTranscript] = useState<string>('');
  const [enriched, setEnriched] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTranscriptionReady, setIsTranscriptionReady] = useState(false);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    console.log('Setting up WebSocket connection...');
    const socket = io('http://localhost:3001', {
      transports: ['polling', 'websocket']
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socket.on('ready', (data) => {
      console.log('Transcription ready:', data);
      setIsTranscriptionReady(true);
      setError('');
      
      // Start recording only after transcription is ready
      if (recorderRef.current && !recorderRef.current.state.includes('recording')) {
        console.log('Starting recorder now that transcription is ready');
        recorderRef.current.start(1000);
        setIsRecording(true);
      }
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError('Connection error: ' + error.message);
      setIsConnected(false);
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('Attempting to reconnect:', attemptNumber);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
      setError('');
    });

    socket.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error);
      setError('Reconnection error: ' + error.message);
    });

    socket.on('reconnect_failed', () => {
      console.error('Failed to reconnect');
      setError('Failed to reconnect after multiple attempts');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setIsConnected(false);
    });

    socket.on('transcript', (data: { transcript: string; enriched: string }) => {
      console.log('Received transcript:', data);
      setTranscript((prev) => prev + ' ' + data.transcript); // Append to keep history
      setEnriched(data.enriched);
    });

    socket.on('error', (error: { message: string }) => {
      console.log('Socket error from backend:', error);
      setError(error.message);
    });

    return () => {
      // Stop recording if active
      if (recorderRef.current && isRecording) {
        recorderRef.current.stop();
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      }

      // Clean up all socket event listeners
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('reconnect_attempt');
      socket.off('reconnect');
      socket.off('reconnect_error');
      socket.off('reconnect_failed');
      socket.off('transcript');
      socket.off('error');

      // Force disconnect and cleanup
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const stopCall = useCallback(() => {
    console.log('Stopping call...', { hasRecorder: !!recorderRef.current, hasSocket: !!socketRef.current, isTranscriptionReady });
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      console.log('Stopping recorder...');
      recorderRef.current.stop();
      const tracks = recorderRef.current.stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    if (socketRef.current) {
      socketRef.current.emit('stopTranscription');
    }
    setIsTranscriptionReady(false);
    setIsRecording(false);
  }, [isTranscriptionReady]);

  const startCall = useCallback(async () => {
    console.log('Starting call...', { isConnected, hasSocket: !!socketRef.current });
    if (!socketRef.current || !isConnected) {
      setError('Socket not connected - please wait or refresh');
      return;
    }

    // Clean up any existing recording
    if (isRecording) {
      stopCall();
    }

    setError('');
    setTranscript('');
    setEnriched('');
    setIsTranscriptionReady(false);

    try {
      console.log('Requesting mic access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      console.log('Mic access granted, setting up recorder...');

      recorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
        audioBitsPerSecond: 128000
      });

      // Set up data handling first
      recorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0 && isTranscriptionReady) {
          console.log('Got audio chunk of size:', event.data.size);
          const reader = new FileReader();
          reader.onloadend = () => {
            const arrayBuffer = reader.result;
            if (arrayBuffer instanceof ArrayBuffer && socketRef.current) {
              console.log('Sending ArrayBuffer chunk - size:', arrayBuffer.byteLength);
              socketRef.current.emit('audioChunk', arrayBuffer);
            }
          };
          reader.readAsArrayBuffer(event.data);
        } else if (!isTranscriptionReady) {
          console.log('Skipping audio chunk - transcription not ready');
        }
      };

      recorderRef.current.onerror = (err: Event) => {
        console.error('Recorder error:', err);
        setError('Recording error');
      };

      recorderRef.current.onstop = () => {
        console.log('Recorder stopped');
        setIsRecording(false);
      };

      // Emit startTranscription and wait for ready event
      console.log('Requesting transcription start...');
      socketRef.current?.emit('startTranscription', {
        crmContext: { dealStage: 'Discovery' }
      });
    } catch (err) {
      console.error('Start call error:', err);
      setError('Error accessing microphone or starting recorder: ' + (err as Error).message);
      stopCall();
    }
  }, [isConnected, stopCall, isRecording]);

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Truxtun, your AI sales assistant
          </p>
          <div className="text-sm">
            Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}
          <div className="flex gap-4 mt-4">
            <button
              onClick={startCall}
              disabled={!isConnected || isRecording}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isRecording ? 'Recording...' : 'Start Call'}
            </button>
            <button
              onClick={stopCall}
              disabled={!isRecording}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Stop Call
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-semibold mb-2">Live Transcript</h2>
            <p className="whitespace-pre-wrap">{transcript || 'Waiting for audio...'}</p>
          </div>

          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-semibold mb-2">AI Insights</h2>
            <p className="whitespace-pre-wrap">{enriched || 'No insights yet...'}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
