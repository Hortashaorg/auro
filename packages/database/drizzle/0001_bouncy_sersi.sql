CREATE TYPE "public"."assetcategory" AS ENUM('avatar', 'weapon', 'armor', 'accessory', 'consumable', 'item', 'icon', 'companion', 'structure', 'currency');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "asset" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "assetcategory" NOT NULL
);
