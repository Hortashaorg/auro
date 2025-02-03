import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./db/schema.ts";

export const db = drizzle({
  connection: "postgresql://root:root@localhost:5432/root",
  schema,
  casing: "snake_case",
});

export * as schema from "./db/schema.ts";

export { sql } from "drizzle-orm";
export { eq, gt, lt } from "drizzle-orm";
