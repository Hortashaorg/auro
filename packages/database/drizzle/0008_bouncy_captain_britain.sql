ALTER TABLE "action" ADD COLUMN "asset_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "location" ADD COLUMN "asset_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_asset_id_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location" ADD CONSTRAINT "location_asset_id_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;