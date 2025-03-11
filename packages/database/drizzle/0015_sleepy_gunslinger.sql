ALTER TABLE "user" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "nickname" varchar(50);--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_nickname_unique" UNIQUE("nickname");