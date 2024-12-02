CREATE TABLE IF NOT EXISTS "currency" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serverId" uuid NOT NULL,
	"assetId" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar(500),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_currency_name_per_server" UNIQUE("serverId","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serverId" uuid NOT NULL,
	"assetId" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar(500),
	"type" "itemtype" NOT NULL,
	"rarity" "rarity" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_item_name_per_server" UNIQUE("serverId","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "location" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serverId" uuid NOT NULL,
	"assetId" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar(500),
	"available" boolean DEFAULT false NOT NULL,
	"cooldownMinutes" integer NOT NULL,
	"repeatable" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_location_name_per_server" UNIQUE("serverId","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "npc" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serverId" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar(500),
	"health" integer NOT NULL,
	"attack" integer NOT NULL,
	"defense" integer NOT NULL,
	"speed" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_npc_name_per_server" UNIQUE("serverId","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_currency" (
	"userId" uuid NOT NULL,
	"currencyId" uuid NOT NULL,
	"amount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_item" (
	"userId" uuid NOT NULL,
	"itemId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_skill" (
	"userId" uuid NOT NULL,
	"skillId" uuid NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "currency" ADD CONSTRAINT "currency_serverId_server_id_fk" FOREIGN KEY ("serverId") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "currency" ADD CONSTRAINT "currency_assetId_asset_id_fk" FOREIGN KEY ("assetId") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item" ADD CONSTRAINT "item_serverId_server_id_fk" FOREIGN KEY ("serverId") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item" ADD CONSTRAINT "item_assetId_asset_id_fk" FOREIGN KEY ("assetId") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "location" ADD CONSTRAINT "location_serverId_server_id_fk" FOREIGN KEY ("serverId") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "location" ADD CONSTRAINT "location_assetId_asset_id_fk" FOREIGN KEY ("assetId") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "npc" ADD CONSTRAINT "npc_serverId_server_id_fk" FOREIGN KEY ("serverId") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_currency" ADD CONSTRAINT "user_currency_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_currency" ADD CONSTRAINT "user_currency_currencyId_currency_id_fk" FOREIGN KEY ("currencyId") REFERENCES "public"."currency"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_item" ADD CONSTRAINT "user_item_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_item" ADD CONSTRAINT "user_item_itemId_item_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_skill" ADD CONSTRAINT "user_skill_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_skill" ADD CONSTRAINT "user_skill_skillId_skill_id_fk" FOREIGN KEY ("skillId") REFERENCES "public"."skill"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
