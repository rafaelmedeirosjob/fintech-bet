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
	"latitude" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"documentNumber" text,
	"phoneNumber" text,
	"email" text,
	"motherName" text,
	"fullName" text,
	"socialName" text,
	"birthDate" text,
	"isPoliticallyExposedPerson" text,
	"user_external_id" text NOT NULL
);
