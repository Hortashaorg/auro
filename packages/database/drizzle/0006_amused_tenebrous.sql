CREATE TYPE "public"."assetcategory" AS ENUM('avatar', 'weapon', 'armor', 'accessory', 'consumable', 'item', 'icon', 'companion', 'structure', 'currency');--> statement-breakpoint
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
