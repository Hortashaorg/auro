import { Hono } from "hono";
import { serveStatic, upgradeWebSocket } from "hono/deno";
import type { JSX } from "preact";
import { renderToStringAsync } from "preact-render-to-string";

const render = async (component: JSX.Element, hmr: boolean) => {
  const html = await renderToStringAsync(component);
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

export const app = (routes: Record<string, () => JSX.Element>, settings: {
  port: number;
  hostname: string;
  prod?: boolean;
}) => {
  const app = new Hono();

  //** Middleware */
  /*
  app.use(async (c, next) => {
    setContext(10);
    await next();
  });
  */

  /** Rendering */
  for (const [path, component] of Object.entries(routes)) {
    app.get(path, (c) => {
      return c.html(render(component(), !settings.prod));
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
    app.notFound((c) => {
      return c.html(render(notFound(), !settings.prod));
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
    hostname: settings.hostname,
  }, app.fetch);
};
