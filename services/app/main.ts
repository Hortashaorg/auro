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

const isPublic = (): boolean => {
  return true;
};

const isDenied = (): boolean => {
  return false;
};

const routes = {
  "/": {
    jsx: Home,
    hasPermission: isPublic,
  },
  "design": {
    jsx: Design,
    hasPermission: isPublic,
  },
  "denied": {
    jsx: Design,
    hasPermission: isDenied,
  },
  404: {
    jsx: NotFound,
    hasPermission: isPublic,
  },
  500: {
    jsx: Error,
    hasPermission: isPublic,
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

  return {
    honoContext: c,
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
