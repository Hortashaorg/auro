import type { FC } from "@hono/hono/jsx";
import type { HtmlEscapedString } from "@hono/hono/utils/html";
import { metrics, trace } from "@opentelemetry/api";

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

export const tracer = trace.getTracer("@kalena/framework", "0.2.1");
const meter = metrics.getMeter("@kalena/framework", "0.2.1");

export const requestCounter = meter.createCounter("route.requests", {
  description: "Counts the number of requests to routes",
  unit: "requests",
});

export const loginCounter = meter.createCounter("auth.login", {
  description: "Counts the number of logins",
  unit: "requests",
});

export const logoutCounter = meter.createCounter("auth.logout", {
  description: "Counts the number of logouts",
  unit: "requests",
});

export const refreshCounter = meter.createCounter("auth.refresh", {
  description: "Counts the number of refreshes",
  unit: "requests",
});
