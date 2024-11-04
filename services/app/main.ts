import { init } from "@package/framework";
import { App } from "./test.tsx";
import { renderToStringAsync } from "preact-render-to-string";

const handler = async (_req: Request) => {
  const result = await renderToStringAsync(App());
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
