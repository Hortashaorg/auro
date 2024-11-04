import { init } from "@package/framework";
import { router } from "./router.ts";

const handler = async (req: Request) => {
  const url = new URL(req.url);
  if (url.pathname === "/favicon.ico") {
    return new Response(null, { status: 404 });
  }
  const result = await router(req);
  return new Response(result, { headers: { "Content-Type": "text/html" } });
};

init(
  {
    port: 4000,
    hostname: "0.0.0.0",
    env: "local",
  },
  handler,
);
