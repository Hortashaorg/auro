import type { JSX } from "preact";
import { RenderContext } from "./context.ts";

export const Render = (
  context: Record<string, unknown>,
  Child: () => JSX.Element,
) => {
  return (
    <RenderContext.Provider value={context}>
      <Child />
    </RenderContext.Provider>
  );
};
