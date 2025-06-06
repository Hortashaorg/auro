import { createRoute, v } from "@kalena/framework";
import {
  db,
  errorCausedByConstraint,
  queries,
  schema,
} from "@package/database";
import { GameGrid } from "./GameGrid.section.tsx";
import { createEvents } from "@comp/utils/events.ts";
import { throwError } from "@package/common";
import { accountContext } from "@contexts/accountContext.ts";
import { canCreateGame } from "@permissions/index.ts";

const CreateGame = async () => {
  const context = createGameRoute.context();
  const account = await createGameRoute.customContext();
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

  try {
    await db.transaction(async (tx) => {
      const game = await queries.games.setGame({
        name: result.output.name,
        actionRecoveryInterval: result.output.action_recovery_interval,
      }, tx);

      const asset = await queries.assets.getAssetByName("Village 2", tx);

      const location = await queries.locations.setLocation({
        isStarterLocation: true,
        gameId: game.id,
        assetId: asset.id,
        name: "Starter Location",
      }, tx);

      await queries.users.setUser({
        accountId: account?.id ??
          throwError("No account found"),
        gameId: game.id,
        locationId: location.id,
        availableActions: 15,
        name: account?.nickname,
        type: "admin",
      }, tx);
    });

    context.header(
      "HX-Trigger",
      createEvents([
        { name: "dialog-close", values: { value: true } },
        { name: "form-clear", values: { value: true } },
      ]),
    );

    return <GameGrid hx-swap-oob="true" />;
  } catch (error) {
    if (errorCausedByConstraint(error, "unique_game_name")) {
      context.header(
        "HX-Trigger",
        createEvents([
          {
            name: "form-error",
            values: {
              name: "A game with this name already exists",
            },
          },
        ]),
      );
      return <p>Failure</p>;
    }
    throw error;
  }
};

const CreateGameSchema = v.object({
  name: v.pipe(v.string(), v.minLength(3), v.maxLength(50)),
  action_recovery_interval: v.union(
    schema.game.actionRecoveryInterval.enumValues.map((value) =>
      v.literal(value)
    ),
  ),
});

export const createGameRoute = createRoute({
  path: "/api/games/create-game",
  component: CreateGame,
  permission: {
    check: canCreateGame,
    redirectPath: "/",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
  formValidationSchema: CreateGameSchema,
  customContext: accountContext,
});
