"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function FoundationsPage() {
  const [input, setInput] = useState("");
  const [starters, setStarters] = useState<string[]>([]);
  const [newStarter, setNewStarter] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Submitted input:", input);
    console.log("Conversation Starters:", starters);
    setSubmitted(true);
  }

  function handleStarterKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && newStarter.trim() !== "") {
      e.preventDefault();
      setStarters([...starters, newStarter.trim()]);
      setNewStarter("");
    }
  }

  return (
    <div className="flex justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex justify-center">
         <div className="w-full flex justify-center items-center py-10 bg-gray-50">
  <div className="w-[100px] h-[100px] border-4 border-dashed rounded-full flex items-center justify-center text-muted-foreground">
    <span className="text-6xl">+</span>
  </div>
</div>

        </div>


        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-bold text-black">Name</Label>
            <Input id="name" placeholder="Name your GPT" className="text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-bold text-black">Description</Label>
            <Input id="description" placeholder="Add a short description about what this GPT does" className="text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions" className="text-sm font-bold text-black">Instructions</Label>
            <Textarea
              id="instructions"
              placeholder="What does this GPT do? How does it behave? What should it avoid doing?"
              className="min-h-[120px] text-muted-foreground"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
          
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="starter" className="text-sm font-bold text-black">Conversation Starters</Label>
            <Input
              id="starter"
              value={newStarter}
              placeholder="Type a starter and press Enter"
              onChange={(e) => setNewStarter(e.target.value)}
              onKeyDown={handleStarterKey}
            />
            <ul className="text-sm text-muted-foreground list-disc ml-5">
              {starters.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
  <Label htmlFor="file-upload" className="text-sm font-bold text-black">Knowledge</Label>
  <Input id="file-upload" type="file" className="cursor-pointer text-muted-foreground" />
  <p className="text-xs text-muted-foreground">
  
  </p>
  <p className="text-xs text-muted-foreground mt-1">
    Upload anything you use to sell your product or service (e.g. technical information about your product, service, your sales process, competitor intel, pricing, etc.)
  </p>
</div>


          <Button type="submit" className="px-6 py-2">Save & Send to GPT</Button>

          {submitted && (
            <p className="text-green-600 text-sm">✅ Knowledge submitted and sent to GPT.</p>
          )}
        </form>
      </div>
    </div>
  );
}
