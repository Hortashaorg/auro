import { type Context, Hono, type Next } from "@hono/hono";
import { getCookie, setCookie } from "@hono/hono/cookie";

import { serveStatic, upgradeWebSocket } from "@hono/hono/deno";
import type { JSX } from "preact";
import { renderToStringAsync } from "preact-render-to-string";
import { Render } from "../context/context.tsx";

const isPublic = (path: string): boolean => {
  return path.startsWith("/public/") || path === "/favicon.ico" ||
    path === "/ws";
};

const render = async (
  component: () => JSX.Element,
  hmr: boolean,
  context: Record<string, unknown>,
) => {
  const html = await renderToStringAsync(
    Render(context, component),
  );

  if (hmr) {
    return html.replace(
      "</body>",
      `
      <script>
        const ws = new WebSocket('ws://' + location.host + '/ws');
        ws.onclose = () => setInterval(() => location.reload(), 200);
      </script>
      </body>`,
    );
  }
  return html;
};

export const app = (
  settings: {
    routes: Record<string, () => JSX.Element>;
    customContext: (
      context: Context,
    ) => Promise<Record<string, unknown>>;
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
    >;
    authCodeLoginUrl: string;
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
    >;
    port: number;
    prod?: boolean;
  },
): Deno.HttpServer<Deno.NetAddr> => {
  const app = new Hono();

  if (settings.authCodeLoginUrl) {
    app.use(settings.authCodeLoginUrl, async (c: Context) => {
      // login endpoint will redirect when after login attempt
      const accessToken = getCookie(c, "access_token");
      const refreshToken = getCookie(c, "refresh_token");

      if (!refreshToken && !accessToken) {
        const result = await settings.authCodeLoginLogic(c);
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

          return c.redirect("/");
        } else {
          throw new Error("Failed to login");
        }
      }
      throw new Error("Already logged in");
    });
  }

  app.use("/*", async (c: Context, next: Next) => {
    if (isPublic(c.req.path)) {
      await next();
      return;
    }

    const accessToken = getCookie(c, "access_token");
    const refreshToken = getCookie(c, "refresh_token");

    if (!accessToken && refreshToken) {
      const result = await settings.refreshTokenLogic(c);

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
  });

  app.use("/*", async (c: Context, next: Next) => {
    if (isPublic(c.req.path)) {
      await next();
      return;
    }

    // Checking if user has access to path

    console.log(c.req.url);
    await next();
  });

  /** Rendering */
  for (const [path, component] of Object.entries(settings.routes)) {
    if (path === "500" || path === "404") {
      continue;
    }

    app.get(path, async (c: Context) => {
      const userContext = await settings.customContext(c);
      return c.html(render(component, !settings.prod, userContext));
    });
  }

  app.use(
    "/public/*",
    serveStatic({
      root: `/`,
    }),
  );

  if (settings.routes["404"]) {
    const notFound = settings.routes["404"];
    app.notFound(async (c: Context) => {
      const userContext = await settings.customContext(c);
      return c.html(render(notFound, !settings.prod, userContext));
    });
  }

  if (settings.routes["500"]) {
    const onError = settings.routes["500"];

    app.onError(async (err, c) => {
      console.error("Error on request", err);
      const userContext = await settings.customContext(c);
      return c.html(render(onError, !settings.prod, userContext));
    });
  }

  if (!settings.prod) {
    app.get(
      "/ws",
      upgradeWebSocket(() => {
        return {};
      }),
    );
  }

  return Deno.serve({
    port: settings.port,
    hostname: "127.0.0.1",
  }, app.fetch);
};
