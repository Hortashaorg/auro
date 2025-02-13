import { createContext, useContext } from "@hono/hono/jsx";
import type { Context } from "@hono/hono";
import type { Variables } from "../routing/create-route.tsx";

export const GlobalContext = createContext<
  Context<{
    Variables: Variables;
  }> | null
>(null);

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
