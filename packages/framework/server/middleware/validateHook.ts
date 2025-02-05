import type { Context, Next } from "@hono/hono";
import { isPublic } from "../util/index.ts";
import { getCookie, setCookie } from "@hono/hono/cookie";

export const validateHookMiddleware = (
  // deno-lint-ignore no-explicit-any
  validateHook: (customContext: any) => Promise<boolean>,
) => {
  return async (c: Context, next: Next) => {
    if (
      isPublic(c.req.path) ||
      !getCookie(c, "access_token")
    ) {
      await next();
      return;
    }
    const isValid = await validateHook(c.env.userContext);
    if (!isValid) {
      setCookie(c, "access_token", "", {
        maxAge: 0,
      });
      setCookie(c, "refresh_token", "", {
        maxAge: 0,
      });
    }
    await next();
    return;
  };
};
