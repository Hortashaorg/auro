import { createRoute, v } from "@kalena/framework";
import { isLoggedIn } from "@permissions/index.ts";
import { createEvents } from "@comp/utils/events.ts";
import { UserNicknamesTable } from "./UserNicknamesTable.section.tsx";
import { userContext } from "@contexts/userContext.ts";
import { updateUser } from "@queries/mutations/user/updateUser.ts";
import { PostgresError } from "@package/database";

const formSchema = v.object({
  nickname: v.string(),
});

const UpdateHandler = async () => {
  const context = updateUserNicknameRoute.context();

  const { user, account } = await updateUserNicknameRoute.customContext();

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
    await updateUser(user.id, { name: nickname });

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

    return <UserNicknamesTable hx-swap-oob="true" accountId={account.id} />;
  } catch (error: unknown) {
    if (
      error instanceof PostgresError &&
      (error as InstanceType<typeof PostgresError>).constraint_name ===
        "unique_user_name_per_game"
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

export const updateUserNicknameRoute = createRoute({
  path: "/api/games/:gameId/update-game-nickname",
  component: UpdateHandler,
  customContext: userContext,
  formValidationSchema: formSchema,
  permission: { check: isLoggedIn, redirectPath: "/" },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
