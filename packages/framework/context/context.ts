import type { Context } from "hono";
import { createContext } from "preact";
import { useContext } from "preact/hooks";
export const RenderContext = createContext<null | Context>(null);

export const getContext = () => {
  return useContext(RenderContext) as Context;
};
