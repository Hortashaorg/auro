CREATE TYPE "public"."assetcategory" AS ENUM('avatar', 'weapon', 'armor', 'accessory', 'consumable', 'item', 'icon', 'companion', 'structure', 'currency');--> statement-breakpoint
CREATE TYPE "public"."itemtype" AS ENUM('weapon', 'armor', 'accessory', 'consumable', 'item', 'companion', 'structure');--> statement-breakpoint
CREATE TYPE "public"."rarity" AS ENUM('common', 'uncommon', 'rare', 'epic', 'legendary', 'ancient');--> statement-breakpoint
CREATE TYPE "public"."usertype" AS ENUM('admin', 'player');--> statement-breakpoint
CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(100) NOT NULL,
	"current_server_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "account_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "asset" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "assetcategory" NOT NULL,
	"name" varchar(50) NOT NULL,
	"url" varchar(500) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "asset_name_unique" UNIQUE("name"),
	CONSTRAINT "asset_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE "auth" (
	"account_id" uuid NOT NULL,
	"refresh_token_hash" varchar(500),
	"refresh_token_expires" timestamp DEFAULT now() NOT NULL,
	"access_token_hash" varchar(500),
	"access_token_expires" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "auth_refreshTokenHash_unique" UNIQUE("refresh_token_hash"),
	CONSTRAINT "auth_accessTokenHash_unique" UNIQUE("access_token_hash")
);
--> statement-breakpoint
CREATE TABLE "currency" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"server_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_currency_name_per_server" UNIQUE("server_id","name")
);
--> statement-breakpoint
CREATE TABLE "item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"server_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar(500),
	"type" "itemtype" NOT NULL,
	"rarity" "rarity" NOT NULL,
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
	"available" boolean DEFAULT false NOT NULL,
	"cooldown_minutes" integer NOT NULL,
	"repeatable" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_location_name_per_server" UNIQUE("server_id","name")
);
--> statement-breakpoint
CREATE TABLE "location_npc" (
	"location_id" uuid NOT NULL,
	"npc_id" uuid NOT NULL,
	"count" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_location_npc_per_location" UNIQUE("location_id","npc_id")
);
--> statement-breakpoint
CREATE TABLE "location_req_item" (
	"location_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_location_req_item_per_location" UNIQUE("location_id","item_id")
);
--> statement-breakpoint
CREATE TABLE "location_req_skill" (
	"location_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"xp" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_location_req_skill_per_location" UNIQUE("location_id","skill_id")
);
--> statement-breakpoint
CREATE TABLE "location_reward_currency" (
	"location_id" uuid NOT NULL,
	"currency_id" uuid NOT NULL,
	"chance" integer NOT NULL,
	"min" integer NOT NULL,
	"max" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_location_reward_currency_per_location" UNIQUE("location_id","currency_id")
);
--> statement-breakpoint
CREATE TABLE "location_reward_item" (
	"location_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"chance" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_location_reward_item_per_location" UNIQUE("location_id","item_id")
);
--> statement-breakpoint
CREATE TABLE "location_reward_skill" (
	"location_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"chance" integer NOT NULL,
	"min" integer NOT NULL,
	"max" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_location_reward_skill_per_location" UNIQUE("location_id","skill_id")
);
--> statement-breakpoint
CREATE TABLE "npc" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"server_id" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar(500),
	"health" integer NOT NULL,
	"attack" integer NOT NULL,
	"defense" integer NOT NULL,
	"speed" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_npc_name_per_server" UNIQUE("server_id","name")
);
--> statement-breakpoint
CREATE TABLE "server" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"online" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" varchar(500),
	"name" varchar(50) NOT NULL,
	"server_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_skill_name_per_server" UNIQUE("server_id","name")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"server_id" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"actions" integer DEFAULT 15 NOT NULL,
	"type" "usertype" DEFAULT 'player' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_user_name_per_server" UNIQUE("server_id","name")
);
--> statement-breakpoint
CREATE TABLE "user_currency" (
	"user_id" uuid NOT NULL,
	"currency_id" uuid NOT NULL,
	"amount" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_item" (
	"user_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_skill" (
	"user_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_current_server_id_server_id_fk" FOREIGN KEY ("current_server_id") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth" ADD CONSTRAINT "auth_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "currency" ADD CONSTRAINT "currency_server_id_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "currency" ADD CONSTRAINT "currency_asset_id_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_server_id_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_asset_id_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location" ADD CONSTRAINT "location_server_id_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location" ADD CONSTRAINT "location_asset_id_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_npc" ADD CONSTRAINT "location_npc_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_npc" ADD CONSTRAINT "location_npc_npc_id_npc_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npc"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_req_item" ADD CONSTRAINT "location_req_item_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_req_item" ADD CONSTRAINT "location_req_item_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_req_skill" ADD CONSTRAINT "location_req_skill_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_req_skill" ADD CONSTRAINT "location_req_skill_skill_id_skill_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skill"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_reward_currency" ADD CONSTRAINT "location_reward_currency_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_reward_currency" ADD CONSTRAINT "location_reward_currency_currency_id_currency_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currency"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_reward_item" ADD CONSTRAINT "location_reward_item_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_reward_item" ADD CONSTRAINT "location_reward_item_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_reward_skill" ADD CONSTRAINT "location_reward_skill_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_reward_skill" ADD CONSTRAINT "location_reward_skill_skill_id_skill_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skill"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc" ADD CONSTRAINT "npc_server_id_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill" ADD CONSTRAINT "skill_server_id_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_server_id_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_currency" ADD CONSTRAINT "user_currency_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_currency" ADD CONSTRAINT "user_currency_currency_id_currency_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currency"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_item" ADD CONSTRAINT "user_item_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_item" ADD CONSTRAINT "user_item_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skill" ADD CONSTRAINT "user_skill_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skill" ADD CONSTRAINT "user_skill_skill_id_skill_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skill"("id") ON DELETE no action ON UPDATE no action;