-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "zapier_configs" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "webhook_url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "metadata" JSONB,
    "organization_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zapier_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zapier_webhooks" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "event_type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "error" TEXT,
    "organization_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zapier_webhooks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "zapier_configs" ADD CONSTRAINT "zapier_configs_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zapier_webhooks" ADD CONSTRAINT "zapier_webhooks_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropTable
DROP TABLE IF EXISTS "hubspot_configs";

-- DropTable
DROP TABLE IF EXISTS "hubspot_webhooks";
