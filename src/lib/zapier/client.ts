import { prisma } from '@/lib/db';

export class ZapierClient {
  private organizationId: string;

  constructor(organizationId: string) {
    this.organizationId = organizationId;
  }

  async sendEvent(eventType: string, payload: any) {
    try {
      // Get all active Zapier webhooks for the organization
      const zapierConfigs = await prisma.zapierConfig.findMany({
        where: {
          organizationId: this.organizationId,
          status: 'active',
        },
      });

      // Create webhook records and send events
      const promises = zapierConfigs.map(async (config) => {
        // Create webhook record
        const webhook = await prisma.zapierWebhook.create({
          data: {
            eventType,
            payload,
            organizationId: this.organizationId,
          },
        });

        // Send to Zapier
        try {
          const response = await fetch(config.webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              eventType,
              payload,
              webhookId: webhook.id,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          // Mark webhook as processed
          await prisma.zapierWebhook.update({
            where: { id: webhook.id },
            data: { processed: true },
          });

          return { success: true, webhookId: webhook.id };
        } catch (error) {
          // Update webhook with error
          await prisma.zapierWebhook.update({
            where: { id: webhook.id },
            data: {
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          });

          throw error;
        }
      });

      return Promise.all(promises);
    } catch (error) {
      console.error('Error sending Zapier event:', error);
      throw error;
    }
  }
}
