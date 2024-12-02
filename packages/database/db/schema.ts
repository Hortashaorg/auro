import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

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
});

export const server = pgTable("server", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar({ length: 50 }).notNull(),
  online: boolean().notNull().default(false),
  updatedAt: timestamp().notNull().defaultNow(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const account = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar({ length: 100 }).notNull().unique(),
  registrationTime: timestamp().notNull().defaultNow(),
  avatarAssetId: uuid().references(() => asset.id).notNull(),
  currentServerId: uuid().references(() => server.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const auth = pgTable("auth", {
  accountId: uuid().references(() => account.id).notNull(),
  refreshTokenHash: varchar({ length: 500 }).unique(),
  refreshTokenExpires: timestamp(),
  accessTokenHash: varchar({ length: 500 }).unique(),
  accessTokenExpires: timestamp(),
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
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
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
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
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
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
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
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
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
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
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
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
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
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
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
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
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
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (
    table,
  ) => [
    unique("unique_location_name_per_server").on(table.serverId, table.name),
  ],
);
