DO $$ BEGIN
 CREATE TYPE "public"."user" AS ENUM('user', 'admin', 'user-admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"type" text,
	"provider" text,
	"providerAccountId" text,
	"refresh_token" "user",
	"access_token" text NOT NULL,
	"expires_at" text NOT NULL,
	"token_type" text NOT NULL,
	"scope" text NOT NULL,
	"id_token" text NOT NULL,
	"session_state" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "person" (
	"id" text PRIMARY KEY NOT NULL,
	"documentNumber" text,
	"phoneNumber" text,
	"email" text,
	"motherName" text,
	"fullName" text,
	"socialName" text,
	"birthDate" text,
	"isPoliticallyExposedPerson" text,
	"user_external_id" text NOT NULL,
	"user_id" text NOT NULL,
	"address_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_user_account_id_users_account_id_fk";
--> statement-breakpoint
ALTER TABLE "address" DROP CONSTRAINT "address_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "person_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "emailVerified" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user" "user";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth" ADD CONSTRAINT "auth_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "person" ADD CONSTRAINT "person_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "person" ADD CONSTRAINT "person_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "user_account_id";--> statement-breakpoint
ALTER TABLE "address" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "documentNumber";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "phoneNumber";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "motherName";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "fullName";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "socialName";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "birthDate";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "isPoliticallyExposedPerson";