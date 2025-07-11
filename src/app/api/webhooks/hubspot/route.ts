import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

interface HubspotEvent {
  subscriptionType: string
  objectType: string
  eventId?: string
  occurredAt?: string
  propertyName?: string
  propertyValue?: any
  objectId?: number
  [key: string]: any
}

async function handleContactChange(data: HubspotEvent) {
  console.log('Processing contact change:', {
    contactId: data.objectId,
    property: data.propertyName,
    value: data.propertyValue
  })
  
  // Here you would typically:
  // 1. Fetch full contact details from Hubspot API
  // 2. Update your local database
  // 3. Trigger any necessary automations
}

async function handleDealChange(data: HubspotEvent) {
  console.log('Processing deal change:', {
    dealId: data.objectId,
    property: data.propertyName,
    value: data.propertyValue
  })
  
  // Here you would typically:
  // 1. Fetch full deal details from Hubspot API
  // 2. Update your local database
  // 3. Update any related analytics
}

async function handleContactCreation(data: HubspotEvent) {
  console.log('Processing new contact:', {
    contactId: data.objectId
  })
  
  // Here you would typically:
  // 1. Fetch full contact details from Hubspot API
  // 2. Create record in your local database
  // 3. Trigger any welcome automations
}

async function handleDealCreation(data: HubspotEvent) {
  console.log('Processing new deal:', {
    dealId: data.objectId
  })
  
  // Here you would typically:
  // 1. Fetch full deal details from Hubspot API
  // 2. Create record in your local database
  // 3. Trigger any sales process automations
}

// Verify Hubspot webhook signature
function verifyWebhook(body: string, signature: string, clientSecret: string) {
  const sourceString = body + clientSecret
  const hash = crypto
    .createHash('sha256')
    .update(sourceString)
    .digest('hex')
  return hash === signature
}

export async function POST(req: Request) {
  console.log('Received Hubspot webhook')
  
  try {
    const headersList = headers()
    const signature = headersList.get('X-HubSpot-Signature')
    const body = await req.text()
    const data = JSON.parse(body)
    
    // Log the webhook payload for testing
    console.log('Webhook payload:', body)
    console.log('Headers:', Object.fromEntries(headersList.entries()))

    // In production, verify the webhook
    // if (!signature || !verifyWebhook(body, signature, process.env.HUBSPOT_CLIENT_SECRET!)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    // }

    // Store the webhook event
    const webhook = await prisma.hubspotWebhook.create({
      data: {
        eventType: data.subscriptionType,
        objectType: data.objectType,
        eventId: data.eventId,
        occurredAt: new Date(data.occurredAt || Date.now()),
        payload: data
      }
    })

    // Process the webhook based on type
    try {
      switch (data.subscriptionType) {
        case 'contact.propertyChange':
          await handleContactChange(data)
          break
        case 'deal.propertyChange':
          await handleDealChange(data)
          break
        case 'contact.creation':
          await handleContactCreation(data)
          break
        case 'deal.creation':
          await handleDealCreation(data)
          break
        default:
          console.log('Unknown subscription type:', data.subscriptionType)
      }

      // Mark as processed
      await prisma.hubspotWebhook.update({
        where: { id: webhook.id },
        data: { processed: true }
      })

    } catch (error) {
      // Store processing error
      await prisma.hubspotWebhook.update({
        where: { id: webhook.id },
        data: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          processed: true
        }
      })
      throw error
    }

    return NextResponse.json({ success: true, webhookId: webhook.id })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
