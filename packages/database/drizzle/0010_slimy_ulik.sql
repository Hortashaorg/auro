CREATE TYPE "public"."rarity" AS ENUM('common', 'uncommon', 'rare', 'epic', 'legendary');--> statement-breakpoint
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
ALTER TABLE "item" ADD CONSTRAINT "item_server_id_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_asset_id_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource" ADD CONSTRAINT "resource_server_id_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource" ADD CONSTRAINT "resource_asset_id_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;