# Truxtun - AI Sales Assistant

Truxtun is an AI-powered sales assistant that helps streamline customer interactions and boost sales performance through intelligent conversation analysis and real-time guidance.

## Features

- Real-time transcription of sales calls using Deepgram
- AI-powered conversation analysis with OpenAI
- Vector search for relevant sales materials via Pinecone
- Real-time sales guidance and suggestions
- Integration with popular CRM platforms (coming soon)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```env
DEEPGRAM_API_KEY=your_key
OPENAI_API_KEY=your_key
PINECONE_API_KEY=your_key
```

3. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the dashboard.

## Tech Stack

- Next.js 15.3 for the frontend and API routes
- Deepgram for real-time speech-to-text
- OpenAI for conversation analysis
- Pinecone for vector search
- Socket.IO for real-time updates
- Zod for input validation
