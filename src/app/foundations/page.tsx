"use client";
import { useState } from "react";

export default function FoundationsPage() {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Submitted foundational input:", input);
    setSubmitted(true);
    // TODO: call backend API or GPT Action here
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧠 Foundational Knowledge</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          className="w-full h-40 p-3 border rounded resize-none"
          placeholder="Paste company background, process docs, etc."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save & Send to GPT
        </button>
      </form>
      {submitted && (
        <div className="mt-4 text-green-600">✅ Knowledge submitted and sent to GPT.</div>
      )}
    </div>
  );
}
