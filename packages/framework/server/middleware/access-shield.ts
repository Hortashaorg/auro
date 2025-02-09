import type { Context, Next } from "@hono/hono";
import { isPublic } from "../util/index.ts";
import { throwError } from "@package/common";
import type { Child } from "@hono/hono/jsx";
import type * as v from "@valibot/valibot";

export const accessShieldMiddleware = (
  routes: Record<string, {
    jsx: () => Promise<Child> | Child;
    // deno-lint-ignore no-explicit-any
    hasPermission: (c: any) => boolean;
    formValidationSchema?: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;
    partial: boolean;
  }>,
  redirectNoAccess: string,
) => {
  return async (c: Context, next: Next) => {
    if (isPublic(c.req.path)) {
      await next();
      return;
    }

    const renderRoutes = Object.keys(
      routes,
    );

    const routeNames = renderRoutes.filter((renderRoute) =>
      c.req.matchedRoutes.some((matchedRoute) =>
        matchedRoute.path === renderRoute ||
        matchedRoute.path === `/${renderRoute}`
      )
    );

    if (routeNames.length === 1) {
      const routeName = routeNames[0] ?? throwError("Assert Route Name");
      const route = routes[routeName] ?? throwError("Assert Route");
      const hasPermission = route.hasPermission(c.var.customContext);

      if (hasPermission) {
        await next();
        return;
      } else {
        return c.redirect(redirectNoAccess);
      }
    } else if (routeNames.length < 1) {
      await next();
      return;
    }
    throw new Error("There should only be one route");
  };
};
