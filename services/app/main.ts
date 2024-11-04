import { init } from "@package/framework";
import { router } from "./router.ts";

const handler = async (req: Request) => {
  const url = new URL(req.url);
  if (url.pathname === "/favicon.ico") {
    // TODO: Favicon and other assets?
    return new Response(null, { status: 404 });
  }

  if (url.pathname === "/main.css") {
    const cssFilePath = new URL("./public/main.css", import.meta.url).pathname;
    const css = await Deno.readFile(cssFilePath);
    return new Response(css, {
      headers: { "Content-Type": "text/css" },
    });
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
