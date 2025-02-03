import { db } from "@package/database";
import { app } from "@package/framework";
import { NotFound } from "./pages/404.tsx";
import { Design } from "./pages/Design.tsx";
import { Home } from "./pages/Home.tsx";
import { authCodeLoginLogic } from "./auth.ts";

// Routes should probebly contains both component + permission shield to be validated.
// eg. isAdmin, isUser, isLoggedIn, isLoggedOut, etc
const routes = {
  "/": Home,
  "design": Design,
  404: NotFound,
} as const;

const customContext = async () => {
  const server = await db.query.server.findFirst({
    where: (server, { eq }) => eq(server.name, "Test"),
  });

  console.log(server);

  return {
    something: null,
  };
};

app({
  routes: routes,
  customContext,
  authCodeLoginUrl: "/login",
  authCodeLoginLogic,
  // TODO: Refresh: Return Access Token + Refresh Token
  // TODO: Check Valid Access Token: Return true or false
  // TODO: Check Valid Refresh Token: Return true or false
  // TODO: LogoutUrl
  // TODO: Hook when user has logged out: Return true or false (success?)

  port: 4000,
});
