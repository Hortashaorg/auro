CREATE TABLE "action" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"server_id" uuid NOT NULL,
	"location_id" uuid,
	"name" varchar(50) NOT NULL,
	"description" varchar(500),
	"cooldown_minutes" integer DEFAULT 0 NOT NULL,
	"repeatable" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_action_name_per_server" UNIQUE("server_id","name")
);
--> statement-breakpoint
CREATE TABLE "location" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"server_id" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_location_name_per_server" UNIQUE("server_id","name")
);
--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_server_id_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location" ADD CONSTRAINT "location_server_id_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;