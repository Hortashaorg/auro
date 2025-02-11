import { type Context, Hono } from "@hono/hono";
import { validator } from "@hono/hono/validator";
import * as v from "@valibot/valibot";
import { createContext, type FC, useContext } from "@hono/hono/jsx";
import type { HtmlEscapedString } from "@hono/hono/utils/html";

// Valibot unknown schema.
type BaseSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;

// Helper to define hono context type for specific route
type RouteContext<
  TPath extends string,
  TFormValidation extends BaseSchema | undefined,
  TCookieValidation extends BaseSchema | undefined,
  THeaderValidation extends BaseSchema | undefined,
  TJsonValidation extends BaseSchema | undefined,
  TParamValidation extends BaseSchema | undefined,
  TQueryValidation extends BaseSchema | undefined,
> = Context<
  Record<string | number | symbol, never>,
  TPath,
  {
    in:
      & (TFormValidation extends BaseSchema ? { form: unknown }
        : Record<never, unknown>)
      & (TCookieValidation extends BaseSchema ? { cookie: unknown }
        : Record<never, unknown>)
      & (THeaderValidation extends BaseSchema ? { header: unknown }
        : Record<never, unknown>)
      & (TJsonValidation extends BaseSchema ? { json: unknown }
        : Record<never, unknown>)
      & (TParamValidation extends BaseSchema ? { param: unknown }
        : Record<never, unknown>)
      & (TQueryValidation extends BaseSchema ? { query: unknown }
        : Record<never, unknown>);
    out:
      & (TFormValidation extends BaseSchema
        ? { form: v.SafeParseResult<TFormValidation> }
        : Record<never, unknown>)
      & (TCookieValidation extends BaseSchema
        ? { cookie: v.SafeParseResult<TCookieValidation> }
        : Record<never, unknown>)
      & (THeaderValidation extends BaseSchema
        ? { header: v.SafeParseResult<THeaderValidation> }
        : Record<never, unknown>)
      & (TJsonValidation extends BaseSchema
        ? { json: v.SafeParseResult<TJsonValidation> }
        : Record<never, unknown>)
      & (TParamValidation extends BaseSchema
        ? { param: v.SafeParseResult<TParamValidation> }
        : Record<never, unknown>)
      & (TQueryValidation extends BaseSchema
        ? { query: v.SafeParseResult<TQueryValidation> }
        : Record<never, unknown>);
  }
>;

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

// Create a route with the given config
export const createRoute = <
  TPath extends string,
  TFormValidation extends BaseSchema | undefined = undefined,
  TCookieValidation extends BaseSchema | undefined = undefined,
  THeaderValidation extends BaseSchema | undefined = undefined,
  TJsonValidation extends BaseSchema | undefined = undefined,
  TParamValidation extends BaseSchema | undefined = undefined,
  TQueryValidation extends BaseSchema | undefined = undefined,
  TCustomContextReturnType = undefined,
  TContextType = RouteContext<
    TPath,
    TFormValidation,
    TCookieValidation,
    THeaderValidation,
    TJsonValidation,
    TParamValidation,
    TQueryValidation
  >,
>(config: {
  path: TPath;
  formValidationSchema?: TFormValidation;
  cookieValidationSchema?: TCookieValidation;
  headerValidationSchema?: THeaderValidation;
  jsonValidationSchema?: TJsonValidation;
  paramValidationSchema?: TParamValidation;
  queryValidationSchema?: TQueryValidation;
  hasPermission: (
    c: TContextType,
  ) => boolean;
  customContext?: (
    c: TContextType,
  ) => TCustomContextReturnType;
  component: () => Promise<HtmlEscapedString> | HtmlEscapedString;
  partial: boolean;
  hmr: boolean;
}) => {
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
    TContextType | null
  >(null);

  const validators = [
    validator("form", (values) => {
      return v.safeParse(config.formValidationSchema!, values);
    }),
    validator("cookie", (values) => {
      return v.safeParse(config.cookieValidationSchema!, values);
    }),
    validator("header", (values) => {
      return v.safeParse(config.headerValidationSchema!, values);
    }),
    validator("json", (values) => {
      return v.safeParse(config.jsonValidationSchema!, values);
    }),
    validator("param", (values) => {
      return v.safeParse(config.paramValidationSchema!, values);
    }),
    validator("query", (values) => {
      return v.safeParse(config.queryValidationSchema!, values);
    }),
  ] as const;

  // Create a new route with the given path.
  app.all(
    config.path,
    ...validators,
    (c) => {
      // HMR script development purposes only.
      const hmrScript = `
        const ws = new WebSocket('ws://' + location.host + '/ws');
        ws.onclose = () => setInterval(() => location.reload(), 200);
      `;

      // Provide the context to the route, and render via child component.
      return c.html(
        <RouteContext.Provider
          value={c as TContextType}
        >
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
      return res as TCustomContextReturnType extends undefined ? null
        : TCustomContextReturnType;
    },
  };
};
