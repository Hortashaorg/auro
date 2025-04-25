import { db, eq, schema } from "@package/database";
import type { GlobalContext } from "@kalena/framework";

export const accountContext = async (ctx: GlobalContext) => {
  const email = ctx.var.email;
  if (!email) {
    throw new Error("Missing email of user");
  }

  const [account] = await db.select().from(schema.account).where(
    eq(schema.account.email, email),
  );

  if (!account) {
    throw new Error("Account not found");
  }

  return account;
};
