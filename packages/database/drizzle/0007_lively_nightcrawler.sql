CREATE TABLE "action_resource_cost" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action_id" uuid NOT NULL,
	"resource_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_action_resource_cost" UNIQUE("action_id","resource_id")
);
--> statement-breakpoint
ALTER TABLE "action_resource_cost" ADD CONSTRAINT "action_resource_cost_action_id_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_resource_cost" ADD CONSTRAINT "action_resource_cost_resource_id_resource_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resource"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "action_resource_cost_action_id_idx" ON "action_resource_cost" USING btree ("action_id");