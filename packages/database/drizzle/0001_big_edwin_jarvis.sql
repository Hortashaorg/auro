ALTER TABLE "auth" DROP COLUMN "refresh_token_expires";--> statement-breakpoint
ALTER TABLE "auth" DROP COLUMN "access_token_expires";--> statement-breakpoint
ALTER TABLE "auth" ADD CONSTRAINT "auth_accountId_unique" UNIQUE("account_id");