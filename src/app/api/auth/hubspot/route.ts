import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { hubspotAuthConfig } from '@/lib/hubspot/auth';

export async function GET() {
  console.log('Raw scopes:', hubspotAuthConfig.scopes);
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.redirect(new URL('/auth/signin', process.env.NEXT_PUBLIC_APP_URL));
  }

  // Redirect to HubSpot authorization
  const authUrl = `https://app.hubspot.com/oauth/authorize?` + 
    new URLSearchParams({
      client_id: hubspotAuthConfig.clientId!,
      redirect_uri: hubspotAuthConfig.redirectUri,
      scope: hubspotAuthConfig.scopes.join(' ').replace(/,/g, ' ').trim(),
    }).toString();

  return NextResponse.redirect(authUrl);
}
