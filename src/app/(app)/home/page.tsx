"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KnowledgeBaseUpload } from "@/components/upload/KnowledgeBaseUpload";

export default function HomePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Knowledge Base</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Knowledge Base</CardTitle>
            <CardDescription>
              Upload documents to train your GPT copilot. Supports PDF, DOC, DOCX, and TXT files.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KnowledgeBaseUpload />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
