import type { FC } from "@hono/hono/jsx";
import type { HtmlEscapedString } from "@hono/hono/utils/html";
import { trace } from "@opentelemetry/api";

export const RenderChild: FC<{
  children: () => Promise<HtmlEscapedString> | HtmlEscapedString;
}> = async ({ children }): Promise<HtmlEscapedString> => {
  const result = await children();
  return result;
};

// Internal app instance, used by framework, unavailable package user
export const INTERNAL_APP = Symbol("_app");

export type Variables = {
  loginUrl: string;
  logoutUrl: string;
  isLoggedIn: boolean;
  email?: string;
};

export const hmrScript = `
const ws = new WebSocket('ws://' + location.host + '/ws');
ws.onclose = () => setInterval(() => location.reload(), 200);
`;

export const tracer = trace.getTracer("@kalena/framework", "0.1.7");
