import { type Context, Hono, type Next } from "@hono/hono";
import { getCookie, setCookie } from "@hono/hono/cookie";

import { serveStatic, upgradeWebSocket } from "@hono/hono/deno";
import type { JSX } from "preact";
import { renderToStringAsync } from "preact-render-to-string";
import { Render } from "../context/context.tsx";
import { throwError } from "@package/common";

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
    routes: Record<string, {
      jsx: () => JSX.Element;
      hasPermission: (c: unknown) => boolean;
    }>;
    redirectNoAccess: string;
    redirectAfterLogin: string;
    redirectAfterLogout: string;
    customContext: (
      context: Context,
      accessToken?: string,
      refreshToken?: string,
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
    logoutUrl: string;
    logoutLogic: (context: Context) => Promise<{ success: boolean }>;
    prod?: boolean;
    // deno-lint-ignore no-explicit-any
    validateUser: (customContext: any) => Promise<boolean>;
  },
): Deno.HttpServer<Deno.NetAddr> => {
  const app = new Hono();

  /** Auth Code Login */
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

        return c.redirect(settings.redirectAfterLogin);
      } else {
        throw new Error("Failed to login");
      }
    }
    throw new Error("Already logged in");
  });

  /** Logout */
  app.use(settings.logoutUrl, async (c: Context) => {
    if (settings.logoutLogic) {
      const result = await settings.logoutLogic(c);
      if (result.success) {
        // Clear cookies
        setCookie(c, "access_token", "", {
          maxAge: 0,
        });
        setCookie(c, "refresh_token", "", {
          maxAge: 0,
        });
        return c.redirect(settings.redirectAfterLogout);
      }
    }
    throw new Error("Failed to logout");
  });

  /** Refresh access token */
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

  /** Set User Context*/
  app.use("/*", async (c: Context, next: Next) => {
    if (isPublic(c.req.path)) {
      await next();
      return;
    }

    const accessToken = getCookie(c, "access_token");
    const refreshToken = getCookie(c, "refresh_token");

    c.env.userContext = await settings.customContext(
      c,
      accessToken,
      refreshToken,
    );

    await next();
  });

  /** Validate User*/
  app.use("/*", async (c: Context, next: Next) => {
    if (
      isPublic(c.req.path) ||
      c.req.path === settings.redirectAfterLogout &&
        !getCookie(c, "access_token")
    ) {
      await next();
      return;
    }
    const isValid = await settings.validateUser(c.env.userContext);
    if (!isValid) {
      setCookie(c, "access_token", "", {
        maxAge: 0,
      });
      setCookie(c, "refresh_token", "", {
        maxAge: 0,
      });
      return c.redirect(settings.redirectAfterLogout);
    }
    await next();
    return;
  });

  /** Access Control */
  app.use("/*", async (c: Context, next: Next) => {
    if (isPublic(c.req.path)) {
      await next();
      return;
    }

    const renderRoutes = Object.keys(
      settings.routes,
    );

    const routeNames = renderRoutes.filter((renderRoute) =>
      c.req.matchedRoutes.some((matchedRoute) =>
        matchedRoute.path === renderRoute ||
        matchedRoute.path === `/${renderRoute}`
      )
    );

    if (routeNames.length === 1) {
      const routeName = routeNames[0] ?? throwError("Assert Route Name");
      const route = settings.routes[routeName] ?? throwError("Assert Route");

      const hasPermission = route.hasPermission(c.env.userContext);

      if (hasPermission) {
        await next();
        return;
      } else {
        return c.redirect(settings.redirectNoAccess);
      }
    }
    throw new Error("There should only be one route");
  });

  /** Rendering */
  for (const [path, component] of Object.entries(settings.routes)) {
    if (path === "500" || path === "404") {
      continue;
    }

    app.get(path, (c: Context) => {
      return c.html(render(component.jsx, !settings.prod, c.env.userContext));
    });
  }

  /** Static Files */
  app.use(
    "/public/*",
    serveStatic({
      root: `/`,
    }),
  );

  /** Not Found */
  if (settings.routes["404"]) {
    const notFound = settings.routes["404"];
    app.notFound((c: Context) => {
      return c.html(render(notFound.jsx, !settings.prod, c.env.userContext));
    });
  }

  /** Error */
  if (settings.routes["500"]) {
    const onError = settings.routes["500"];

    app.onError(async (err, c) => {
      console.error("Error on request", err);
      const userContext = await settings.customContext(c);
      return c.html(render(onError.jsx, !settings.prod, userContext));
    });
  }

  /** Hot Reload in development */
  if (!settings.prod) {
    app.get(
      "/ws",
      upgradeWebSocket(() => {
        return {};
      }),
    );
  }

  /** Serve */
  return Deno.serve({
    port: settings.port,
    hostname: "127.0.0.1",
  }, app.fetch);
};
