import { createClient } from '@supabase/supabase-js';
import { supabase } from './supabase';
import OpenAI from 'openai';

if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
  console.error('OpenAI API key is not set');
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // Enable browser usage
});

export type FileMetadata = {
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
};

export type KnowledgeBaseMetadata = FileMetadata & {
  title: string;
  type: 'company_info' | 'product_docs' | 'customer_profiles';
  content: string;
};

export type TranscriptMetadata = FileMetadata & {
  dealId: string;
  repId: string;
  stage: string;
};

async function generateEmbedding(text: string): Promise<number[] | null> {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    console.warn('OpenAI API key not set, skipping embedding generation');
    return null;
  }

  try {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float",
    });
    return embedding.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
}

export async function processKnowledgeBase(
  file: File | null,
  metadata: Omit<KnowledgeBaseMetadata, keyof FileMetadata>
): Promise<{ id: string; error?: string }> {
  try {
    console.log('Starting knowledge base processing:', { metadata, hasFile: !!file });
    let fileInfo = null;

    // 1. Upload file to Supabase Storage if provided
    if (file) {
      const fileName = `${Date.now()}-${file.name}`;
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('knowledge-base')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        console.error('Upload error details:', {
          message: uploadError.message,
          name: uploadError.name
        });
        throw uploadError;
      }

      fileInfo = {
        fileName,
        fileType: file.type,
        fileSize: file.size,
      };
    }

    // 2. Create metadata entry
    const { data: metadataEntry, error: metadataError } = await supabase
      .from('knowledge_base')
      .insert([
        {
          fileName: fileInfo?.fileName || 'no-file',
          fileType: fileInfo?.fileType || 'text/plain',
          fileSize: fileInfo?.fileSize || 0,
          uploadedBy: 'user', // TODO: Replace with actual user ID
          processingStatus: 'processing',
          ...metadata,
        },
      ])
      .select()
      .single();

    if (metadataError) throw metadataError;

    // 3. Generate embeddings if we have content
    let embedding = null;
    if (metadata.content) {
      embedding = await generateEmbedding(metadata.content);
    } else if (file) {
      const textContent = await file.text();
      embedding = await generateEmbedding(textContent);
    }

    // 4. Update metadata with embedding and status
    const { error: updateError } = await supabase
      .from('knowledge_base')
      .update({
        processingStatus: 'completed',
        embedding: embedding,
      })
      .eq('id', metadataEntry.id);

    if (updateError) {
      console.error('Error updating knowledge base status:', updateError);
    }

    return { id: metadataEntry.id };
  } catch (error) {
    console.error('Error processing knowledge base:', error);
    return { id: '', error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

export async function processTranscript(
  file: File,
  metadata: Omit<TranscriptMetadata, keyof FileMetadata>
): Promise<{ id: string; error?: string }> {
  try {
    // 1. Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: fileData, error: uploadError } = await supabase.storage
      .from('transcripts')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // 2. Create metadata entry
    const { data: metadataEntry, error: metadataError } = await supabase
      .from('transcripts')
      .insert([
        {
          fileName: fileName,
          fileType: file.type,
          fileSize: file.size,
          uploadedBy: 'user', // TODO: Replace with actual user ID
          processingStatus: 'processing',
          ...metadata,
        },
      ])
      .select()
      .single();

    if (metadataError) throw metadataError;

    // 3. Generate embeddings from file content
    const fileContent = await file.text();
    const embedding = await generateEmbedding(fileContent);

    // 4. Update metadata with embedding and status
    const { error: updateError } = await supabase
      .from('transcripts')
      .update({
        processingStatus: 'completed',
        embedding: embedding,
      })
      .eq('id', metadataEntry.id);

    if (updateError) {
      console.error('Error updating transcript status:', updateError);
    }

    return { id: metadataEntry.id };
  } catch (error) {
    console.error('Error processing transcript:', error);
    return { id: '', error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}
