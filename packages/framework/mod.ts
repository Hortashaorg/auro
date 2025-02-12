export { app2 } from "./server/app.tsx";
export { getGlobalContext } from "./context/global-context.tsx";
export type { JSX } from "@hono/hono/jsx";
export * as v from "@valibot/valibot";
export {
  createRoute,
  type ExtractContextFromRoute,
  type ExtractCustomContextFromRoute,
} from "./routing/create-route.tsx";
