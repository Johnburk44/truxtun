"use client"

import * as React from "react"
import { IconFile, IconFileCheck, IconLoader2 } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface DocumentProcessorProps {
  file: File
  onProcessed: (instructions: string) => void
}

export function DocumentProcessor({ file, onProcessed }: DocumentProcessorProps) {
  const [status, setStatus] = React.useState<"uploading" | "processing" | "done" | "error">("uploading")
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const processDocument = async () => {
      try {
        // Simulate file upload progress
        for (let i = 0; i <= 100; i += 10) {
          setProgress(i)
          await new Promise(resolve => setTimeout(resolve, 200))
        }
        setStatus("processing")

        // TODO: Implement actual document processing logic here
        // This would involve:
        // 1. Reading the file contents
        // 2. Using OCR for images if needed
        // 3. Extracting text content
        // 4. Processing the content into GPT instructions

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        const mockInstructions = `Instructions extracted from ${file.name}:\n\n` +
          "1. Understand user queries related to the uploaded content\n" +
          "2. Provide relevant information from the document\n" +
          "3. Maintain context and document structure in responses"

        setStatus("done")
        onProcessed(mockInstructions)
      } catch (error) {
        console.error("Error processing document:", error)
        setStatus("error")
      }
    }

    processDocument()
  }, [file, onProcessed])

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        {status === "uploading" && <IconLoader2 className="h-5 w-5 animate-spin" />}
        {status === "processing" && <IconFile className="h-5 w-5" />}
        {status === "done" && <IconFileCheck className="h-5 w-5 text-green-500" />}
        <div className="flex-1">
          <div className="text-sm font-medium">{file.name}</div>
          <div className="text-xs text-muted-foreground">
            {status === "uploading" && "Uploading..."}
            {status === "processing" && "Processing document..."}
            {status === "done" && "Processing complete"}
            {status === "error" && "Error processing document"}
          </div>
        </div>
      </div>

      {status === "uploading" && (
        <Progress value={progress} className="h-2" />
      )}

      {status === "error" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      )}
    </div>
  )
}
