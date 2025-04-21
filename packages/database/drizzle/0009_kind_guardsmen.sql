ALTER TABLE "server" RENAME TO "game";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "can_create_server" TO "can_create_game";--> statement-breakpoint
ALTER TABLE "action" RENAME COLUMN "server_id" TO "game_id";--> statement-breakpoint
ALTER TABLE "action_log" RENAME COLUMN "server_id" TO "game_id";--> statement-breakpoint
ALTER TABLE "item" RENAME COLUMN "server_id" TO "game_id";--> statement-breakpoint
ALTER TABLE "location" RENAME COLUMN "server_id" TO "game_id";--> statement-breakpoint
ALTER TABLE "resource" RENAME COLUMN "server_id" TO "game_id";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "server_id" TO "game_id";--> statement-breakpoint
ALTER TABLE "action" DROP CONSTRAINT "unique_action_name_per_server";--> statement-breakpoint
ALTER TABLE "item" DROP CONSTRAINT "unique_item_name_per_server";--> statement-breakpoint
ALTER TABLE "location" DROP CONSTRAINT "unique_location_name_per_server";--> statement-breakpoint
ALTER TABLE "resource" DROP CONSTRAINT "unique_resource_name_per_server";--> statement-breakpoint
ALTER TABLE "game" DROP CONSTRAINT "unique_server_name";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "unique_user_name_per_server";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "unique_user_on_server_per_account";--> statement-breakpoint
ALTER TABLE "action" DROP CONSTRAINT "action_server_id_server_id_fk";
--> statement-breakpoint
ALTER TABLE "action_log" DROP CONSTRAINT "action_log_server_id_server_id_fk";
--> statement-breakpoint
ALTER TABLE "item" DROP CONSTRAINT "item_server_id_server_id_fk";
--> statement-breakpoint
ALTER TABLE "location" DROP CONSTRAINT "location_server_id_server_id_fk";
--> statement-breakpoint
ALTER TABLE "resource" DROP CONSTRAINT "resource_server_id_server_id_fk";
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_server_id_server_id_fk";
--> statement-breakpoint
ALTER TABLE "action" ALTER COLUMN "location_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_log" ADD CONSTRAINT "action_log_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location" ADD CONSTRAINT "location_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource" ADD CONSTRAINT "resource_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "unique_action_name_per_game" UNIQUE("game_id","name");--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "unique_item_name_per_game" UNIQUE("game_id","name");--> statement-breakpoint
ALTER TABLE "location" ADD CONSTRAINT "unique_location_name_per_game" UNIQUE("game_id","name");--> statement-breakpoint
ALTER TABLE "resource" ADD CONSTRAINT "unique_resource_name_per_game" UNIQUE("game_id","name");--> statement-breakpoint
ALTER TABLE "game" ADD CONSTRAINT "unique_game_name" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "unique_user_name_per_game" UNIQUE("game_id","name");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "unique_user_on_game_per_account" UNIQUE("game_id","account_id");