import { init } from "@package/framework";
import { router } from "./router.ts";

const handler = async (req: Request) => {
  const url = new URL(req.url);
  if (url.pathname === "/favicon.ico") {
    // TODO: Favicon and other assets?
    return new Response(null, { status: 404 });
  }

  const extensions = [".css", ".js", ".ico", ".svg"];

  if (
    extensions.some((ext) => url.pathname.endsWith(ext))
  ) {
    const cssFilePath =
      new URL(`./public${url.pathname}`, import.meta.url).pathname;
    const css = await Deno.readFile(cssFilePath);
    return new Response(css);
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
