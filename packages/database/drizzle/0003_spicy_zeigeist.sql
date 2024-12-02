CREATE TYPE "public"."itemtype" AS ENUM('weapon', 'armor', 'accessory', 'consumable', 'item', 'companion', 'structure');--> statement-breakpoint
CREATE TYPE "public"."rarity" AS ENUM('common', 'uncommon', 'rare', 'epic', 'legendary', 'ancient');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(100) NOT NULL,
	"registrationTime" timestamp DEFAULT now() NOT NULL,
	"avatarAssetId" uuid NOT NULL,
	"currentServerId" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "account_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth" (
	"accountId" uuid NOT NULL,
	"refreshTokenHash" varchar(500),
	"refreshTokenExpires" timestamp,
	"accessTokenHash" varchar(500),
	"accessTokenExpires" timestamp,
	CONSTRAINT "auth_refreshTokenHash_unique" UNIQUE("refreshTokenHash"),
	CONSTRAINT "auth_accessTokenHash_unique" UNIQUE("accessTokenHash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "server" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"online" boolean DEFAULT false NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skill" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" varchar(500),
	"name" varchar(50) NOT NULL,
	"serverId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_skill_name_per_server" UNIQUE("serverId","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"accountId" uuid NOT NULL,
	"serverId" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"actions" integer DEFAULT 15 NOT NULL,
	"type" "usertype" DEFAULT 'player' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_user_name_per_server" UNIQUE("serverId","name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_avatarAssetId_asset_id_fk" FOREIGN KEY ("avatarAssetId") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_currentServerId_server_id_fk" FOREIGN KEY ("currentServerId") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth" ADD CONSTRAINT "auth_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skill" ADD CONSTRAINT "skill_serverId_server_id_fk" FOREIGN KEY ("serverId") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_serverId_server_id_fk" FOREIGN KEY ("serverId") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
