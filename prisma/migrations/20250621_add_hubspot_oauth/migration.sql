-- Create HubspotConfig table
CREATE TYPE "HubspotAuthType" AS ENUM ('oauth', 'apikey');

CREATE TABLE "hubspot_configs" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "organization_id" UUID NOT NULL,
    "auth_type" "HubspotAuthType" NOT NULL DEFAULT 'oauth',
    "access_token" TEXT,
    "refresh_token" TEXT,
    "token_expiry" TIMESTAMP(3),
    "api_key" TEXT,
    "portal_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "hubspot_configs_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "hubspot_configs_organization_id_key" UNIQUE ("organization_id"),
    CONSTRAINT "hubspot_configs_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Drop the hubspotConfig column from organizations table
ALTER TABLE "organizations" DROP COLUMN IF EXISTS "hubspotConfig";
