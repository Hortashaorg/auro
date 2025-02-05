import type { Context, Next } from "@hono/hono";
import { isPublic } from "../util/index.ts";
import { getCookie, setCookie } from "@hono/hono/cookie";

export const refreshMiddleware = (
  refreshTokenLogic: (
    context: Context,
  ) => Promise<
    {
      success: true;
      accessToken: string;
      refreshToken?: string;
      email: string;
      expires_in: number;
      refresh_token_expires_in?: number;
    } | { success: false }
  >,
) => {
  return async (c: Context, next: Next) => {
    if (isPublic(c.req.path)) {
      await next();
      return;
    }

    const accessToken = getCookie(c, "access_token");
    const refreshToken = getCookie(c, "refresh_token");

    if (!accessToken && refreshToken) {
      const result = await refreshTokenLogic(c);

      if (result.success) {
        setCookie(c, "access_token", result.accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Lax",
          maxAge: result.expires_in,
        });

        if (result.refreshToken) {
          setCookie(c, "refresh_token", result.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
            maxAge: result.refresh_token_expires_in,
          });
        }
      } else {
        throw new Error("Failed to refresh");
      }
    }

    await next();
  };
};
