import { app } from "@kalena/framework";
import { throwError } from "@package/common";
import { afterLoginHook, beforeLogoutHook, refreshHook } from "./auth.ts";
import { serversRoute } from "@pages/Servers.tsx";
import { homeRoute } from "@pages/Home.tsx";
import { createServerRoute } from "@api/CreateServer.tsx";
import { ErrorPage404 } from "@pages/errors/ErrorPage404.tsx";
import { ErrorPage500 } from "@pages/errors/ErrorPage500.tsx";
import { serverRoute } from "@pages/server/Server.tsx";
import { createLocationRoute } from "@api/CreateLocation.tsx";
import { locationsRoute } from "@pages/server/admin/locations.tsx";
import { actionsRoute } from "@pages/server/admin/actions.tsx";
import { actionDetailRoute } from "@pages/server/admin/action.tsx";
import { createActionRoute } from "@api/CreateAction.tsx";
import { resourcesRoute } from "@pages/server/admin/resources.tsx";
import { createResourceRoute } from "@api/CreateResource.tsx";
import { itemsRoute } from "@pages/server/admin/items.tsx";
import { createItemRoute } from "@api/CreateItem.tsx";
import { changeActionResourceRewardsRoute } from "@api/action/ChangeActionResourceRewards.tsx";
import { addActionResourceRewardsRoute } from "@api/action/AddActionResourceRewards.tsx";
import { toggleServerStatusRoute } from "@api/server/ToggleServerStatus.tsx";
import { executeActionRoute } from "@api/action/ExecuteAction.tsx";
import { increaseAvailableActions } from "@queries/increaseAvailableActions.ts";
import { leaderboardRoute } from "@pages/server/player/Leaderboard.tsx";

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
    serversRoute,
    homeRoute,
    createServerRoute,
    serverRoute,
    createLocationRoute,
    locationsRoute,
    actionsRoute,
    actionDetailRoute,
    createActionRoute,
    resourcesRoute,
    createResourceRoute,
    itemsRoute,
    createItemRoute,
    changeActionResourceRewardsRoute,
    addActionResourceRewardsRoute,
    toggleServerStatusRoute,
    executeActionRoute,
    leaderboardRoute,
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
