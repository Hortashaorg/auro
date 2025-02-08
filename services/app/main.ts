import { db, type schema } from "@package/database";
import { app, type Context } from "@package/framework";
import { NotFound } from "./pages/404.tsx";
import { Design } from "./pages/Design.tsx";
import { Home } from "./pages/Home.tsx";
import { Error } from "./pages/500.tsx";
import {
  authCodeLoginLogic,
  logoutLogic,
  refreshTokenLogic,
  validateHook,
} from "./auth.ts";
import type { CustomContext } from "@context/index.ts";
import { hashString } from "@package/common";
import { Servers } from "./pages/Servers.tsx";

const isPublic = (): boolean => {
  return true;
};

const isDenied = (): boolean => {
  return false;
};

const isLoggedIn = (c: CustomContext): boolean => {
  return !!c.account;
};

const routes = {
  "/": {
    jsx: Home,
    hasPermission: isPublic,
    partial: false,
  },
  "/design": {
    jsx: Design,
    hasPermission: isPublic,
    partial: false,
  },
  "/servers": {
    jsx: Servers,
    hasPermission: isLoggedIn,
    partial: false,
  },
  "/denied": {
    jsx: Design,
    hasPermission: isDenied,
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
} as const;

const customContext = async (
  c: Context,
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
