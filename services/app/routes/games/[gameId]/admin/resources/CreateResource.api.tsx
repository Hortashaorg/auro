import { createRoute, v } from "@kalena/framework";
import { PostgresError } from "@package/database";
import { isAdminOfGame } from "@permissions/index.ts";
import { createEvents } from "@comp/utils/events.ts";
import { throwError } from "@package/common";
import { ResourceGrid } from "./ResourceGrid.section.tsx";
import { userContext } from "@contexts/userContext.ts";
import { createResource } from "@queries/mutations/resources/createResource.ts";

const CreateResource = async () => {
  const context = createResourceRoute.context();
  const { user } = await createResourceRoute.customContext();
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
    await createResource({
      name: result.output.name,
      description: result.output.description,
      gameId: gameId,
      assetId: result.output.assetId,
      leaderboard: result.output.leaderboard,
    });

    context.header(
      "HX-Trigger",
      createEvents([
        { name: "dialog-close", values: { value: true } },
        { name: "form-clear", values: { value: true } },
      ]),
    );

    return <ResourceGrid hx-swap-oob="true" gameId={gameId} />;
  } catch (error) {
    if (error instanceof PostgresError) {
      if (
        error.constraint_name === "unique_resource_name_per_game"
      ) {
        // Unique constraint violation
        context.header(
          "HX-Trigger",
          createEvents([
            {
              name: "form-error",
              values: {
                name: "A resource with this name already exists on this game",
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

const CreateResourceSchema = v.object({
  name: v.pipe(v.string(), v.minLength(3), v.maxLength(50)),
  description: v.optional(v.pipe(
    v.string(),
    v.transform((val: string) => {
      return val.trim() === "" ? undefined : val;
    }),
  )),
  leaderboard: v.pipe(
    v.optional(v.string()),
    v.transform((val) => val === "on" ? true : false),
  ),
  assetId: v.pipe(v.string(), v.uuid()),
});

export const createResourceRoute = createRoute({
  path: "/api/games/:gameId/admin/resources/create-resource",
  component: CreateResource,
  permission: {
    check: isAdminOfGame,
    redirectPath: "/games",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
  formValidationSchema: CreateResourceSchema,
  customContext: userContext,
});
