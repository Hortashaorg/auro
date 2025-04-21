import { createRoute, v } from "@kalena/framework";
import { isLoggedIn } from "@permissions/index.ts";
import { and, db, eq, PostgresError, schema } from "@package/database";
import { createEvents } from "@comp/utils/events.ts";
import { GameNicknamesTable } from "./GameNicknamesTable.section.tsx";
import { userContext } from "@contexts/userContext.ts";

const formSchema = v.object({
  nickname: v.string(),
});

const UpdateHandler = async () => {
  const context = updateGameNicknameRoute.context();

  const { user, account } = await updateGameNicknameRoute.customContext();

  const result = context.req.valid("form");
  if (!result.success) {
    const errorEvents: Record<string, string> = {};
    for (const issue of result.issues) {
      errorEvents[issue.path?.[0]?.key as string ?? "form"] = issue.message;
    }
    context.header(
      "HX-Trigger",
      createEvents([{ name: "form-error", values: errorEvents }]),
    );
    context.status(400);
    return <p>Validation Error</p>;
  }

  const { nickname } = result.output;

  try {
    await db.update(schema.user)
      .set({ name: nickname })
      .where(and(
        eq(schema.user.id, user.id),
        eq(schema.user.accountId, account.id),
      ));

    context.header(
      "HX-Trigger",
      createEvents([
        { name: "dialog-close", values: { value: true } },
        {
          name: "toast-show",
          values: {
            message: "Nickname updated!",
            variant: "success",
            title: "Success",
          },
        },
      ]),
    );

    return <GameNicknamesTable hx-swap-oob="true" accountId={account.id} />;
  } catch (error) {
    if (
      error instanceof PostgresError &&
      error.constraint_name === "unique_user_name_per_game"
    ) {
      context.header(
        "HX-Trigger",
        createEvents([
          {
            name: "form-error",
            values: {
              nickname: "This nickname is already taken on this game.",
            },
          },
        ]),
      );
      context.status(400);
      return <p>Nickname exists</p>;
    }
    throw error;
  }
};

export const updateGameNicknameRoute = createRoute({
  path: "/api/games/:gameId/update-game-nickname",
  component: UpdateHandler,
  customContext: userContext,
  formValidationSchema: formSchema,
  permission: { check: isLoggedIn, redirectPath: "/" },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
