import { createRoute, v } from "@kalena/framework";
import { isAdminOfGame } from "@permissions/index.ts";
import { createEvents } from "@comp/utils/events.ts";
import { throwError } from "@package/common";
import { ItemGrid } from "./ItemGrid.section.tsx";
import { userContext } from "@contexts/userContext.ts";
import { catchConstraintByName, queries } from "@package/database";

const CreateItem = async () => {
  const context = createItemRoute.context();
  const { user } = await createItemRoute.customContext();
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

  const gameId = user.gameId;

  try {
    await queries.items.setItem({
      name: result.output.name,
      description: result.output.description,
      gameId,
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

    return <ItemGrid hx-swap-oob="true" gameId={gameId} />;
  } catch (error) {
    if (
      catchConstraintByName(error, "unique_item_name_per_game")
    ) {
      // Unique constraint violation
      context.header(
        "HX-Trigger",
        createEvents([
          {
            name: "form-error",
            values: {
              name: "An item with this name already exists on this game",
            },
          },
        ]),
      );
      return <p>Failure</p>;
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
  path: "/api/games/:gameId/admin/items/create-item",
  component: CreateItem,
  permission: {
    check: isAdminOfGame,
    redirectPath: "/games",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
  formValidationSchema: CreateItemSchema,
  customContext: userContext,
});
