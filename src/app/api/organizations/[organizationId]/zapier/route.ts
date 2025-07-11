import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/db';

export async function POST(
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
    const { name, webhookUrl } = await request.json();

    if (!name || !webhookUrl) {
      return NextResponse.json(
        { error: 'Name and webhook URL are required' },
        { status: 400 }
      );
    }

    const zapierConfig = await prisma.zapierConfig.create({
      data: {
        name,
        webhookUrl,
        organizationId: params.organizationId,
      },
    });

    return NextResponse.json(zapierConfig);
  } catch (error) {
    console.error('Error creating Zapier config:', error);
    return NextResponse.json(
      { error: 'Failed to create Zapier config' },
      { status: 500 }
    );
  }
}

export async function GET(
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
    const zapierConfigs = await prisma.zapierConfig.findMany({
      where: { organizationId: params.organizationId },
    });

    return NextResponse.json(zapierConfigs);
  } catch (error) {
    console.error('Error fetching Zapier configs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Zapier configs' },
      { status: 500 }
    );
  }
}

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
    const { searchParams } = new URL(request.url);
    const configId = searchParams.get('configId');

    if (!configId) {
      return NextResponse.json(
        { error: 'Config ID is required' },
        { status: 400 }
      );
    }

    await prisma.zapierConfig.delete({
      where: {
        id: configId,
        organizationId: params.organizationId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting Zapier config:', error);
    return NextResponse.json(
      { error: 'Failed to delete Zapier config' },
      { status: 500 }
    );
  }
}
