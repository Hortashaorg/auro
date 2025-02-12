import { Hono } from "@hono/hono";
import { serveStatic, upgradeWebSocket } from "@hono/hono/deno";
import * as v from "@valibot/valibot";
import type { createRoute, Variables } from "../routing/create-route.tsx";
import { INTERNAL_APP } from "../routing/create-route.tsx";
import { decode } from "@hono/hono/jwt";
import { getCookie, setCookie } from "@hono/hono/cookie";

type AfterLoginHookTypes<T extends "google"> = T extends "google" ? {
    success: true;
    accessToken: string;
    refreshToken: string;
    email: string;
    expires_in: number;
    refresh_token_expires_in: number;
  } | {
    success: false;
    error: unknown;
  }
  : never;

type BeforeLogoutHookTypes<T extends "google"> = T extends "google" ? {
    refreshToken: string;
    accessToken: string;
    email: string;
  }
  : never;

type RefreshHookTypes<T extends "google"> = T extends "google" ? {
    success: true;
    accessToken: string;
    refreshToken: string;
    email: string;
    expires_in: number;
  } | {
    success: false;
    error: unknown;
  }
  : never;

type ValidateHookTypes<T extends "google"> = T extends "google" ? {
    accessToken: string;
    refreshToken: string;
    email: string;
  }
  : never;

/** Init Framework App */
export const app2 = <TProvider extends "google">(
  settings: {
    authProvider: {
      name: TProvider;
      clientId: string;
      clientSecret: string;
      redirectPathAfterLogin: string;
      redirectPathAfterLogout: string;
      afterLoginHook?: (
        loginResult: AfterLoginHookTypes<TProvider>,
      ) => Promise<void> | void;
      beforeLogoutHook?: (
        logoutInfo: BeforeLogoutHookTypes<TProvider>,
      ) => Promise<void> | void;
      refreshHook?: (
        refreshResult: RefreshHookTypes<TProvider>,
      ) => Promise<void> | void;
      validateHook?: (
        validateInfo: ValidateHookTypes<TProvider>,
      ) => Promise<boolean>;
    };
    routes: ReturnType<typeof createRoute>[];
    port: number;
  },
): Deno.HttpServer<Deno.NetAddr> => {
  const app = new Hono<{ Variables: Variables }>({
    strict: true,
  });

  app.use("/auth/login", async (c) => {
    if (settings.authProvider.name === "google") {
      try {
        const url = new URL(c.req.url);
        const code = url.searchParams.get("code");

        if (!code) throw new Error("Missing auth code");

        const params = new URLSearchParams({
          client_id: settings.authProvider.clientId,
          redirect_uri: `${url.origin}/login`,
          client_secret: settings.authProvider.clientSecret,
          scope: "email",
          grant_type: "authorization_code",
          access_type: "offline",
          prompt: "consent",
          code,
        });

        const googleBaseUrl = "https://oauth2.googleapis.com";

        const res = await fetch(
          `${googleBaseUrl}/token`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
            body: params,
          },
        );

        if (res.ok) {
          const responseSchema = v.strictObject({
            access_token: v.string(),
            refresh_token: v.string(),
            id_token: v.string(),
            expires_in: v.number(),
          });
          const tokens = v.parse(responseSchema, await res.json());

          const email = v.parse(
            v.string(),
            decode(tokens.id_token).payload.email,
          );

          const result = {
            success: true,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            email,
            expires_in: tokens.expires_in,
            refresh_token_expires_in: 3600 * 72, // 3 days
          };

          setCookie(c, "access_token", result.accessToken, {
            maxAge: result.expires_in,
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
          });
          setCookie(c, "refresh_token", result.refreshToken, {
            maxAge: result.refresh_token_expires_in,
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
          });
          setCookie(c, "email", result.email, {
            maxAge: result.refresh_token_expires_in,
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
          });

          await settings.authProvider.afterLoginHook?.(
            result as AfterLoginHookTypes<TProvider>,
          );

          return c.redirect(settings.authProvider.redirectPathAfterLogin);
        }
        throw new Error("Failed to login");
      } catch (error) {
        const result = {
          error,
          success: false,
        } as AfterLoginHookTypes<TProvider>;

        await settings.authProvider.afterLoginHook?.(result);

        return c.redirect(settings.authProvider.redirectPathAfterLogin);
      }
    }
    throw new Error("Invalid auth provider");
  });

  app.use("/*", async (c, next) => {
    if (settings.authProvider.name === "google") {
      try {
        const accessToken = getCookie(c, "access_token");
        const refreshToken = getCookie(c, "refresh_token");
        const email = getCookie(c, "email");

        if (!accessToken && refreshToken && email) {
          const params = new URLSearchParams({
            client_id: settings.authProvider.clientId,
            client_secret: settings.authProvider.clientSecret,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          });

          const googleBaseUrl = "https://oauth2.googleapis.com";
          const res = await fetch(
            `${googleBaseUrl}/token`,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              method: "POST",
              body: params,
            },
          );

          if (res.ok) {
            const responseSchema = v.strictObject({
              access_token: v.string(),
              id_token: v.string(),
              expires_in: v.number(),
            });
            const tokens = v.parse(responseSchema, await res.json());

            const result = {
              success: true,
              accessToken: tokens.access_token,
              refreshToken,
              email,
              expires_in: tokens.expires_in,
            };

            setCookie(c, "access_token", result.accessToken, {
              maxAge: result.expires_in,
              httpOnly: true,
              secure: true,
              sameSite: "Lax",
            });

            await settings.authProvider.refreshHook?.(
              result as RefreshHookTypes<TProvider>,
            );
          } else {
            const result = {
              success: false,
              error: new Error("Failed to refresh token"),
            } as RefreshHookTypes<TProvider>;
            await settings.authProvider.refreshHook?.(result);
          }
        }
      } catch (error) {
        const result = {
          success: false,
          error,
        } as RefreshHookTypes<TProvider>;
        await settings.authProvider.refreshHook?.(result);
      }
    }
    await next();
  });

  app.use("/auth/logout", async (c) => {
    if (settings.authProvider.name === "google") {
      try {
        const accessToken = getCookie(c, "access_token");
        const refreshToken = getCookie(c, "refresh_token");
        const email = getCookie(c, "email");

        if (!refreshToken || !accessToken || !email) {
          throw new Error("Missing tokens or email");
        }

        await settings.authProvider.beforeLogoutHook?.({
          refreshToken,
          accessToken,
          email,
        } as BeforeLogoutHookTypes<TProvider>);

        // Clear cookies
        setCookie(c, "access_token", "", {
          maxAge: 0,
          httpOnly: true,
          secure: true,
          sameSite: "Lax",
        });
        setCookie(c, "refresh_token", "", {
          maxAge: 0,
          httpOnly: true,
          secure: true,
          sameSite: "Lax",
        });
        setCookie(c, "email", "", {
          maxAge: 0,
          httpOnly: true,
          secure: true,
          sameSite: "Lax",
        });

        return c.redirect(settings.authProvider.redirectPathAfterLogout);
      } catch (error) {
        console.error("Error during logout:", error);
        return c.redirect(settings.authProvider.redirectPathAfterLogout);
      }
    }
    throw new Error("Invalid auth provider");
  });

  /** Validate Hook */
  app.use("/*", async (c, next) => {
    if (settings.authProvider.name === "google") {
      const accessToken = getCookie(c, "access_token");
      const refreshToken = getCookie(c, "refresh_token");
      const email = getCookie(c, "email");

      if (accessToken && refreshToken && email) {
        try {
          const isValid = await settings.authProvider.validateHook?.({
            accessToken,
            refreshToken,
            email,
          } as ValidateHookTypes<TProvider>);

          if (isValid === false) {
            // Clear all auth cookies if validation fails
            setCookie(c, "access_token", "", {
              maxAge: 0,
              httpOnly: true,
              secure: true,
              sameSite: "Lax",
            });
            setCookie(c, "refresh_token", "", {
              maxAge: 0,
              httpOnly: true,
              secure: true,
              sameSite: "Lax",
            });
            setCookie(c, "email", "", {
              maxAge: 0,
              httpOnly: true,
              secure: true,
              sameSite: "Lax",
            });
            return c.redirect(settings.authProvider.redirectPathAfterLogout);
          }
        } catch (error) {
          console.error("Error in validate hook:", error);
          // Clear cookies on error and redirect
          setCookie(c, "access_token", "", {
            maxAge: 0,
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
          });
          setCookie(c, "refresh_token", "", {
            maxAge: 0,
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
          });
          setCookie(c, "email", "", {
            maxAge: 0,
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
          });
          return c.redirect(settings.authProvider.redirectPathAfterLogout);
        }
      }
    }
    await next();
    return;
  });

  /** Context Variables */
  app.use("/*", async (c, next) => {
    if (settings.authProvider.name === "google") {
      const accessToken = getCookie(c, "access_token");
      const refreshToken = getCookie(c, "refresh_token");
      const email = getCookie(c, "email");

      const url = new URL(c.req.url);

      // Set login URL
      c.set(
        "loginUrl",
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=${settings.authProvider.clientId}&redirect_uri=${url.origin}/auth/login&response_type=code&scope=email&access_type=offline&prompt=consent`,
      );

      // Set logout URL
      c.set("logoutUrl", "/auth/logout");

      // Set isLoggedIn
      c.set("isLoggedIn", !!(accessToken && refreshToken && email));

      // Set email if available
      if (email) {
        c.set("email", email);
      }
    }
    await next();
  });

  /** Static Files */
  app.use(
    "/public/*",
    serveStatic({
      root: `/`,
    }),
  );

  for (const route of settings.routes) {
    app.route("/", route[INTERNAL_APP]);
  }

  /** Hot Reload in development */
  app.get(
    "/ws",
    upgradeWebSocket(() => {
      return {};
    }),
  );

  /** Serve */
  return Deno.serve({
    port: settings.port,
    hostname: "127.0.0.1",
  }, app.fetch);
};
