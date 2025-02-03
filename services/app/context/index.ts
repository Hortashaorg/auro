import { type Context, getContext as getHonoContext } from "@package/framework";

export type CustomContext = {
  honoContext: Context;
};

export const getContext = () => {
  const context = getHonoContext();
  return context as CustomContext;
};
