import {
    boolean,
    pgEnum,
    pgTable,
    timestamp,
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
    token: varchar({ length: 50 }).notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
});
