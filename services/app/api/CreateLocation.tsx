import { createRoute, v } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";

const CreateLocation = () => {
  const context = createLocationRoute.context();
  const result = context.req.valid("form");

  if (!result.success) {
    return <p>Failure</p>;
  }

  return <p>Hello world</p>;
};

const CreateLocationSchema = v.object({
  name: v.pipe(v.string(), v.minLength(3), v.maxLength(50)),
});

export const createLocationRoute = createRoute({
  path: "/api/server/:serverId/create-location",
  component: CreateLocation,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
  formValidationSchema: CreateLocationSchema,
});
