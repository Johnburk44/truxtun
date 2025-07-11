"use client";

import React, { useState } from "react";

const mockDocuments = [
  {
    id: 1,
    title: "Company Research",
    description: "Prepare for your discovery call",
    content: "Full preview of the Company Research document goes here.",
  },
  {
    id: 2,
    title: "Call Summary",
    description: "Summarize the latest transcript",
    content: "Full preview of the Call Summary document goes here.",
  },
  {
    id: 3,
    title: "Pain Points",
    description: "Extract top 3 challenges from the transcript",
    content: "Full preview of the Pain Points document goes here.",
  },
  {
    id: 4,
    title: "MEDDICC",
    description: "Score deal using MEDDICC framework",
    content: "Full preview of the MEDDICC document goes here.",
  },
  {
    id: 5,
    title: "MAP",
    description: "Create a Mutual Action Plan (MAP)",
    content: "Full preview of the MAP document goes here.",
  },
  {
    id: 6,
    title: "Objection Handling",
    description: "Track and counter objections",
    content: "Full preview of the Objection Handling document goes here.",
  },
  {
    id: 7,
    title: "QBR Prep",
    description: "Auto-generate QBR slides or summary",
    content: "Full preview of the QBR Prep document goes here.",
  },
  {
    id: 8,
    title: "Deal Snapshot",
    description: "Create a one-pager of deal status",
    content: "Full preview of the Deal Snapshot document goes here.",
  },
  {
    id: 9,
    title: "Custom",
    description: "Create your own",
    content: "",
    type: "upload", // ← triggers upload UI
  },
];

export default function DocumentPage() {
  const [selectedId, setSelectedId] = useState<number>(mockDocuments[0].id);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const selectedDoc = mockDocuments.find((doc) => doc.id === selectedId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      // Add your backend handling logic here
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar list */}
      <aside className="w-55 border-r bg-muted p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Prompt Library</h2>
        <ul className="space-y-3">
          {mockDocuments.map((doc) => (
            <li
              key={doc.id}
              onClick={() => setSelectedId(doc.id)}
              className={`cursor-pointer rounded p-3 transition border hover:bg-gray-100 dark:hover:bg-gray-800 ${
                doc.id === selectedId
                  ? "bg-gray-100 dark:bg-gray-800 border-primary"
                  : "bg-white dark:bg-black"
              }`}
            >
              <h3 className="font-bold text-sm">{doc.title}</h3>
              <p className="text-muted-foreground text-xs">{doc.description}</p>
            </li>
          ))}
        </ul>
      </aside>

      {/* Preview pane */}
      <section className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">{selectedDoc?.title}</h2>
        <p className="text-muted-foreground mb-6">{selectedDoc?.description}</p>

        {/* Upload UI for custom doc */}
        {selectedDoc?.type === "upload" ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-gray-400 p-12 rounded-lg bg-white dark:bg-black">
            <p className="mb-4 text-gray-600 dark:text-gray-300 text-sm">
              Upload a PPT file to turn it into a custom prompt.
            </p>
            <input
              type="file"
              accept=".ppt,.pptx"
              onChange={handleFileChange}
              className="mb-2 text-sm"
            />
            {uploadedFileName && (
              <p className="text-xs text-green-600 mt-2">
                Uploaded: {uploadedFileName}
              </p>
            )}
          </div>
        ) : (
          <div className="whitespace-pre-wrap leading-relaxed text-sm text-gray-800 dark:text-gray-200">
            {selectedDoc?.content}
          </div>
        )}
      </section>
    </div>
  );
}
