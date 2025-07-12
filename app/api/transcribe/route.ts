import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk'; // v3 import
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';

export async function POST(req: NextRequest) {
  const { crmContext, upsertSample = false } = await req.json();

  try {
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

    if (upsertSample) {
      await upsertSampleData();
    }

    const live = deepgram.listen.live({
      model: 'nova-2',
      language: 'en',
      smart_format: true,
      interim_results: true,
      utterances: true,
    });

    live.on('open', () => console.log('Deepgram connection open'));

    live.on('transcriptReceived', async (data) => {
      const transcript = data.channel?.alternatives?.[0]?.transcript;
      if (transcript) {
        const enriched = await enrichWithRAG(transcript, crmContext);
        console.log(`Transcript: ${transcript}`); // Log for testing
        console.log(`Enriched: ${enriched}`); // Replace emit with log for now
      }
    });

    live.on('close', () => console.log('Deepgram connection closed'));
    live.on('error', (error) => console.error('Deepgram error:', error));

    return NextResponse.json({ message: 'Transcription ready - send audio via WebSocket' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// enrichWithRAG and upsertSampleData functions remain unchanged from previous version
async function enrichWithRAG(transcript: string, crmContext: any) {
  // ... (same as before)
}

async function upsertSampleData() {
  // ... (same as before)
}