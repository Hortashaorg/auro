import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./db/schema.ts";
import pg from "postgres";

export const db = drizzle({
  connection: "postgresql://root:root@localhost:5432/root",
  schema,
  casing: "snake_case",
});

export * as schema from "./db/schema.ts";

export { and, eq, exists, gt, lt, or, sql } from "drizzle-orm";
export type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const PostgresError = pg.PostgresError;
