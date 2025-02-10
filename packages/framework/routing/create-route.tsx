import { type Context, Hono } from "@hono/hono";
import { validator } from "@hono/hono/validator";
import * as v from "@valibot/valibot";
import { createContext, type FC, useContext } from "@hono/hono/jsx";
import type { HtmlEscapedString } from "@hono/hono/utils/html";

type BaseSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;

type RouteContext<TPath extends string, TFormValidation extends BaseSchema> =
  Context<
    Record<string | number | symbol, never>,
    TPath,
    ValidatedInput<TFormValidation>
  >;

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

type ValidatedInput<T extends BaseSchema> = {
  in: {
    form: unknown;
  };
  out: {
    form: v.SafeParseResult<T>;
  };
};

export type ExtractContextFromRoute<T extends ReturnType<typeof createRoute>> =
  ReturnType<
    T["context"]
  >;

export const INTERNAL_APP = Symbol("_app");

export const createRoute = <
  TPath extends string,
  TFormValidation extends BaseSchema,
  TCustomContext extends (
    c: RouteContext<TPath, TFormValidation>,
  ) => unknown | Promise<unknown> = () => null,
>(config: RouteConfig<TPath, TFormValidation, TCustomContext>) => {
  const RenderChild: FC<{
    children: () => Promise<HtmlEscapedString> | HtmlEscapedString;
  }> = async ({ children }): Promise<HtmlEscapedString> => {
    const result = await children();
    return result;
  };

  const app = new Hono();

  const RouteContext = createContext<
    RouteContext<TPath, TFormValidation> | null
  >(null);

  app.all(
    config.path,
    validator("form", (values) => {
      return v.safeParse(config.formValidationSchema, values);
    }),
    (c) => {
      const hmrScript = `
        const ws = new WebSocket('ws://' + location.host + '/ws');
        ws.onclose = () => setInterval(() => location.reload(), 200);
      `;

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
    [INTERNAL_APP]: app,
    context: () => {
      const ctx = useContext(RouteContext);
      if (!ctx) throw new Error("Unable to generate context");
      return ctx;
    },
    customContext: async () => {
      const ctx = useContext(RouteContext);
      if (!ctx) throw new Error("Unable to generate context");
      const res = config.customContext ? await config.customContext(ctx) : null;
      return res as Awaited<ReturnType<TCustomContext>>;
    },
  };
};
