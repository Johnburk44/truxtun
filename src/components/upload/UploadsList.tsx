import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

interface Upload {
  id: string;
  created_at: string;
  title?: string;
  dealId?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  processingStatus: string;
}

export function UploadsList() {
  const [knowledgeBaseUploads, setKnowledgeBaseUploads] = useState<Upload[]>([]);
  const [transcriptUploads, setTranscriptUploads] = useState<Upload[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUploads() {
      try {
        // Fetch knowledge base uploads
        const { data: kbData } = await supabase
          .from("knowledge_base")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        // Fetch transcript uploads
        const { data: transcriptData } = await supabase
          .from("transcripts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        if (kbData) setKnowledgeBaseUploads(kbData);
        if (transcriptData) setTranscriptUploads(transcriptData);
      } catch (error) {
        console.error("Error fetching uploads:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUploads();
  }, []);

  if (isLoading) {
    return <div>Loading recent uploads...</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Recent Uploads</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-medium mb-2">Knowledge Base</h3>
          {knowledgeBaseUploads.length > 0 ? (
            <ul className="space-y-2">
              {knowledgeBaseUploads.map((upload) => (
                <li
                  key={upload.id}
                  className="p-3 bg-white rounded-lg shadow-sm border"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{upload.title}</p>
                      <p className="text-sm text-gray-500">{upload.fileName}</p>
                    </div>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        upload.processingStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : upload.processingStatus === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {upload.processingStatus}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No knowledge base uploads yet</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Transcripts</h3>
          {transcriptUploads.length > 0 ? (
            <ul className="space-y-2">
              {transcriptUploads.map((upload) => (
                <li
                  key={upload.id}
                  className="p-3 bg-white rounded-lg shadow-sm border"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Deal: {upload.dealId}</p>
                      <p className="text-sm text-gray-500">{upload.fileName}</p>
                    </div>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        upload.processingStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : upload.processingStatus === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {upload.processingStatus}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No transcript uploads yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
