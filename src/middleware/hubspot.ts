import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/db';
import { refreshHubspotTokens } from '@/lib/hubspot/auth';

export async function withHubspot(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.sub) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user's organization's HubSpot config
    const user = await prisma.user.findUnique({
      where: { id: token.sub },
      select: {
        organizationId: true,
      },
    });

    if (!user?.organizationId) {
      return new NextResponse('User not associated with an organization', { status: 403 });
    }

    const hubspotConfig = await prisma.HubspotConfig.findUnique({
      where: { organizationId: user.organizationId },
    });

    if (!hubspotConfig) {
      return new NextResponse('HubSpot not connected', { status: 403 });
    }

    // Check if token needs refresh
    if (hubspotConfig.authType === 'oauth' && 
        hubspotConfig.tokenExpiry && 
        new Date() > new Date(hubspotConfig.tokenExpiry)) {
      // Token expired, refresh it
      try {
        const tokens = await refreshHubspotTokens(hubspotConfig.refreshToken!);
        await prisma.HubspotConfig.update({
          where: { id: hubspotConfig.id },
          data: {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            tokenExpiry: new Date(Date.now() + tokens.expires_in * 1000),
          },
        });
      } catch (error) {
        console.error('Failed to refresh HubSpot token:', error);
        return new NextResponse('HubSpot token refresh failed', { status: 401 });
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('HubSpot middleware error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
