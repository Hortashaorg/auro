import { createRoute, v } from "@kalena/framework";
import { db, schema } from "@package/database";
import { isAdminOfServer } from "@permissions/index.ts";
import { createEvents } from "@comp/utils/events.ts";
import { throwError } from "@package/common";

const CreateLocation = async () => {
  const context = createLocationRoute.context();
  const result = context.req.valid("form");

  if (!result.success) {
    const errorEvents: Record<string, string> = {};

    for (const issue of result.issues) {
      const field: string = issue.path?.[0]?.key as string ??
        throwError("Invalid issue path");
      errorEvents[field] = issue.message;
    }

    context.header(
      "HX-Trigger",
      createEvents([
        {
          name: "form-error",
          values: errorEvents,
        },
      ]),
    );

    return <p>Failure</p>;
  }

  const serverId = context.req.param("serverId");

  await db.insert(schema.location)
    .values({
      name: result.output.name,
      description: result.output.description,
      serverId,
      assetId: result.output.assetId,
    });

  context.header(
    "HX-Trigger",
    createEvents([
      { name: "close-dialog", values: { value: true } },
      { name: "clear-form", values: { value: true } },
    ]),
  );

  return <p>Success</p>;
};

const CreateLocationSchema = v.object({
  name: v.pipe(v.string(), v.minLength(3), v.maxLength(50)),
  description: v.optional(v.string()),
  assetId: v.string(),
});

export const createLocationRoute = createRoute({
  path: "/api/servers/:serverId/create-location",
  component: CreateLocation,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
  formValidationSchema: CreateLocationSchema,
});
