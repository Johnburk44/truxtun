-- CreateEnum
CREATE TYPE "HubspotAuthType" AS ENUM ('oauth', 'apikey');

-- CreateTable
CREATE TABLE "hubspot_configs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organization_id" UUID NOT NULL,
    "auth_type" "HubspotAuthType" NOT NULL DEFAULT 'oauth',
    "access_token" TEXT,
    "refresh_token" TEXT,
    "token_expiry" TIMESTAMP(3),
    "api_key" TEXT,
    "portal_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hubspot_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hubspot_configs_organization_id_key" ON "hubspot_configs"("organization_id");

-- AddForeignKey
ALTER TABLE "hubspot_configs" ADD CONSTRAINT "hubspot_configs_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
