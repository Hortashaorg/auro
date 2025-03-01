CREATE TABLE "actionItemReward" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_action_item_reward" UNIQUE("action_id","item_id")
);
--> statement-breakpoint
ALTER TABLE "actionItemReward" ADD CONSTRAINT "actionItemReward_action_id_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "actionItemReward" ADD CONSTRAINT "actionItemReward_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "action_item_reward_action_id_idx" ON "actionItemReward" USING btree ("action_id");