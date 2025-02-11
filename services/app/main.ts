import { db, type schema } from "@package/database";
import { app, app2, type GeneralContext } from "@package/framework";
import { hashString, throwError } from "@package/common";
import { NotFound } from "@pages/404.tsx";
import { designRoute } from "@pages/Design.tsx";
import { Home } from "@pages/Home.tsx";
import { Error } from "@pages/500.tsx";
import { Servers } from "@pages/Servers.tsx";
import {
  authCodeLoginLogic,
  logoutLogic,
  refreshTokenLogic,
  validateHook,
} from "./auth.ts";
import type { CustomContext } from "@context/index.ts";
import { CreateServer, CreateServerSchema } from "@api/CreateServer.tsx";
import { isPublic } from "@permissions/index.ts";

const isLoggedIn = (c: CustomContext): boolean => {
  return !!c.account;
};

const routes = {
  "/": {
    jsx: Home,
    hasPermission: isPublic,
    partial: false,
  },
  "/servers": {
    jsx: Servers,
    hasPermission: isLoggedIn,
    partial: false,
  },
  404: {
    jsx: NotFound,
    hasPermission: isPublic,
    partial: false,
  },
  500: {
    jsx: Error,
    hasPermission: isPublic,
    partial: false,
  },
  "/api/create-server": {
    jsx: CreateServer,
    hasPermission: isLoggedIn,
    formValidationSchema: CreateServerSchema,
    partial: false,
  },
} as const;

const customContext = async (
  c: GeneralContext,
  accessToken?: string,
): Promise<CustomContext> => {
  let account: typeof schema.account.$inferSelect | undefined;
  let session: typeof schema.session.$inferSelect | undefined;

  if (accessToken) {
    const accessTokenHash = await hashString(accessToken);

    const loginSession = await db.query.session.findFirst({
      where: (session, { eq }) => eq(session.accessTokenHash, accessTokenHash),
      with: {
        account: true,
      },
    });

    if (loginSession) {
      account = loginSession.account;
      session = loginSession;
    }
  }

  const url = new URL(c.req.url);

  return {
    req: c.req,
    url,
    account,
    session,
  };
};

app({
  routes,
  redirectNoAccess: "/",
  redirectAfterLogin: "/",
  redirectAfterLogout: "/",
  authCodeLoginUrl: "/login",
  logoutUrl: "/logout",
  customContext,
  authCodeLoginLogic,
  refreshTokenLogic,
  logoutLogic,
  validateHook,
  port: 4000,
});

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
    afterLoginHook: (loginResult) => {
      console.log(loginResult);
    },
    beforeLogoutHook: (logoutInfo) => {
      console.log(logoutInfo);
    },
  },
  routes: [
    designRoute,
  ],
  port: 4001,
});
