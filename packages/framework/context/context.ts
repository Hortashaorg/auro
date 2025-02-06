import { createContext, useContext } from "@hono/hono/jsx";

export const RenderContext = createContext<null | Record<string, unknown>>(
  null,
);

export const getContext = (): Record<string, unknown> => {
  return useContext(RenderContext) as Record<string, unknown>;
};
