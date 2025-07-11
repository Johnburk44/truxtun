"use client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { processTranscript } from "@/lib/file-processing";

const formSchema = z.object({
  dealId: z.string().min(1, "Deal ID is required"),
  repId: z.string().min(1, "Rep ID is required"),
  stage: z.string().min(1, "Stage is required"),
});

type FormData = z.infer<typeof formSchema>;

export function TranscriptUpload() {
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
    if (!selectedFile) {
      setUploadError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const result = await processTranscript(selectedFile, {
        dealId: data.dealId,
        repId: data.repId,
        stage: data.stage,
      });

      if (!result.id || result.error) {
        throw new Error(result.error || 'Failed to process file');
      }

      // Reset form
      setSelectedFile(null);
      setIsUploading(false);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Failed to upload file");
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="dealId">Deal ID</Label>
        <Input
          id="dealId"
          {...register("dealId")}
          className="mt-2"
        />
        {errors.dealId && (
          <p className="text-red-500 text-sm mt-1">{errors.dealId.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="repId">Rep ID</Label>
        <Input
          id="repId"
          {...register("repId")}
          className="mt-2"
        />
        {errors.repId && (
          <p className="text-red-500 text-sm mt-1">{errors.repId.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="stage">Stage</Label>
        <Input
          id="stage"
          {...register("stage")}
          className="mt-2"
        />
        {errors.stage && (
          <p className="text-red-500 text-sm mt-1">{errors.stage.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="file">Upload Transcript</Label>
        <FileUpload
          accept=".txt,.pdf,.doc,.docx"
          className="mt-2"
          onChange={(files) => setSelectedFile(files[0])}
        />
        {uploadError && (
          <p className="text-red-500 text-sm mt-1">{uploadError}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload Transcript"}
      </Button>
    </form>
  );
}
