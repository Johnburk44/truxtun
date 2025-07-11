import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface HubspotConfig {
  id: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiry: Date;
}

interface ExtendedSession {
  user?: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    organizationId: string;
    hubspotConfig?: HubspotConfig;
  };
}

export function HubspotConnection() {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch('/api/auth/hubspot');
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Failed to initiate HubSpot connection:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await fetch(`/api/organizations/${session?.user?.organizationId}/hubspot`, {
        method: 'DELETE',
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to disconnect HubSpot:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>HubSpot Integration</CardTitle>
        <CardDescription>
          Connect your HubSpot account to sync deals and contacts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium">Connection Status</h4>
            <p className="text-sm text-muted-foreground">
              {session?.user?.hubspotConfig ? "Connected" : "Not connected"}
            </p>
          </div>
          {session?.user?.hubspotConfig ? (
            <Button
              variant="destructive"
              onClick={handleDisconnect}
              disabled={isConnecting}
            >
              Disconnect
            </Button>
          ) : (
            <Button onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect HubSpot"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
