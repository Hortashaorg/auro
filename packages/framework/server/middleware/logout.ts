import type { Context } from "@hono/hono";
import { setCookie } from "@hono/hono/cookie";

export const logoutMiddleware = (
  logoutLogic: (context: Context) => Promise<{ success: boolean }>,
  redirectAfterLogout: string,
) => {
  return async (c: Context) => {
    const result = await logoutLogic(c);
    if (result.success) {
      // Clear cookies
      setCookie(c, "access_token", "", {
        maxAge: 0,
      });
      setCookie(c, "refresh_token", "", {
        maxAge: 0,
      });
      return c.redirect(redirectAfterLogout);
    }
    throw new Error("Failed to logout");
  };
};
