CREATE TABLE "actionResourceReward" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action_id" uuid NOT NULL,
	"resource_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"chance" integer DEFAULT 100 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_action_resource_reward" UNIQUE("action_id","resource_id")
);
--> statement-breakpoint
ALTER TABLE "actionResourceReward" ADD CONSTRAINT "actionResourceReward_action_id_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "actionResourceReward" ADD CONSTRAINT "actionResourceReward_resource_id_resource_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resource"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "action_resource_reward_action_id_idx" ON "actionResourceReward" USING btree ("action_id");