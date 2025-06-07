import { queries } from "@package/database";
import type { GlobalContext } from "@kalena/framework";

export const accountContext = async (ctx: GlobalContext) => {
  const email = ctx.var.email;
  if (!email) {
    throw new Error("Missing email of user");
  }

  return await queries.accounts.getAccountByEmail(email);
};
