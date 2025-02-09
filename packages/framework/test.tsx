import { type Context, Hono } from "@hono/hono";
import { validator } from "@hono/hono/validator";
import * as v from "@valibot/valibot";
import type { FC } from "@hono/hono/jsx";
import { createContext, useContext } from "@hono/hono/jsx";

export const createRoute = <
  TPath extends string,
  TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(config: {
  path: TPath;
  validationSchema: TSchema;
}) => {
  const app = new Hono();

  type PathContext = Context<Record<string | number | symbol, never>, TPath, {
    out: {
      form: v.SafeParseResult<TSchema>;
    };
  }>;

  const RenderContext = createContext<
    | null
    | PathContext
  >(null);

  app.all(
    "/",
    validator("form", (values) => {
      return v.safeParse(config.validationSchema, values);
    }),
    (c) => {
      return c.html(
        <RenderContext.Provider value={c}>
          <Test />
        </RenderContext.Provider>,
      );
    },
  );

  return {
    app,
    context: () => useContext(RenderContext) as PathContext,
  };
};

const app2 = createRoute({
  path: "/",
  validationSchema: v.object({
    name: v.string(),
  }),
});

export const server = () => {
  const app = new Hono();

  app.route("/", app2.app);

  return Deno.serve({
    port: 4001,
    hostname: "127.0.0.1",
  }, app.fetch);
};

export const Test: FC = () => {
  const form = app2.context().req.valid("form");
  console.log(form);

  return <p>hello world</p>;
};

server();
