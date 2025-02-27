import type { Context } from "@hono/hono";
import type { Variables } from "../common/index.ts";
import { AsyncLocalStorage } from "node:async_hooks";

/**
 * The type definition for the global context
 */
export type GlobalContextType = Context<{
  Variables: Variables;
}>;

/**
 * The global context
 */
export const globalContext = new AsyncLocalStorage<GlobalContextType>();

/**
 * Get the global context
 * @returns {GlobalContextType} The global context
 */
export const getGlobalContext = (): Context<{
  Variables: Variables;
}> => {
  const context = globalContext.getStore();
  if (!context) {
    throw new Error(
      "getGlobalContext must be used within a GlobalContextProvider",
    );
  }
  return context;
};
