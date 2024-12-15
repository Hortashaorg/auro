CREATE TABLE IF NOT EXISTS "location_npc" (
	"locationId" uuid NOT NULL,
	"npcId" uuid NOT NULL,
	"count" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_location_npc_per_location" UNIQUE("locationId","npcId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "location_req_item" (
	"locationId" uuid NOT NULL,
	"itemId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_location_req_item_per_location" UNIQUE("locationId","itemId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "location_req_skill" (
	"locationId" uuid NOT NULL,
	"skillId" uuid NOT NULL,
	"xp" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_location_req_skill_per_location" UNIQUE("locationId","skillId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "location_reward_currency" (
	"locationId" uuid NOT NULL,
	"currencyId" uuid NOT NULL,
	"chance" integer NOT NULL,
	"min" integer NOT NULL,
	"max" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_location_reward_currency_per_location" UNIQUE("locationId","currencyId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "location_reward_item" (
	"locationId" uuid NOT NULL,
	"itemId" uuid NOT NULL,
	"chance" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_location_reward_item_per_location" UNIQUE("locationId","itemId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "location_reward_skill" (
	"locationId" uuid NOT NULL,
	"skillId" uuid NOT NULL,
	"chance" integer NOT NULL,
	"min" integer NOT NULL,
	"max" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_location_reward_skill_per_location" UNIQUE("locationId","skillId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "location_npc" ADD CONSTRAINT "location_npc_locationId_location_id_fk" FOREIGN KEY ("locationId") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "location_npc" ADD CONSTRAINT "location_npc_npcId_npc_id_fk" FOREIGN KEY ("npcId") REFERENCES "public"."npc"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "location_req_item" ADD CONSTRAINT "location_req_item_locationId_location_id_fk" FOREIGN KEY ("locationId") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "location_req_item" ADD CONSTRAINT "location_req_item_itemId_item_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "location_req_skill" ADD CONSTRAINT "location_req_skill_locationId_location_id_fk" FOREIGN KEY ("locationId") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "location_req_skill" ADD CONSTRAINT "location_req_skill_skillId_skill_id_fk" FOREIGN KEY ("skillId") REFERENCES "public"."skill"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "location_reward_currency" ADD CONSTRAINT "location_reward_currency_locationId_location_id_fk" FOREIGN KEY ("locationId") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "location_reward_currency" ADD CONSTRAINT "location_reward_currency_currencyId_currency_id_fk" FOREIGN KEY ("currencyId") REFERENCES "public"."currency"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "location_reward_item" ADD CONSTRAINT "location_reward_item_locationId_location_id_fk" FOREIGN KEY ("locationId") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "location_reward_item" ADD CONSTRAINT "location_reward_item_itemId_item_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "location_reward_skill" ADD CONSTRAINT "location_reward_skill_locationId_location_id_fk" FOREIGN KEY ("locationId") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "location_reward_skill" ADD CONSTRAINT "location_reward_skill_skillId_skill_id_fk" FOREIGN KEY ("skillId") REFERENCES "public"."skill"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
