import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { extract } from 'office-text-extractor'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check if it's a PowerPoint file
    if (!file.type.includes('powerpoint') && !file.type.includes('presentation')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PowerPoint files are supported.' },
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file temporarily
    const tempPath = join(process.cwd(), 'temp', file.name)
    await writeFile(tempPath, buffer)

    // Extract text from PowerPoint
    const text = await extract(tempPath)

    // Clean up temp file
    await writeFile(tempPath, '')

    return NextResponse.json({ text })
  } catch (error) {
    console.error('Error processing document:', error)
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    )
  }
}
