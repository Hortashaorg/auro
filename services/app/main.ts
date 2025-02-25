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
import { createActionRoute } from "@api/CreateAction.tsx";
import { resourcesRoute } from "@pages/server/admin/resources.tsx";
import { createResourceRoute } from "@api/CreateResource.tsx";
import { itemsRoute } from "@pages/server/admin/items.tsx";
import { createItemRoute } from "@api/CreateItem.tsx";

const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET") ??
  throwError("Missing Google client secret");

const clientId = Deno.env.get("GOOGLE_CLIENT_ID") ??
  throwError("Missing Google client ID");

const myApp = app({
  authProvider: {
    name: "google",
    clientId,
    clientSecret,
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
    createActionRoute,
    resourcesRoute,
    createResourceRoute,
    itemsRoute,
    createItemRoute,
  ],
  port: 4000,
  errorPages: {
    notFound: ErrorPage404,
    serverError: ErrorPage500,
  },
});

Deno.serve({
  port: 4000,
  hostname: "127.0.0.1",
}, myApp.fetch);
