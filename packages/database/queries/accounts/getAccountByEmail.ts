import { eq } from "drizzle-orm";
import { db, schema } from "@db/mod.ts";
import { throwError } from "@package/common";

export const getAccountByEmail = async (email: string) => {
  const account = await db.query.account.findFirst({
    where: eq(schema.account.email, email),
  });

  return account ?? throwError("Account not found");
};
