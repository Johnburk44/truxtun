"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TranscriptUpload } from '@/components/upload/TranscriptUpload';

export default function TranscriptPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Call Transcripts</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Transcript</CardTitle>
            <CardDescription>
              Upload call transcripts to train your GPT copilot. Supports PDF, DOC, DOCX, and TXT files.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TranscriptUpload />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
