import { type Context, Hono } from "@hono/hono";
import { validator } from "@hono/hono/validator";
import * as v from "@valibot/valibot";
import type { FC } from "@hono/hono/jsx";
import { createContext, useContext } from "@hono/hono/jsx";

type BaseSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;
// Define the route configuration type
type RouteConfig<TPath extends string, TFormValidation extends BaseSchema> = {
  path: TPath;
  formValidationSchema: TFormValidation;
};

// Define custom environment type for the validation result
type ValidatedInput<T extends BaseSchema> = {
  in: {
    form: unknown;
  };
  out: {
    form: v.SafeParseResult<T>;
  };
};

export const createRoute = <
  TPath extends string,
  TFormValidation extends BaseSchema,
>(config: RouteConfig<TPath, TFormValidation>) => {
  // Create a new Hono instance with the validated environment
  const app = new Hono();

  // Create a strongly typed context
  const RouteContext = createContext<
    Context<
      Record<string | number | symbol, never>,
      TPath,
      ValidatedInput<TFormValidation>
    > | null
  >(null);

  app.all(
    "/",
    validator("form", (values) => {
      return v.safeParse(config.formValidationSchema, values);
    }),
    (c) => {
      return c.html(
        <RouteContext.Provider value={c}>
          <Home />
        </RouteContext.Provider>,
      );
    },
  );

  return {
    app,
    context: () => {
      const ctx = useContext(RouteContext);
      if (!ctx) throw new Error("Route context must be used within a route");
      return ctx;
    },
  };
};

const homeRoute = createRoute({
  path: "/",
  formValidationSchema: v.object({
    name: v.string(),
  }),
});

export const server = () => {
  const app = new Hono();

  app.route("/", homeRoute.app);

  return Deno.serve({
    port: 4001,
    hostname: "127.0.0.1",
  }, app.fetch);
};

export const Home: FC = () => {
  const form = homeRoute.context().req.valid("form");
  if (form.success) {
    form.output.name;
    console.log(form.output.name);
  }

  return <p>Home page</p>;
};

server();
