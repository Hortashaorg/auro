ALTER TABLE "actionResourceReward" RENAME COLUMN "quantity" TO "quantity_min";--> statement-breakpoint
ALTER TABLE "actionResourceReward" ALTER COLUMN "chance" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "actionItemReward" ADD COLUMN "chance" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "actionResourceReward" ADD COLUMN "quantity_max" integer NOT NULL;