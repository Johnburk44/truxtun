import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { apiKey, portalId } = await req.json()

    // Test the Hubspot connection
    const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to connect to Hubspot' },
        { status: 400 }
      )
    }

    // Store the credentials securely (you should encrypt these)
    // This is just for demo purposes
    const credentials = {
      apiKey,
      portalId,
      verified: true,
      verifiedAt: new Date().toISOString()
    }

    return NextResponse.json(credentials)
  } catch (error) {
    console.error('Hubspot connection test failed:', error)
    return NextResponse.json(
      { error: 'Failed to test Hubspot connection' },
      { status: 500 }
    )
  }
}
