import { createRoute, v } from "@kalena/framework";
import { db, PostgresError, schema } from "@package/database";
import { isAdminOfGame } from "@permissions/index.ts";
import { createEvents } from "@comp/utils/events.ts";
import { throwError } from "@package/common";
import { ActionGrid } from "./ActionGrid.section.tsx";

const CreateAction = async () => {
  const context = createActionRoute.context();
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

  const gameId = context.req.param("gameId");

  try {
    await db.insert(schema.action)
      .values({
        name: result.output.name,
        description: result.output.description,
        gameId,
        assetId: result.output.assetId,
        locationId: result.output.locationId ??
          throwError("Location ID is required"),
        cooldownMinutes: result.output.cooldownMinutes,
        repeatable: result.output.repeatable === "true",
      });

    context.header(
      "HX-Trigger",
      createEvents([
        { name: "dialog-close", values: { value: true } },
        { name: "form-clear", values: { value: true } },
      ]),
    );

    return <ActionGrid hx-swap-oob="true" />;
  } catch (error) {
    if (error instanceof PostgresError) {
      if (
        error.constraint_name === "unique_action_name_per_game"
      ) {
        // Unique constraint violation
        context.header(
          "HX-Trigger",
          createEvents([
            {
              name: "form-error",
              values: {
                name: "An action with this name already exists on this game",
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

const CreateActionSchema = v.object({
  name: v.pipe(v.string(), v.minLength(3), v.maxLength(50)),
  description: v.optional(v.pipe(
    v.string(),
    v.transform((val: string) => {
      return val.trim() === "" ? undefined : val;
    }),
  )),
  assetId: v.pipe(v.string(), v.uuid()),
  locationId: v.optional(v.pipe(v.string(), v.uuid())),
  cooldownMinutes: v.pipe(
    v.string(),
    v.transform((val: string) => parseInt(val, 10)),
    v.number(),
    v.minValue(0),
  ),
  repeatable: v.union([v.literal("true"), v.literal("false")]),
});

export const createActionRoute = createRoute({
  path: "/api/games/:gameId/admin/actions/create-action",
  component: CreateAction,
  permission: {
    check: isAdminOfGame,
    redirectPath: "/games",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
  formValidationSchema: CreateActionSchema,
});
