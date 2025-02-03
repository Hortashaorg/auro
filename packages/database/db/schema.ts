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
import { relations, sql } from "drizzle-orm";

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
  "avatar",
  "weapon",
  "armor",
  "accessory",
  "consumable",
  "item",
  "icon",
  "companion",
  "structure",
  "currency",
]);

export const rarity = pgEnum("rarity", [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "ancient",
]);

export const itemType = pgEnum("itemtype", [
  "weapon",
  "armor",
  "accessory",
  "consumable",
  "item",
  "companion",
  "structure",
]);

export const asset = pgTable("asset", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: assetCategory().notNull(),
  name: varchar({ length: 50 }).notNull().unique(),
  url: varchar({ length: 500 }).notNull().unique(),
  updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  createdAt: temporalTimestamp().notNull().default(sql`now()`),
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
  currentServerId: uuid().references(() => server.id),
  createdAt: temporalTimestamp().notNull().default(sql`now()`),
  updatedAt: temporalTimestamp().notNull().default(sql`now()`),
});

export const auth = pgTable("auth", {
  accountId: uuid().references(() => account.id).notNull().unique(),
  refreshTokenHash: varchar({ length: 500 }).unique(),
  accessTokenHash: varchar({ length: 500 }).unique(),
});

export const authRelations = relations(auth, ({ one }) => ({
  account: one(account, {
    fields: [auth.accountId],
    references: [account.id],
  }),
}));

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

export const skill = pgTable(
  "skill",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    description: varchar({ length: 500 }),
    name: varchar({ length: 50 }).notNull(),
    serverId: uuid().references(() => server.id).notNull(),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
  (
    table,
  ) => [unique("unique_skill_name_per_server").on(table.serverId, table.name)],
);

export const npc = pgTable(
  "npc",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: uuid().references(() => server.id).notNull(),
    name: varchar({ length: 50 }).notNull(),
    description: varchar({ length: 500 }),
    health: integer().notNull(),
    attack: integer().notNull(),
    defense: integer().notNull(),
    speed: integer().notNull(),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
  (
    table,
  ) => [unique("unique_npc_name_per_server").on(table.serverId, table.name)],
);

export const userSkill = pgTable(
  "user_skill",
  {
    userId: uuid().references(() => user.id).notNull(),
    skillId: uuid().references(() => skill.id).notNull(),
    xp: integer().notNull().default(0),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
);

export const item = pgTable(
  "item",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: uuid().references(() => server.id).notNull(),
    assetId: uuid().references(() => asset.id).notNull(),
    name: varchar({ length: 50 }).notNull(),
    description: varchar({ length: 500 }),
    type: itemType().notNull(),
    rarity: rarity().notNull(),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
  (
    table,
  ) => [unique("unique_item_name_per_server").on(table.serverId, table.name)],
);

export const userItem = pgTable(
  "user_item",
  {
    userId: uuid().references(() => user.id).notNull(),
    itemId: uuid().references(() => item.id).notNull(),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
);

export const currency = pgTable(
  "currency",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: uuid().references(() => server.id).notNull(),
    assetId: uuid().references(() => asset.id).notNull(),
    name: varchar({ length: 50 }).notNull(),
    description: varchar({ length: 500 }),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
  (
    table,
  ) => [
    unique("unique_currency_name_per_server").on(table.serverId, table.name),
  ],
);

export const userCurrency = pgTable(
  "user_currency",
  {
    userId: uuid().references(() => user.id).notNull(),
    currencyId: uuid().references(() => currency.id).notNull(),
    amount: integer().notNull().default(0),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
);

export const location = pgTable(
  "location",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: uuid().references(() => server.id).notNull(),
    assetId: uuid().references(() => asset.id).notNull(),
    name: varchar({ length: 50 }).notNull(),
    description: varchar({ length: 500 }),
    available: boolean().notNull().default(false),
    cooldownMinutes: integer().notNull(),
    repeatable: boolean().notNull().default(true),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
  (
    table,
  ) => [
    unique("unique_location_name_per_server").on(table.serverId, table.name),
  ],
);

export const locationRewardSkill = pgTable(
  "location_reward_skill",
  {
    locationId: uuid().references(() => location.id).notNull(),
    skillId: uuid().references(() => skill.id).notNull(),
    chance: integer().notNull(),
    min: integer().notNull(),
    max: integer().notNull(),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
  (table) => [
    unique("unique_location_reward_skill_per_location").on(
      table.locationId,
      table.skillId,
    ),
  ],
);

export const locationRewardItem = pgTable(
  "location_reward_item",
  {
    locationId: uuid().references(() => location.id).notNull(),
    itemId: uuid().references(() => item.id).notNull(),
    chance: integer().notNull(),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
  (table) => [
    unique("unique_location_reward_item_per_location").on(
      table.locationId,
      table.itemId,
    ),
  ],
);

export const locationRewardCurrency = pgTable(
  "location_reward_currency",
  {
    locationId: uuid().references(() => location.id).notNull(),
    currencyId: uuid().references(() => currency.id).notNull(),
    chance: integer().notNull(),
    min: integer().notNull(),
    max: integer().notNull(),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
  (table) => [
    unique("unique_location_reward_currency_per_location").on(
      table.locationId,
      table.currencyId,
    ),
  ],
);

export const locationReqSkill = pgTable(
  "location_req_skill",
  {
    locationId: uuid().references(() => location.id).notNull(),
    skillId: uuid().references(() => skill.id).notNull(),
    xp: integer().notNull(),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
  (table) => [
    unique("unique_location_req_skill_per_location").on(
      table.locationId,
      table.skillId,
    ),
  ],
);

export const locationReqItem = pgTable(
  "location_req_item",
  {
    locationId: uuid().references(() => location.id).notNull(),
    itemId: uuid().references(() => item.id).notNull(),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
  (table) => [
    unique("unique_location_req_item_per_location").on(
      table.locationId,
      table.itemId,
    ),
  ],
);

export const locationNpc = pgTable(
  "location_npc",
  {
    locationId: uuid().references(() => location.id).notNull(),
    npcId: uuid().references(() => npc.id).notNull(),
    count: integer().notNull(),
    createdAt: temporalTimestamp().notNull().default(sql`now()`),
    updatedAt: temporalTimestamp().notNull().default(sql`now()`),
  },
  (table) => [
    unique("unique_location_npc_per_location").on(
      table.locationId,
      table.npcId,
    ),
  ],
);
