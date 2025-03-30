import { createRoute, v } from "@kalena/framework";
import { db, PostgresError, schema } from "@package/database";
import { isAdminOfServer } from "@permissions/index.ts";
import { createEvents } from "@comp/utils/events.ts";
import { throwError } from "@package/common";
import { ItemGrid } from "@sections/views/ItemGrid.tsx";

const CreateItem = async () => {
  const context = createItemRoute.context();
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
    await db.insert(schema.item)
      .values({
        name: result.output.name,
        description: result.output.description,
        serverId,
        assetId: result.output.assetId,
        rarity: result.output.rarity,
        stackable: false,
      });

    context.header(
      "HX-Trigger",
      createEvents([
        { name: "dialog-close", values: { value: true } },
        { name: "form-clear", values: { value: true } },
      ]),
    );

    return <ItemGrid hx-swap-oob="true" />;
  } catch (error) {
    if (error instanceof PostgresError) {
      if (
        error.constraint_name === "unique_item_name_per_server"
      ) {
        // Unique constraint violation
        context.header(
          "HX-Trigger",
          createEvents([
            {
              name: "form-error",
              values: {
                name: "An item with this name already exists on this server",
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

const CreateItemSchema = v.object({
  name: v.pipe(v.string(), v.minLength(3), v.maxLength(50)),
  description: v.optional(v.pipe(
    v.string(),
    v.transform((val: string) => {
      return val.trim() === "" ? undefined : val;
    }),
  )),
  assetId: v.pipe(v.string(), v.uuid()),
  rarity: v.union([
    v.literal("common"),
    v.literal("uncommon"),
    v.literal("rare"),
    v.literal("epic"),
    v.literal("legendary"),
  ], "Invalid rarity"),
});

export const createItemRoute = createRoute({
  path: "/api/servers/:serverId/create-item",
  component: CreateItem,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
  formValidationSchema: CreateItemSchema,
});
