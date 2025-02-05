import type { Context } from "@hono/hono";
import { getCookie, setCookie } from "@hono/hono/cookie";

export const loginMiddleware = (
  authCodeLoginLogic: (
    context: Context,
  ) => Promise<
    {
      success: true;
      accessToken: string;
      refreshToken: string;
      email: string;
      expires_in: number;
      refresh_token_expires_in?: number;
    } | { success: false }
  >,
  redirectAfterLogin: string,
) => {
  return async (c: Context) => {
    const accessToken = getCookie(c, "access_token");
    const refreshToken = getCookie(c, "refresh_token");

    if (!refreshToken && !accessToken) {
      const result = await authCodeLoginLogic(c);
      if (result.success) {
        setCookie(c, "access_token", result.accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Lax",
          maxAge: result.expires_in,
        });
        setCookie(c, "refresh_token", result.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Lax",
          maxAge: result.refresh_token_expires_in,
        });

        return c.redirect(redirectAfterLogin);
      } else {
        throw new Error("Failed to login");
      }
    }
    throw new Error("Already logged in");
  };
};
