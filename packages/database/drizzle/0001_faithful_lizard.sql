CREATE TABLE "user_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_resource" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"resource_id" uuid NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_user_resource" UNIQUE("user_id","resource_id")
);
--> statement-breakpoint
ALTER TABLE "action_item_reward" DROP CONSTRAINT "action_item_reward_action_id_action_id_fk";
--> statement-breakpoint
ALTER TABLE "action_item_reward" DROP CONSTRAINT "action_item_reward_item_id_item_id_fk";
--> statement-breakpoint
ALTER TABLE "action_resource_reward" DROP CONSTRAINT "action_resource_reward_action_id_action_id_fk";
--> statement-breakpoint
ALTER TABLE "action_resource_reward" DROP CONSTRAINT "action_resource_reward_resource_id_resource_id_fk";
--> statement-breakpoint
ALTER TABLE "user_item" ADD CONSTRAINT "user_item_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_item" ADD CONSTRAINT "user_item_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_resource" ADD CONSTRAINT "user_resource_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_resource" ADD CONSTRAINT "user_resource_resource_id_resource_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resource"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_item_user_id_idx" ON "user_item" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_resource_user_id_idx" ON "user_resource" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "action_item_reward" ADD CONSTRAINT "action_item_reward_action_id_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_item_reward" ADD CONSTRAINT "action_item_reward_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_resource_reward" ADD CONSTRAINT "action_resource_reward_action_id_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_resource_reward" ADD CONSTRAINT "action_resource_reward_resource_id_resource_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resource"("id") ON DELETE cascade ON UPDATE no action;