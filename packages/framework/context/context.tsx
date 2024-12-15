import type { Context } from "hono";
import type { JSX } from "preact";
import { RenderContext } from "./context.ts";

export const Render = (context: Context, Child: () => JSX.Element) => {
  return (
    <RenderContext.Provider value={context}>
      <Child />
    </RenderContext.Provider>
  );
};
