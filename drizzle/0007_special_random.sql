ALTER TABLE "person" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "status" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "documentNumber" text NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "participant" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "accountOnboardingType" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "branch" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "account" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "accountType" text;--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "plaid_id";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "name";