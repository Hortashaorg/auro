ALTER TABLE "asset" ADD COLUMN "name" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "asset" ADD COLUMN "url" varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_url_unique" UNIQUE("url");