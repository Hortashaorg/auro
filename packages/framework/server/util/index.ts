import { renderToStringAsync } from "preact-render-to-string";
import { Render } from "../../context/context.tsx";
import type { JSX } from "preact";

export const isPublic = (path: string): boolean => {
  return path.startsWith("/public/") || path === "/favicon.ico" ||
    path === "/ws";
};

export const render = async (
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
