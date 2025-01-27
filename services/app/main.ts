import { getAccount } from "@package/database";
import { app } from "@package/framework";
import { NotFound } from "./pages/404.tsx";
import { Design } from "./pages/Design.tsx";
import { Home } from "./pages/Home.tsx";

// Routes should probebly contains both component + permission shield to be validated.
// eg. isAdmin, isUser, isLoggedIn, isLoggedOut, etc
const routes = {
  "/": Home,
  "design": Design,
  404: NotFound,
} as const;

app({
  routes: routes,
  customContext: async (_c) => {
    const user = await getAccount("eidemartin_303@hotmail.com");

    return {
      email: user?.email,
    };
  },
  // TODO: Authorization Code (Login): Return Access Token + Refresh Token
  // TODO: Refresh: Return Access Token + Refresh Token
  // TODO: Check Valid Access Token: Return true or false
  // TODO: Check Valid Refresh Token: Return true or false
  // TODO: LogoutUrl
  // TODO: LoginUrl
  // TODO: Hook when user has logged out: Return true or false (success?)

  port: 4000,
});
