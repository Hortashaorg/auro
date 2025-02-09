import { type Context, getContext as getHonoContext } from "@package/framework";
import type { schema } from "@package/database";

export type CustomContext = {
  req: Context["req"];
  url: URL;
  account: typeof schema.account.$inferSelect | undefined;
  session: typeof schema.session.$inferSelect | undefined;
};

export const getContext = () => {
  return getHonoContext() as CustomContext;
};
