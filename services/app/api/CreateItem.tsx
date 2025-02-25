import { createRoute, v } from "@kalena/framework";
import { db, schema } from "@package/database";
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

  await db.insert(schema.item).values({
    name: result.output.name,
    description: result.output.description,
    assetId: result.output.assetId,
    serverId: serverId,
    rarity: result.output.rarity,
    stackable: false,
  });

  context.header(
    "HX-Trigger",
    createEvents([
      { name: "close-dialog", values: { value: true } },
      { name: "clear-form", values: { value: true } },
    ]),
  );

  return <ItemGrid hx-swap-oob="true" />;
};

const CreateItemSchema = v.object({
  name: v.pipe(v.string(), v.minLength(3), v.maxLength(50)),
  description: v.optional(v.pipe(
    v.string(),
    v.transform((val) => {
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
  formValidationSchema: CreateItemSchema,
  hmr: Deno.env.get("ENV") === "local",
});
