import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development, use server-side calls in production
})

export async function analyzeDocument(content: string, analysisPrompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert document analyzer. Your task is to analyze documents and extract structured information according to given templates."
        },
        {
          role: "user",
          content: `${analysisPrompt}\n\nDocument content:\n${content}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    })

    return response.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Error calling OpenAI:', error)
    throw new Error('Failed to analyze document')
  }
}

export async function generatePromptTemplate(analysis: string, template: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert at creating structured prompts for document generation. Your task is to take an analysis of an existing document and create a prompt template that can be used to generate similar documents."
        },
        {
          role: "user",
          content: `Based on this analysis:\n\n${analysis}\n\nAnd this template structure:\n\n${template}\n\nCreate a detailed prompt template that can be used to generate similar documents.`
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })

    return response.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Error calling OpenAI:', error)
    throw new Error('Failed to generate prompt template')
  }
}
