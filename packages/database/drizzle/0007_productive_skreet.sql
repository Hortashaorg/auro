ALTER TABLE "public"."asset" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."assetcategory";--> statement-breakpoint
CREATE TYPE "public"."assetcategory" AS ENUM('character', 'creature', 'action', 'location');--> statement-breakpoint
ALTER TABLE "public"."asset" ALTER COLUMN "type" SET DATA TYPE "public"."assetcategory" USING "type"::"public"."assetcategory";