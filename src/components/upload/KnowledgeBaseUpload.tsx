"use client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { processKnowledgeBase } from "@/lib/file-processing";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["company_info", "product_docs", "customer_profiles"], {
    required_error: "Type is required",
  }),
  content: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function KnowledgeBaseUpload() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onSubmit = async (data: FormData) => {
    console.log('Starting upload with data:', { formData: data, selectedFile });
    if (!selectedFile && !data.content) {
      setUploadError("Please either select a file to upload or provide content");
      return;
    }

    setIsUploading(true);
    try {
      console.log('Starting upload...', {
        file: selectedFile,
        title: data.title,
        type: data.type
      });
      
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Missing Supabase credentials');
      }

      const result = await processKnowledgeBase(selectedFile, {
        title: data.title,
        type: data.type,
        content: data.content || '',
      });
      
      console.log('Upload result:', result);
      if (!result.id || result.error) {
        throw new Error(result.error || 'Failed to process file');
      }
    } catch (error) {
      console.error('Error processing knowledge base:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        setUploadError(error.message);
      } else {
        setUploadError("Failed to upload file");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register("title")}
          className="mt-2"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          {...register("type")}
          className="mt-2 w-full rounded-md border p-2"
        >
          <option value="company_info">Company Information</option>
          <option value="product_docs">Product Documentation</option>
          <option value="customer_profiles">Customer Profiles</option>
        </select>
        {errors.type && (
          <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          {...register("content")}
          className="mt-2"
          rows={4}
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="file">Upload File (optional)</Label>
        <FileUpload
          id="file"
          accept=".pdf,.doc,.docx,.txt"
          className="mt-2"
          onChange={(files) => setSelectedFile(files[0])}
        />
        {uploadError && (
          <p className="text-red-500 text-sm mt-1">{uploadError}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload Knowledge Base"}
      </Button>
    </form>
  );
}
