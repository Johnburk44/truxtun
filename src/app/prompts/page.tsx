"use client";
import { useState } from "react";

const PROMPT_OPTIONS = [
  { id: "map", label: "MAP - Metrics, Action, Pain" },
  { id: "qbr", label: "QBR - Quarterly Business Review" },
  { id: "recap", label: "Call Recap" },
  { id: "followup", label: "Follow-up Email" },
];

export default function PromptsPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Selected prompts:", selected);
    setSubmitted(true);
    // TODO: Trigger GPT Action per selected template
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧾 Select Document Prompts</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {PROMPT_OPTIONS.map(({ id, label }) => (
          <label key={id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(id)}
              onChange={() => toggle(id)}
              className="w-4 h-4"
            />
            {label}
          </label>
        ))}
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save & Trigger GPT
        </button>
      </form>
      {submitted && (
        <div className="mt-4 text-green-600">✅ Prompts sent to GPT for generation.</div>
      )}
    </div>
  );
}