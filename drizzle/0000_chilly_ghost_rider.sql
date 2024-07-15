DO $$ BEGIN
 CREATE TYPE "public"."user" AS ENUM('user', 'admin', 'user-admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"status" text,
	"pixStatus" text,
	"amount" text,
	"pendingAmount" numeric,
	"documentNumber" text NOT NULL,
	"participant" text,
	"accountOnboardingType" text,
	"branch" text,
	"account" text,
	"accountType" text,
	"person_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "address" (
	"id" text PRIMARY KEY NOT NULL,
	"postalCode" text,
	"street" text,
	"number" text,
	"addressComplement" text,
	"neighborhood" text,
	"city" text,
	"state" text,
	"longitude" text,
	"latitude" text
);
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
CREATE TABLE IF NOT EXISTS "connected_banks" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fees" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text,
	"origin" text,
	"value" text
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
	"user_id" text,
	"address_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"subscription_id" text NOT NULL,
	"status" text NOT NULL,
	CONSTRAINT "subscriptions_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "subscriptions_subscription_id_unique" UNIQUE("subscription_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"amount" text NOT NULL,
	"notes" text NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"person_id" text NOT NULL,
	"type_transaction_id" text NOT NULL,
	"fee_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "type_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"description" text,
	"name" text NOT NULL,
	"fee_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"emailVerified" text,
	"image" text,
	"password" text,
	"user" "user",
	"user_external_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_type_transaction_id_type_transactions_id_fk" FOREIGN KEY ("type_transaction_id") REFERENCES "public"."type_transactions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_fee_id_fees_id_fk" FOREIGN KEY ("fee_id") REFERENCES "public"."fees"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "type_transactions" ADD CONSTRAINT "type_transactions_fee_id_fees_id_fk" FOREIGN KEY ("fee_id") REFERENCES "public"."fees"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
