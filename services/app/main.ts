import { getAccount } from "@package/database";
import { app } from "@package/framework";
import { NotFound } from "./pages/404.tsx";
import { Design } from "./pages/Design.tsx";
import { Home } from "./pages/Home.tsx";

const routes = {
  "/": Home,
  "design": Design,
  404: NotFound,
} as const;

app(routes, async (_c) => {
  const user = await getAccount("eidemartin_303@hotmail.com");

  return {
    email: user?.email,
  };
}, {
  port: 4000,
});
