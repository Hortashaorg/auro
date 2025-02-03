import { db } from "@package/database";
import { app, type Context } from "@package/framework";
import { NotFound } from "./pages/404.tsx";
import { Design } from "./pages/Design.tsx";
import { Home } from "./pages/Home.tsx";
import { Error } from "./pages/500.tsx";
import { authCodeLoginLogic, logoutLogic, refreshTokenLogic } from "./auth.ts";
import type { CustomContext } from "@context/index.ts";

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

const customContext = async (c: Context): Promise<CustomContext> => {
  await db.query.server.findFirst({
    where: (server, { eq }) => eq(server.name, "Test"),
  });

  return {
    honoContext: c,
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
  // TODO: LogoutUrl
  // TODO: Hook when user has logged out: Return true or false (success?)

  port: 4000,
});
