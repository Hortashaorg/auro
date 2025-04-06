import {
  boolean,
  customType,
  index,
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
  "item",
  "resource",
  "skill",
  "symbol",
]);

export const rarity = pgEnum("rarity", [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
]);

export const intervals = pgEnum("intervals", [
  "5min",
  "15min",
  "30min",
  "1hour",
  "2hour",
  "4hour",
  "8hour",
  "12hour",
  "1day",
]);

export const asset = pgTable("asset", {
  id: uuid().primaryKey().defaultRandom(),
  type: assetCategory().notNull(),
  name: varchar({ length: 50 }).notNull().unique(),
  url: varchar({ length: 500 }).notNull().unique(),
  createdAt: temporalTimestamp().notNull().default(sql`now()`),
  updatedAt: temporalTimestamp().notNull().default(sql`now()`),
});

export const server = pgTable("server", {
  id: uuid().primaryKey().defaultRandom(),
  actionRecoveryInterval: intervals().notNull(),
  actionRecoveryAmount: integer().notNull().default(1),
  maxAvailableActions: integer().notNull().default(100),
  startingAvailableActions: integer().notNull().default(15),
  name: varchar({ length: 50 }).notNull().unique("unique_server_name"),
  online: boolean().notNull().default(false),
  updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  createdAt: temporalTimestamp().notNull().default(sql`now()`),
});

export const account = pgTable("account", {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: 100 }).notNull().unique(),
  nickname: varchar({ length: 50 }).unique(),
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
    id: uuid().primaryKey().defaultRandom(),
    accountId: uuid().references(() => account.id).notNull(),
    serverId: uuid().references(() => server.id).notNull(),
    name: varchar({ length: 50 }),
    availableActions: integer().notNull(),
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
    id: uuid().primaryKey().defaultRandom(),
    serverId: uuid().references(() => server.id).notNull(),
    assetId: uuid().references(() => asset.id).notNull(),
    name: varchar({ length: 50 }).notNull(),
    description: varchar({ length: 500 }),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
  (table) => [
    unique("unique_location_name_per_server").on(table.serverId, table.name),
  ],
);

export const action = pgTable(
  "action",
  {
    id: uuid().primaryKey().defaultRandom(),
    serverId: uuid().references(() => server.id).notNull(),
    assetId: uuid().references(() => asset.id).notNull(),
    locationId: uuid().references(() => location.id),
    name: varchar({ length: 50 }).notNull(),
    description: varchar({ length: 500 }),
    cooldownMinutes: integer().notNull().default(0),
    repeatable: boolean().notNull().default(true),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
  (table) => [
    unique("unique_action_name_per_server").on(table.serverId, table.name),
  ],
);

export const item = pgTable(
  "item",
  {
    id: uuid().primaryKey().defaultRandom(),
    serverId: uuid().references(() => server.id).notNull(),
    assetId: uuid().references(() => asset.id).notNull(),
    name: varchar({ length: 50 }).notNull(),
    description: varchar({ length: 500 }),
    rarity: rarity().notNull().default("common"),
    stackable: boolean("stackable").notNull(),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
  (table) => [
    unique("unique_item_name_per_server").on(table.serverId, table.name),
  ],
);

export const resource = pgTable(
  "resource",
  {
    id: uuid().primaryKey().defaultRandom(),
    serverId: uuid().references(() => server.id).notNull(),
    assetId: uuid().references(() => asset.id).notNull(),
    name: varchar({ length: 50 }).notNull(),
    description: varchar({ length: 500 }),
    leaderboard: boolean().notNull().default(false),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
  (table) => [
    unique("unique_resource_name_per_server").on(table.serverId, table.name),
  ],
);

export const actionResourceReward = pgTable(
  "action_resource_reward",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actionId: uuid().references(() => action.id, { onDelete: "cascade" })
      .notNull(),
    resourceId: uuid().references(() => resource.id, { onDelete: "cascade" })
      .notNull(),
    quantityMin: integer().notNull(),
    quantityMax: integer().notNull(),
    chance: integer().notNull(),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
  (table) => [
    unique("unique_action_resource_reward").on(
      table.actionId,
      table.resourceId,
    ),
    index("action_resource_reward_action_id_idx").on(table.actionId),
  ],
);

export const actionItemReward = pgTable("action_item_reward", {
  id: uuid().primaryKey().defaultRandom(),
  actionId: uuid().references(() => action.id, { onDelete: "cascade" })
    .notNull(),
  itemId: uuid().references(() => item.id, { onDelete: "cascade" }).notNull(),
  chance: integer().notNull(),
  createdAt: temporalTimestamp().notNull().default(sql`now()`),
  updatedAt: temporalTimestamp().notNull().default(sql`now()`),
}, (table) => [
  unique("unique_action_item_reward").on(table.actionId, table.itemId),
  index("action_item_reward_action_id_idx").on(table.actionId),
]);

export const userResource = pgTable(
  "user_resource",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().references(() => user.id, { onDelete: "cascade" }).notNull(),
    resourceId: uuid().references(() => resource.id, { onDelete: "cascade" })
      .notNull(),
    quantity: integer().notNull().default(0),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
  (table) => [
    unique("unique_user_resource").on(table.userId, table.resourceId),
    index("user_resource_user_id_idx").on(table.userId),
  ],
);

export const userItem = pgTable(
  "user_item",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().references(() => user.id, { onDelete: "cascade" }).notNull(),
    itemId: uuid().references(() => item.id, { onDelete: "cascade" }).notNull(),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
  (table) => [
    index("user_item_user_id_idx").on(table.userId),
  ],
);
