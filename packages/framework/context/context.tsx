import type { Child, FC } from "@hono/hono/jsx";
import type { HtmlEscapedString } from "@hono/hono/utils/html";
import { RenderContext } from "./context.ts";

const RenderChild: FC<{
  children: () => Promise<Child> | Child;
}> = async ({ children }): Promise<HtmlEscapedString> => {
  const result = await children();
  return result as HtmlEscapedString;
};

export const Render: FC<{
  context: Record<string, unknown>;
  children: () => Promise<Child> | Child;
  addHmrScript: boolean;
}> = ({ context, children, addHmrScript }) => {
  const hmrScript = `
      const ws = new WebSocket('ws://' + location.host + '/ws');
      ws.onclose = () => setInterval(() => location.reload(), 200);
  `;

  return (
    <RenderContext.Provider value={context}>
      <RenderChild children={children} />
      <script dangerouslySetInnerHTML={{ __html: hmrScript }} />
      {addHmrScript && (
        <script dangerouslySetInnerHTML={{ __html: hmrScript }} />
      )}
    </RenderContext.Provider>
  );
};
