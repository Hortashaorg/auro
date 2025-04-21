import { createRoute, v } from "@kalena/framework";
import { isLoggedIn } from "@permissions/index.ts";
import { and, db, eq, PostgresError, schema } from "@package/database";
import { throwError } from "@package/common";
import { createEvents } from "@comp/utils/events.ts";
import { GameNicknamesTable } from "./GameNicknamesTable.section.tsx";

const formSchema = v.object({
  gameId: v.string(),
  nickname: v.string(),
});

const UpdateHandler = async () => {
  const context = updateGameNicknameRoute.context();
  const email = context.var.email ?? throwError("Email not found");

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

  const { gameId, nickname } = result.output;

  const account = await db.query.account.findFirst({
    columns: { id: true },
    where: (acc, { eq }) => eq(acc.email, email),
  }) ?? throwError("Account not found");
  const accountId = account.id;

  try {
    await db.update(schema.user)
      .set({ name: nickname })
      .where(and(
        eq(schema.user.gameId, gameId as string),
        eq(schema.user.accountId, accountId),
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

    return <GameNicknamesTable hx-swap-oob="true" />;
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
  path: "/api/profile/update-game-nickname",
  component: UpdateHandler,
  formValidationSchema: formSchema,
  permission: { check: isLoggedIn, redirectPath: "/" },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
