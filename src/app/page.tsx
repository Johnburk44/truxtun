export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6 py-12">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to Truxtun</h1>
      <p className="text-lg text-gray-700">Let’s build your SaaS copilot MVP with Tailwind + GPT.</p>

      <div className="mt-8 flex gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Upload Transcript
        </button>
        <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50">
          Generate MAP
        </button>
      </div>
    </main>
  );
}
