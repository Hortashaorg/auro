import { type Context, getContext as getHonoContext } from "@package/framework";
import type { schema } from "@package/database";

export type CustomContext = {
  honoContext: Context;
  account: typeof schema.account.$inferSelect | undefined;
  session: typeof schema.session.$inferSelect | undefined;
};

export const getContext = () => {
  const context = getHonoContext();
  return context as CustomContext;
};
