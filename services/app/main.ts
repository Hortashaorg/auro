import { app } from "@package/framework";
import { NotFound } from "./pages/404.tsx";
import { Home } from "./pages/Home.tsx";

const routes = {
  "/": Home,
  404: NotFound,
} as const;

app(routes, {
  port: 4000,
});
