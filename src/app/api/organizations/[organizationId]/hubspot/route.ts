import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { organizationId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.organizationId !== params.organizationId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await prisma.HubspotConfig.delete({
      where: { organizationId: params.organizationId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting HubSpot:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect HubSpot' },
      { status: 500 }
    );
  }
}
