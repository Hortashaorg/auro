import type { Context, Next } from "@hono/hono";
import { getCookie } from "@hono/hono/cookie";
import { isPublic } from "../util/index.ts";

export const customContextMiddleware = (
  customContext: (
    context: Context,
    accessToken?: string,
    refreshToken?: string,
  ) => Promise<Record<string, unknown>>,
) => {
  return async (c: Context, next: Next) => {
    if (isPublic(c.req.path)) {
      await next();
      return;
    }

    const accessToken = getCookie(c, "access_token");
    const refreshToken = getCookie(c, "refresh_token");

    c.env.userContext = await customContext(
      c,
      accessToken,
      refreshToken,
    );

    await next();
  };
};
