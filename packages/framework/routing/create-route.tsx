import { type Context, Hono } from "@hono/hono";
import { validator } from "@hono/hono/validator";
import * as v from "@valibot/valibot";
import { createContext, useContext } from "@hono/hono/jsx";
import type { HtmlEscapedString } from "@hono/hono/utils/html";
import { GlobalContext } from "../context/global-context.tsx";
import {
  hmrScript,
  INTERNAL_APP,
  RenderChild,
  type Variables,
} from "../common/index.ts";

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
  {
    Variables: Variables;
  },
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
  permission: {
    check: (
      c: TContextType,
    ) => Promise<boolean> | boolean;
    redirectPath: string;
  };
  customContext?: (
    c: TContextType,
  ) => TCustomContextReturnType;
  component: () => Promise<HtmlEscapedString> | HtmlEscapedString;
  partial: boolean;
  hmr: boolean;
}): {
  [INTERNAL_APP]: Hono;
  context: () => TContextType;
  customContext: () => Promise<
    TCustomContextReturnType extends undefined ? null
      : TCustomContextReturnType
  >;
} => {
  // Create a new Hono app instance.
  const app = new Hono();

  // Create a context for the route.
  const RouteContext = createContext<
    TContextType | null
  >(null);

  const {
    formValidationSchema,
    cookieValidationSchema,
    headerValidationSchema,
    jsonValidationSchema,
    paramValidationSchema,
    queryValidationSchema,
  } = config;

  const validators = [
    formValidationSchema
      ? validator("form", (values) => v.safeParse(formValidationSchema, values))
      : undefined,
    cookieValidationSchema
      ? validator(
        "cookie",
        (values) => v.safeParse(cookieValidationSchema, values),
      )
      : undefined,
    headerValidationSchema
      ? validator(
        "header",
        (values) => v.safeParse(headerValidationSchema, values),
      )
      : undefined,
    jsonValidationSchema
      ? validator("json", (values) => v.safeParse(jsonValidationSchema, values))
      : undefined,
    paramValidationSchema
      ? validator(
        "param",
        (values) => v.safeParse(paramValidationSchema, values),
      )
      : undefined,
    queryValidationSchema
      ? validator(
        "query",
        (values) => v.safeParse(queryValidationSchema, values),
      )
      : undefined,
  ].filter((v) => v !== undefined) as ReturnType<typeof validator>[];
  // Create a new route with the given path.
  app.all(
    config.path,
    ...validators,
    async (c) => {
      // Check permission before rendering
      const hasPermission = await config.permission.check(c as TContextType);
      if (!hasPermission) {
        return c.redirect(config.permission.redirectPath);
      }

      // Provide the context to the route, and render via child component.
      return c.html(
        <RouteContext.Provider
          value={c as TContextType}
        >
          <GlobalContext.Provider
            value={c as Context}
          >
            <RenderChild children={config.component} />
            {(!config.partial && config.hmr) && (
              <script
                dangerouslySetInnerHTML={{ __html: hmrScript }}
              />
            )}
          </GlobalContext.Provider>
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
