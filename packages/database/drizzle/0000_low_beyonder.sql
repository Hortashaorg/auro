CREATE TYPE "public"."assetcategory" AS ENUM('character', 'creature', 'action', 'location', 'item', 'resource');--> statement-breakpoint
CREATE TYPE "public"."rarity" AS ENUM('common', 'uncommon', 'rare', 'epic', 'legendary');--> statement-breakpoint
CREATE TYPE "public"."usertype" AS ENUM('admin', 'player');--> statement-breakpoint
CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(100) NOT NULL,
	"nickname" varchar(50),
	"can_create_server" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "account_email_unique" UNIQUE("email"),
	CONSTRAINT "account_nickname_unique" UNIQUE("nickname")
);
--> statement-breakpoint
CREATE TABLE "action" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"server_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"location_id" uuid,
	"name" varchar(50) NOT NULL,
	"description" varchar(500),
	"cooldown_minutes" integer DEFAULT 0 NOT NULL,
	"repeatable" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_action_name_per_server" UNIQUE("server_id","name")
);
--> statement-breakpoint
CREATE TABLE "action_item_reward" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"chance" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_action_item_reward" UNIQUE("action_id","item_id")
);
--> statement-breakpoint
CREATE TABLE "action_resource_reward" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action_id" uuid NOT NULL,
	"resource_id" uuid NOT NULL,
	"quantity_min" integer NOT NULL,
	"quantity_max" integer NOT NULL,
	"chance" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_action_resource_reward" UNIQUE("action_id","resource_id")
);
--> statement-breakpoint
CREATE TABLE "asset" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "assetcategory" NOT NULL,
	"name" varchar(50) NOT NULL,
	"url" varchar(500) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "asset_name_unique" UNIQUE("name"),
	CONSTRAINT "asset_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE "item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"server_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar(500),
	"rarity" "rarity" DEFAULT 'common' NOT NULL,
	"stackable" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_item_name_per_server" UNIQUE("server_id","name")
);
--> statement-breakpoint
CREATE TABLE "location" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"server_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_location_name_per_server" UNIQUE("server_id","name")
);
--> statement-breakpoint
CREATE TABLE "resource" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"server_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_resource_name_per_server" UNIQUE("server_id","name")
);
--> statement-breakpoint
CREATE TABLE "server" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"online" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_server_name" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"account_id" uuid NOT NULL,
	"refresh_token_hash" varchar(500),
	"access_token_hash" varchar(500),
	"expire" timestamp NOT NULL,
	CONSTRAINT "session_refreshTokenHash_unique" UNIQUE("refresh_token_hash"),
	CONSTRAINT "session_accessTokenHash_unique" UNIQUE("access_token_hash")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"server_id" uuid NOT NULL,
	"name" varchar(50),
	"actions" integer DEFAULT 15 NOT NULL,
	"type" "usertype" DEFAULT 'player' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_user_name_per_server" UNIQUE("server_id","name")
);
--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_server_id_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_asset_id_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_item_reward" ADD CONSTRAINT "action_item_reward_action_id_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_item_reward" ADD CONSTRAINT "action_item_reward_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_resource_reward" ADD CONSTRAINT "action_resource_reward_action_id_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_resource_reward" ADD CONSTRAINT "action_resource_reward_resource_id_resource_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resource"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_server_id_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_asset_id_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location" ADD CONSTRAINT "location_server_id_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location" ADD CONSTRAINT "location_asset_id_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource" ADD CONSTRAINT "resource_server_id_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource" ADD CONSTRAINT "resource_asset_id_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_server_id_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "action_item_reward_action_id_idx" ON "action_item_reward" USING btree ("action_id");--> statement-breakpoint
CREATE INDEX "action_resource_reward_action_id_idx" ON "action_resource_reward" USING btree ("action_id");