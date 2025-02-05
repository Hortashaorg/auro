import { type Context, Hono } from "@hono/hono";

import { serveStatic, upgradeWebSocket } from "@hono/hono/deno";
import { loginMiddleware } from "./middleware/login.ts";
import { logoutMiddleware } from "./middleware/logout.ts";
import { refreshMiddleware } from "./middleware/refresh.ts";
import { customContextMiddleware } from "./middleware/custom-context.ts";
import { validateHookMiddleware } from "./middleware/validateHook.ts";
import { accessShieldMiddleware } from "./middleware/access-shield.ts";
import { render } from "./util/index.ts";

/** Init Framework App */
export const app = (
  settings: {
    routes: Parameters<typeof accessShieldMiddleware>[0];
    redirectNoAccess: Parameters<typeof accessShieldMiddleware>[1];
    authCodeLoginLogic: Parameters<typeof loginMiddleware>[0];
    redirectAfterLogin: Parameters<typeof loginMiddleware>[1];
    logoutLogic: Parameters<typeof logoutMiddleware>[0];
    redirectAfterLogout: Parameters<typeof logoutMiddleware>[1];
    refreshTokenLogic: Parameters<typeof refreshMiddleware>[0];
    customContext: Parameters<typeof customContextMiddleware>[0];
    validateHook: Parameters<typeof validateHookMiddleware>[0];
    authCodeLoginUrl: string;
    logoutUrl: string;
    port: number;
    prod?: boolean;
  },
): Deno.HttpServer<Deno.NetAddr> => {
  const app = new Hono();

  /** Static Files */
  app.use(
    "/public/*",
    serveStatic({
      root: `/`,
    }),
  );

  /** Auth Code Login */
  app.use(
    settings.authCodeLoginUrl,
    loginMiddleware(settings.authCodeLoginLogic, settings.redirectAfterLogin),
  );

  /** Logout */
  app.use(
    settings.logoutUrl,
    logoutMiddleware(settings.logoutLogic, settings.redirectAfterLogout),
  );

  /** Refresh access token */
  app.use("/*", refreshMiddleware(settings.refreshTokenLogic));

  /** Set User Context*/
  app.use("/*", customContextMiddleware(settings.customContext));

  /** Validate Hook, after having populated the state.
   * We can hook and do whatever custom validation logic
   */
  app.use("/*", validateHookMiddleware(settings.validateHook));

  /** Access Control */
  app.use(
    "/*",
    accessShieldMiddleware(settings.routes, settings.redirectNoAccess),
  );

  /** Rendering */
  for (const [path, component] of Object.entries(settings.routes)) {
    if (path === "500" || path === "404") {
      continue;
    }

    app.get(path, (c: Context) => {
      return c.html(render(component.jsx, !settings.prod, c.env.userContext));
    });
  }

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
