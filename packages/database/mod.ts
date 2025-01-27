import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./db/schema.ts";

const db = drizzle({
  connection: "postgresql://root:root@localhost:5432/root",
  schema,
  casing: "snake_case",
});

export const getAccount = (email: string) => {
  return db.query.account.findFirst({
    where: (account, { eq }) => (eq(account.email, email)),
  });
};
