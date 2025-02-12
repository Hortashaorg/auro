import { app2 } from "@package/framework";
import { throwError } from "@package/common";
import { afterLoginHook, beforeLogoutHook, refreshHook } from "./auth.ts";
import { serversRoute } from "@pages/Servers.tsx";
import { homeRoute } from "@pages/Home.tsx";
import { createServerRoute } from "@api/CreateServer.tsx";

const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET") ??
  throwError("Missing Google client secret");

const clientId = Deno.env.get("GOOGLE_CLIENT_ID") ??
  throwError("Missing Google client ID");

app2({
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
  ],
  port: 4000,
});
