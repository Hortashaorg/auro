import { type Context, getContext as getHonoContext } from "@package/framework";
import type { schema } from "@package/database";

export type ContextType = Context<
  Record<string | number | symbol, never>,
  string,
  { in: { form: unknown }; out: { form: unknown } }
>;

export type CustomContext = {
  req: ContextType["req"];
  url: URL;
  account: typeof schema.account.$inferSelect | undefined;
  session: typeof schema.session.$inferSelect | undefined;
};

export const getContext = () => {
  return getHonoContext() as CustomContext;
};
