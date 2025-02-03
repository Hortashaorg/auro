import { db } from "@package/database";
import { app, type Context } from "@package/framework";
import { NotFound } from "./pages/404.tsx";
import { Design } from "./pages/Design.tsx";
import { Home } from "./pages/Home.tsx";
import { Error } from "./pages/500.tsx";
import { authCodeLoginLogic, refreshTokenLogic } from "./auth.ts";
import type { CustomContext } from "@context/index.ts";

// Routes should probebly contains both component + permission shield to be validated.
// eg. isAdmin, isUser, isLoggedIn, isLoggedOut, etc
const routes = {
  "/": Home,
  "design": Design,
  404: NotFound,
  500: Error,
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
  routes: routes,
  customContext,
  authCodeLoginUrl: "/login",
  authCodeLoginLogic,
  refreshTokenLogic,
  // TODO: Refresh: Return Access Token + Refresh Token
  // TODO: Check Valid Access Token: Return true or false
  // TODO: Check Valid Refresh Token: Return true or false
  // TODO: LogoutUrl
  // TODO: Hook when user has logged out: Return true or false (success?)

  port: 4000,
});
