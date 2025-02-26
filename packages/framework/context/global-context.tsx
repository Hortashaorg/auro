import { createContext, useContext } from "@hono/hono/jsx";
import type { Context } from "@hono/hono";
import type { Variables } from "../common/index.ts";

/**
 * The type definition for the global context
 */
export type GlobalContextType = Context<{
  Variables: Variables;
}>;

/**
 * The global context
 */
export const GlobalContext = createContext<GlobalContextType | null>(null);

/**
 * Get the global context
 * @returns {GlobalContextType} The global context
 */
export const getGlobalContext = (): Context<{
  Variables: Variables;
}> => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "getGlobalContext must be used within a GlobalContextProvider",
    );
  }
  return context;
};
