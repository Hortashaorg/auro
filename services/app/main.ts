import { app } from "@kalena/framework";
import { throwError } from "@package/common";
import { afterLoginHook, beforeLogoutHook, refreshHook } from "./auth.ts";
import * as routes from "./routes/index.ts";
import { ErrorPage404 } from "./errors/ErrorPage404.tsx";
import { ErrorPage500 } from "./errors/ErrorPage500.tsx";
import { increaseAvailableActions } from "@queries/action/increaseAvailableActions.ts";

const clientSecret = Deno.env.get("AUTH_CLIENT_SECRET") ??
  throwError("Missing auth client secret");

const clientId = Deno.env.get("AUTH_CLIENT_ID") ??
  throwError("Missing auth client ID");

const myApp = app({
  authProvider: {
    providerConfig: {
      provider: "keycloak",
      clientId,
      clientSecret,
      realm: "notzure",
      baseUrl: "https://login.kalena.site",
    },
    redirectPathAfterLogin: "/",
    redirectPathAfterLogout: "/",
    afterLoginHook,
    beforeLogoutHook,
    refreshHook,
  },
  routes: [
    ...Object.values(routes),
  ],
  errorPages: {
    notFound: ErrorPage404,
    serverError: ErrorPage500,
  },
});

Deno.cron("Job", "*/5 * * * *", async () => {
  await increaseAvailableActions();
});

Deno.serve({
  port: 4000,
  hostname: "0.0.0.0",
}, myApp.fetch);
