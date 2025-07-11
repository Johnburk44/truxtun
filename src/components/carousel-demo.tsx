// src/app/document/page.tsx
"use client";

import React, { useState } from "react";

const documents = [
  {
    id: 1,
    title: "Discovery Call Template",
    description: "Initial questions and structure for a discovery call.",
    content: "# Discovery Call Template\nHere are the sections..."
  },
  {
    id: 2,
    title: "Proposal Framework",
    description: "Outline for client-facing proposals.",
    content: "# Proposal Framework\nThis document covers..."
  },
  {
    id: 3,
    title: "Follow-up Sequence",
    description: "Steps to follow up after initial outreach.",
    content: "# Follow-up Sequence\nMake sure to..."
  }
];

export default function DocumentPreviewPage() {
  const [selectedDoc, setSelectedDoc] = useState(documents[0]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-gray-100 dark:bg-gray-900 p-6 overflow-y-auto border-r">
        <h2 className="text-xl font-bold mb-4">Templates</h2>
        <ul className="space-y-4">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className={`cursor-pointer p-3 rounded-lg border transition-colors duration-200 ${
                selectedDoc.id === doc.id
                  ? "bg-blue-100 dark:bg-blue-900 border-blue-500"
                  : "hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
              onClick={() => setSelectedDoc(doc)}
            >
              <h3 className="font-semibold">{doc.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {doc.description}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Preview Pane */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">{selectedDoc.title}</h1>
        <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
          {selectedDoc.content}
        </div>
      </div>
    </div>
  );
}
