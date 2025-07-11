import { prisma } from '../db';

export interface HubspotTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export const hubspotAuthConfig = {
  clientId: process.env.HUBSPOT_CLIENT_ID,
  clientSecret: process.env.HUBSPOT_CLIENT_SECRET,
  scopes: (process.env.HUBSPOT_SCOPES || 'contacts deals pipeline')
    .split(/[,\s]+/)
    .filter(Boolean),
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/hubspot/callback`
};

export async function exchangeCodeForTokens(code: string): Promise<HubspotTokens> {
  const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: hubspotAuthConfig.clientId!,
      client_secret: hubspotAuthConfig.clientSecret!,
      redirect_uri: hubspotAuthConfig.redirectUri,
      code,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for tokens: ${error}`);
  }

  return response.json();
}

export async function refreshHubspotTokens(refreshToken: string): Promise<HubspotTokens> {
  const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: hubspotAuthConfig.clientId!,
      client_secret: hubspotAuthConfig.clientSecret!,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh tokens: ${error}`);
  }

  return response.json();
}

export async function updateOrganizationHubspotTokens(
  organizationId: string,
  tokens: HubspotTokens
) {
  return prisma.organization.update({
    where: { id: organizationId },
    data: {
      hubspotConfig: {
        upsert: {
          create: {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            tokenExpiry: new Date(Date.now() + tokens.expires_in * 1000),
          },
          update: {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            tokenExpiry: new Date(Date.now() + tokens.expires_in * 1000),
          },
        },
      },
    },
  });
}
