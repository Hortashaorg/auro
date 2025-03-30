import { createRoute } from "@kalena/framework";
import { isLoggedIn } from "@permissions/index.ts";
import { v } from "@kalena/framework";
import { throwError } from "@package/common";
import { createEvents } from "@comp/utils/events.ts";
import { db, eq, PostgresError, schema } from "@package/database";
import { DefaultNicknameDisplay } from "@sections/views/DefaultNicknameDisplay.tsx";

const UpdateNickname = async () => {
  const context = updateNicknameRoute.context();
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

  const email = context.var.email ?? throwError("Email not found");

  try {
    await db.update(schema.account)
      .set({
        nickname: result.output.nickname,
      })
      .where(eq(schema.account.email, email));
  } catch (error) {
    if (error instanceof PostgresError) {
      if (
        error.constraint_name === "account_nickname_unique"
      ) {
        // Unique constraint violation
        context.header(
          "HX-Trigger",
          createEvents([
            {
              name: "form-error",
              values: {
                name: "An action with this name already exists on this server",
              },
            },
          ]),
        );
        return <p>Failure</p>;
      }
    }
    throw error;
  }

  return <DefaultNicknameDisplay hx-swap-oob="true" />;
};

const updateNicknameSchema = v.object({
  nickname: v.pipe(v.string(), v.minLength(3)),
});

export const updateNicknameRoute = createRoute({
  path: "/api/account/update-nickname",
  component: UpdateNickname,
  permission: {
    check: isLoggedIn,
    redirectPath: "/",
  },
  formValidationSchema: updateNicknameSchema,
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
