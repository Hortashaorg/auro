import { renderToStringAsync } from "preact-render-to-string";
import { Home } from "./pages/Home.tsx";
import { NotFound } from "./pages/404.tsx";

const routes = {
  "/": Home(),
  404: NotFound(),
} as const;

export const router = (request: Request) => {
  const pathname = new URL(request.url).pathname as keyof typeof routes;
  console.log("Page requested:", pathname);

  const element = routes[pathname];
  if (element) {
    return renderToStringAsync(routes[pathname]);
  } else {
    return renderToStringAsync(routes["404"]);
  }
};
