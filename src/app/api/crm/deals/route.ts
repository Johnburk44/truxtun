import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/db';
import { HubspotClient } from '@/lib/hubspot/client';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get the HubSpot config for the user's organization
    const hubspotConfig = await prisma.HubspotConfig.findUnique({
      where: { organizationId: session.user.organizationId },
    });

    if (!hubspotConfig) {
      return NextResponse.json(
        { error: 'HubSpot not connected' },
        { status: 403 }
      );
    }

    if (hubspotConfig.tokenExpiry && new Date() > hubspotConfig.tokenExpiry) {
      return NextResponse.json(
        { error: 'HubSpot token expired' },
        { status: 401 }
      );
    }

    // Create HubSpot client and fetch deals
    const hubspotClient = new HubspotClient({
      accessToken: hubspotConfig.accessToken,
    });

    const deals = await hubspotClient.getDeals();
    return NextResponse.json({ results: deals });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}
