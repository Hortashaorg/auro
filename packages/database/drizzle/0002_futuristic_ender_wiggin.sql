CREATE TYPE "public"."intervals" AS ENUM('5min', '15min', '30min', '1hour', '2hour', '4hour', '8hour', '12hour', '1day', '2day', '3day');--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "actions" TO "available_actions";--> statement-breakpoint
ALTER TABLE "server" ADD COLUMN "action_recovery_interval" intervals DEFAULT '1hour' NOT NULL;--> statement-breakpoint
ALTER TABLE "server" ADD COLUMN "action_recovery_amount" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "server" ADD COLUMN "max_available_actions" integer DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE "server" ADD COLUMN "starting_available_actions" integer DEFAULT 15 NOT NULL;