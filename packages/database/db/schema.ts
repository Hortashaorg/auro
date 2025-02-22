import {
  boolean,
  customType,
  integer,
  pgEnum,
  pgTable,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const temporalTimestamp = customType<
  {
    data: Temporal.Instant;
    driverData: string;
  }
>({
  dataType() {
    return `timestamp`;
  },
  fromDriver(value: string): Temporal.Instant {
    return Temporal.Instant.from(value.replace(" ", "T") + "Z");
  },
  toDriver(value: Temporal.Instant): string {
    return value.toString();
  },
});

export const userType = pgEnum("usertype", ["admin", "player"]);

export const server = pgTable("server", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar({ length: 50 }).notNull(),
  online: boolean().notNull().default(false),
  updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  createdAt: temporalTimestamp().notNull().default(sql`now()`),
});

export const account = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar({ length: 100 }).notNull().unique(),
  canCreateServer: boolean().notNull().default(false),
  createdAt: temporalTimestamp().notNull().default(sql`now()`),
  updatedAt: temporalTimestamp().notNull().default(sql`now()`),
});

export const session = pgTable("session", {
  accountId: uuid().references(() => account.id).notNull(),
  refreshTokenHash: varchar({ length: 500 }).unique(),
  accessTokenHash: varchar({ length: 500 }).unique(),
  expire: temporalTimestamp().notNull(),
});

export const user = pgTable(
  "user",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: uuid().references(() => account.id).notNull(),
    serverId: uuid().references(() => server.id).notNull(),
    name: varchar({ length: 50 }).notNull(),
    actions: integer().notNull().default(15),
    type: userType().notNull().default("player"),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
  (
    table,
  ) => [unique("unique_user_name_per_server").on(table.serverId, table.name)],
);
