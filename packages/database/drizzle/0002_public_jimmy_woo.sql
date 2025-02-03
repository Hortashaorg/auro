ALTER TABLE "auth" RENAME TO "session";--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "auth_accountId_unique";--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "auth_refreshTokenHash_unique";--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "auth_accessTokenHash_unique";--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "auth_account_id_account_id_fk";
--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "expire" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_refreshTokenHash_unique" UNIQUE("refresh_token_hash");--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_accessTokenHash_unique" UNIQUE("access_token_hash");