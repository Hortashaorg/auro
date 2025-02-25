import { createRoute, v } from "@kalena/framework";
import { db, PostgresError, schema } from "@package/database";
import { isAdminOfServer } from "@permissions/index.ts";
import { createEvents } from "@comp/utils/events.ts";
import { throwError } from "@package/common";
import { LocationGrid } from "@sections/views/LocationGrid.tsx";

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

  try {
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

    return <LocationGrid hx-swap-oob="true" />;
  } catch (error) {
    if (error instanceof PostgresError) {
      if (
        error.constraint_name === "unique_location_name_per_server"
      ) {
        // Unique constraint violation
        context.header(
          "HX-Trigger",
          createEvents([
            {
              name: "form-error",
              values: {
                name: "A location with this name already exists on this server",
              },
            },
          ]),
        );
        return <p>Failure</p>;
      }
    }
    throw error;
  }
};

const CreateLocationSchema = v.object({
  name: v.pipe(v.string(), v.minLength(3), v.maxLength(50)),
  description: v.optional(v.pipe(
    v.string(),
    v.transform((val) => {
      return val.trim() === "" ? undefined : val;
    }),
  )),
  assetId: v.pipe(v.string(), v.uuid()),
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
