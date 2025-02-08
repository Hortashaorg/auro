ALTER TABLE "account" DROP CONSTRAINT "account_current_server_id_server_id_fk";
--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "can_create_server" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "current_server_id";