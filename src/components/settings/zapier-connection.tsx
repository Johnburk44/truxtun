import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

interface ZapierConfig {
  id: string;
  name: string;
  webhookUrl: string;
  status: string;
}

interface ExtendedSession {
  user?: {
    organizationId?: string;
  };
}

export function ZapierConnection() {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const [webhookUrl, setWebhookUrl] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    if (!webhookUrl || !name) {
      toast({
        title: 'Error',
        description: 'Please provide both name and webhook URL',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/organizations/${session?.user?.organizationId}/zapier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, webhookUrl }),
      });

      if (!response.ok) throw new Error('Failed to connect Zapier');

      toast({
        title: 'Success',
        description: 'Zapier webhook successfully connected',
      });
      
      // Reset form
      setWebhookUrl('');
      setName('');
    } catch (error) {
      console.error('Failed to connect Zapier:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect Zapier webhook',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zapier Integration</CardTitle>
        <CardDescription>
          Connect your Zapier workflows to automate your processes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Webhook Name</Label>
          <Input
            id="name"
            placeholder="e.g., Lead Notification"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="webhook">Webhook URL</Label>
          <Input
            id="webhook"
            placeholder="https://hooks.zapier.com/..."
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
        </div>
        <Button
          onClick={handleConnect}
          disabled={isLoading || !webhookUrl || !name}
        >
          {isLoading ? 'Connecting...' : 'Connect Zapier'}
        </Button>
      </CardContent>
    </Card>
  );
}
