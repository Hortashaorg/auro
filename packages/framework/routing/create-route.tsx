import { type Context, Hono } from "@hono/hono";
import { validator } from "@hono/hono/validator";
import * as v from "@valibot/valibot";
import { createContext, type FC, useContext } from "@hono/hono/jsx";
import type { HtmlEscapedString } from "@hono/hono/utils/html";

// Valibot unknown schema.
type BaseSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;

// Helper to define hono context type for specific route
type RouteContext<TPath extends string, TFormValidation extends BaseSchema> =
  Context<
    Record<string | number | symbol, never>,
    TPath,
    ValidatedInput<TFormValidation>
  >;

// Validation types provided the valibot schema
type ValidatedInput<T extends BaseSchema> = {
  in: {
    form: unknown;
  };
  out: {
    form: v.SafeParseResult<T>;
  };
};

// Helper to extract context from route
export type ExtractContextFromRoute<T extends ReturnType<typeof createRoute>> =
  ReturnType<
    T["context"]
  >;

// Helper to extract custom context from route
export type ExtractCustomContextFromRoute<
  T extends ReturnType<typeof createRoute>,
> = ReturnType<
  T["customContext"]
>;

// Internal app instance, used by framework, unavailable package user
export const INTERNAL_APP = Symbol("_app");

// createRoute config input with generics
type RouteConfig<
  TPath extends string,
  TFormValidation extends BaseSchema,
  TCustomContext extends (
    c: RouteContext<TPath, TFormValidation>,
  ) => unknown | Promise<unknown>,
> = {
  path: TPath;
  formValidationSchema: TFormValidation;
  hasPermission: (c: RouteContext<TPath, TFormValidation>) => boolean;
  customContext?: TCustomContext;
  component: () => Promise<HtmlEscapedString> | HtmlEscapedString;
  partial: boolean;
  hmr: boolean;
};
// Create a route with the given config
export const createRoute = <
  TPath extends string,
  TFormValidation extends BaseSchema,
  TCustomContext extends (
    c: RouteContext<TPath, TFormValidation>,
  ) => unknown | Promise<unknown> = () => null,
>(config: RouteConfig<TPath, TFormValidation, TCustomContext>) => {
  // Must be rendered inside of child component in order to make context available.
  const RenderChild: FC<{
    children: () => Promise<HtmlEscapedString> | HtmlEscapedString;
  }> = async ({ children }): Promise<HtmlEscapedString> => {
    const result = await children();
    return result;
  };

  // Create a new Hono app instance.
  const app = new Hono();

  // Create a context for the route.
  const RouteContext = createContext<
    RouteContext<TPath, TFormValidation> | null
  >(null);

  // Create a new route with the given path.
  app.all(
    config.path,
    validator("form", (values) => {
      return v.safeParse(config.formValidationSchema, values);
    }),
    (c) => {
      // HMR script development purposes only.
      const hmrScript = `
        const ws = new WebSocket('ws://' + location.host + '/ws');
        ws.onclose = () => setInterval(() => location.reload(), 200);
      `;

      // Provide the context to the route, and render via child component.
      return c.html(
        <RouteContext.Provider value={c}>
          <RenderChild children={config.component} />
          {(!config.partial && config.hmr) && (
            <script
              dangerouslySetInnerHTML={{ __html: hmrScript }}
            />
          )}
        </RouteContext.Provider>,
      );
    },
  );

  return {
    // Internal app instance, used by framework, unavailable package user
    [INTERNAL_APP]: app,
    // Helper to extract context from route
    context: () => {
      const ctx = useContext(RouteContext);
      if (!ctx) throw new Error("Unable to generate context");
      return ctx;
    },
    // Helper to extract custom context from route, defined by package user
    customContext: async () => {
      const ctx = useContext(RouteContext);
      if (!ctx) throw new Error("Unable to generate context");
      const res = config.customContext ? await config.customContext(ctx) : null;
      return res as Awaited<ReturnType<TCustomContext>>;
    },
  };
};
