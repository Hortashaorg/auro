ALTER TYPE "public"."assetcategory" ADD VALUE 'skill';--> statement-breakpoint
ALTER TYPE "public"."assetcategory" ADD VALUE 'symbol';--> statement-breakpoint
ALTER TABLE "server" ALTER COLUMN "action_recovery_interval" DROP DEFAULT;