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

export const assetCategory = pgEnum("assetcategory", [
  "character",
  "creature",
  "action",
  "location",
]);

export const asset = pgTable("asset", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: assetCategory().notNull(),
  name: varchar({ length: 50 }).notNull().unique(),
  url: varchar({ length: 500 }).notNull().unique(),
  createdAt: temporalTimestamp().notNull().default(sql`now()`),
  updatedAt: temporalTimestamp().notNull().default(sql`now()`),
});

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

export const location = pgTable(
  "location",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: uuid("server_id").references(() => server.id).notNull(),
    name: varchar("name", { length: 50 }).notNull(),
    description: varchar("description", { length: 500 }),
    createdAt: temporalTimestamp("created_at").notNull().default(sql`now()`),
    updatedAt: temporalTimestamp("updated_at").notNull().default(sql`now()`),
  },
  (table) => [
    unique("unique_location_name_per_server").on(table.serverId, table.name),
  ],
);

export const action = pgTable(
  "action",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: uuid("server_id").references(() => server.id).notNull(),
    locationId: uuid("location_id").references(() => location.id),
    name: varchar("name", { length: 50 }).notNull(),
    description: varchar("description", { length: 500 }),
    cooldownMinutes: integer("cooldown_minutes").notNull().default(0),
    repeatable: boolean("repeatable").notNull().default(true),
    createdAt: temporalTimestamp("created_at").notNull().default(sql`now()`),
    updatedAt: temporalTimestamp("updated_at").notNull().default(sql`now()`),
  },
  (table) => [
    unique("unique_action_name_per_server").on(table.serverId, table.name),
  ],
);
