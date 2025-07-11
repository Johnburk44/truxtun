import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface DocumentPrompt {
  id: string
  template_id: string
  template_name: string
  original_document_name: string
  original_document_type: string
  analysis: string
  generated_prompt: string
  custom_prompt?: string
  created_at: string
  updated_at: string
}

export async function saveDocumentPrompt(data: Omit<DocumentPrompt, 'id' | 'created_at' | 'updated_at'>) {
  const { data: result, error } = await supabase
    .from('document_prompts')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return result
}

export async function getDocumentPrompts() {
  const { data, error } = await supabase
    .from('document_prompts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateDocumentPrompt(id: string, updates: Partial<DocumentPrompt>) {
  const { data, error } = await supabase
    .from('document_prompts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
