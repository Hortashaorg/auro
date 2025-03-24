ALTER TABLE "public"."server" ALTER COLUMN "action_recovery_interval" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."intervals" CASCADE;--> statement-breakpoint
CREATE TYPE "public"."intervals" AS ENUM('5min', '15min', '30min', '1hour', '2hour', '4hour', '8hour', '12hour', '1day');--> statement-breakpoint
ALTER TABLE "public"."server" ALTER COLUMN "action_recovery_interval" SET DATA TYPE "public"."intervals" USING "action_recovery_interval"::"public"."intervals";