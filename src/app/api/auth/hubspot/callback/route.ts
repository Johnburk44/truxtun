import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { exchangeCodeForTokens, updateOrganizationHubspotTokens } from '@/lib/hubspot/auth';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.redirect(new URL('/auth/signin', process.env.NEXT_PUBLIC_APP_URL));
  }

  try {
    console.log('Starting HubSpot callback processing...');
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    console.log('Received code:', code);
    
    if (!code) {
      throw new Error('No authorization code received');
    }

    // Exchange the code for tokens
    const tokens = await exchangeCodeForTokens(code);
    
    // Save tokens to organization
    await updateOrganizationHubspotTokens(session.user.organizationId!, tokens);

    // Redirect back to pipeline page
    return NextResponse.redirect(new URL('/CRM/pipeline', process.env.NEXT_PUBLIC_APP_URL));
  } catch (error) {
    console.error('HubSpot OAuth error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return NextResponse.redirect(new URL('/settings/organization?error=hubspot_auth_failed', process.env.NEXT_PUBLIC_APP_URL));
  }
}
