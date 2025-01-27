import { createContext } from "preact";
import { useContext } from "preact/hooks";

export const RenderContext = createContext<null | Record<string, unknown>>(
  null,
);

export const getContext = (): Record<string, unknown> => {
  return useContext(RenderContext) as Record<string, unknown>;
};
