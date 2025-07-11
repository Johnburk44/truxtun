import * as pdfjsLib from 'pdfjs-dist'
import * as Tesseract from 'tesseract.js'

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ')
    fullText += pageText + '\n'
  }

  return fullText
}

export async function extractTextFromImage(file: File): Promise<string> {
  const worker = await Tesseract.createWorker('eng')
  const imageUrl = URL.createObjectURL(file)
  const { data: { text } } = await worker.recognize(imageUrl)
  await worker.terminate()
  URL.revokeObjectURL(imageUrl)
  return text
}

async function extractTextFromPowerPoint(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/documents/process', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to process PowerPoint file')
  }

  const { text } = await response.json()
  return text
}

export async function processDocument(file: File): Promise<string> {
  const fileType = file.type.toLowerCase()

  try {
    if (fileType.includes('pdf')) {
      return await extractTextFromPDF(file)
    } else if (fileType.includes('image')) {
      return await extractTextFromImage(file)
    } else if (fileType.includes('powerpoint') || fileType.includes('presentation')) {
      return await extractTextFromPowerPoint(file)
    } else {
      // For other text-based files, try to read as text
      return await file.text()
    }
  } catch (error) {
    console.error('Error processing document:', error)
    throw new Error(`Failed to process ${file.name}. Please try a different file format.`)
  }
}
