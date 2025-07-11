interface HubspotClientConfig {
  accessToken: string;
}

export class HubspotClient {
  private accessToken: string;

  constructor(config: HubspotClientConfig) {
    this.accessToken = config.accessToken;
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`https://api.hubapi.com${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HubSpot API error: ${error}`);
    }

    return response.json();
  }

  async getDealsPipeline() {
    return this.fetch<any>('/crm/v3/pipelines/deals');
  }

  async getDeals(params: { limit?: number; after?: string } = {}) {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.after) searchParams.set('after', params.after);

    return this.fetch<any>(`/crm/v3/objects/deals?${searchParams.toString()}`);
  }

  async getDeal(dealId: string) {
    return this.fetch<any>(`/crm/v3/objects/deals/${dealId}`);
  }

  async createDeal(properties: Record<string, any>) {
    return this.fetch<any>('/crm/v3/objects/deals', {
      method: 'POST',
      body: JSON.stringify({ properties }),
    });
  }

  async updateDeal(dealId: string, properties: Record<string, any>) {
    return this.fetch<any>(`/crm/v3/objects/deals/${dealId}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties }),
    });
  }
}
