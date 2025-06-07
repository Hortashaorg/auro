import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./db/schema.ts";
import pg from "postgres";

export const db = drizzle({
  connection: Deno.env.get("POSTGRES_URL") ??
    "postgresql://root:root@localhost:5432/root",
  schema,
  casing: "snake_case",
});

export * as schema from "./db/schema.ts";
export type { InferInsertModel, InferSelectModel } from "drizzle-orm";
export const PostgresError = pg.PostgresError;
export type { Transaction } from "./queries/types.ts";
export { errorCausedByConstraint } from "./queries/utils.ts";
export * as queries from "./queries/index.ts";
