import { createRoute, v } from "@kalena/framework";
import { db, PostgresError, schema } from "@package/database";
import { GameGrid } from "./GameGrid.section.tsx";
import { createEvents } from "@comp/utils/events.ts";
import { throwError } from "@package/common";

const CreateGame = async () => {
  const context = createGameRoute.context();
  const customContext = await createGameRoute.customContext();
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
      const [game] = await tx.insert(schema.game)
        .values({
          name: result.output.name,
          actionRecoveryInterval: result.output.action_recovery_interval,
        })
        .returning();

      await tx.insert(schema.user)
        .values({
          accountId: customContext.account?.id ??
            throwError("No account found"),
          gameId: game?.id ?? throwError("No game id"),
          availableActions: 15,
          name: customContext.account?.nickname,
          type: "admin",
        });
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
    if (error instanceof PostgresError) {
      if (
        error.constraint_name === "unique_game_name"
      ) {
        // Unique constraint violation
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
    check: async (c) => {
      const email = c.var.email;
      if (email) {
        const account = await db.query.account.findFirst({
          where: (account, { eq }) => eq(account.email, email),
        });

        return account?.canCreateGame ?? false;
      }

      return false;
    },
    redirectPath: "/",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
  formValidationSchema: CreateGameSchema,
  customContext: async (c) => {
    let account;
    const email = c.var.email;
    if (email) {
      account = await db.query.account.findFirst({
        where: (account, { eq }) => eq(account.email, email),
      });
    }
    return { account };
  },
});
