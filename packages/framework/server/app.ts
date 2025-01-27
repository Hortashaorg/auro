import { type Context, Hono } from "@hono/hono";

import { serveStatic, upgradeWebSocket } from "@hono/hono/deno";
import type { JSX } from "preact";
import { renderToStringAsync } from "preact-render-to-string";
import { Render } from "../context/context.tsx";

const render = async (
  component: () => JSX.Element,
  hmr: boolean,
  context: Record<string, unknown>,
) => {
  const html = await renderToStringAsync(
    Render(context, component),
  );

  if (hmr) {
    return html.replace(
      "</body>",
      `
      <script>
        const ws = new WebSocket('ws://' + location.host + '/ws');
        ws.onclose = () => setInterval(() => location.reload(), 200);
      </script>
      </body>`,
    );
  }
  return html;
};

export const app = (
  routes: Record<string, () => JSX.Element>,
  customContext: (
    context: Context,
  ) => Promise<Record<string, unknown>>,
  settings: {
    port: number;
    prod?: boolean;
  },
): Deno.HttpServer<Deno.NetAddr> => {
  const app = new Hono();

  /** Rendering */
  for (const [path, component] of Object.entries(routes)) {
    app.get(path, async (c) => {
      const userContext = await customContext(c);
      return c.html(render(component, !settings.prod, userContext));
    });
  }

  app.use(
    "/public/*",
    serveStatic({
      root: `/`,
    }),
  );

  if (routes["404"]) {
    const notFound = routes["404"];
    app.notFound(async (c) => {
      const userContext = await customContext(c);
      return c.html(render(notFound, !settings.prod, userContext));
    });
  }

  if (!settings.prod) {
    app.get(
      "/ws",
      upgradeWebSocket(() => {
        return {};
      }),
    );
  }

  return Deno.serve({
    port: settings.port,
    hostname: "127.0.0.1",
  }, app.fetch);
};
