import { createRoute, getGlobalContext, v } from "@kalena/framework";
import { db, eq, PostgresError, schema, sql } from "@package/database";
import { createEvents } from "@comp/utils/events.ts";
import { throwError } from "@package/common";
import { ProfileNicknameForm } from "@sections/profile/ProfileNicknameForm.tsx";
import { isLoggedIn } from "@permissions/index.ts";

const UpdateAccountNickname = async () => {
  const context = getGlobalContext();
  const result = context.req.valid("form");
  const email = context.var.email ?? throwError("Email not found");

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
    // Get the current account
    const [account] = await db.select()
      .from(schema.account)
      .where(eq(schema.account.email, email));

    if (!account) {
      throw new Error("Account not found");
    }

    // Update account nickname
    await db.update(schema.account)
      .set({
        nickname: result.output.nickname,
        updatedAt: sql`now()`,
      })
      .where(eq(schema.account.id, account.id));

    context.header(
      "HX-Trigger",
      createEvents([
        { name: "clear-form", values: { value: true } },
        {
          name: "form-error",
          values: { success: "Nickname updated successfully" },
        },
      ]),
    );

    // Return the updated form
    const updatedAccount = await db.query.account.findFirst({
      where: (account, { eq }) => eq(account.email, email),
    });

    if (!updatedAccount) {
      throw new Error("Failed to retrieve updated account");
    }

    return <ProfileNicknameForm account={updatedAccount} hx-swap-oob="true" />;
  } catch (error) {
    if (error instanceof PostgresError) {
      if (error.constraint_name === "account_nickname_unique") {
        // Unique constraint violation
        context.header(
          "HX-Trigger",
          createEvents([
            {
              name: "form-error",
              values: {
                nickname: "This nickname is already taken",
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

const UpdateAccountNicknameSchema = v.object({
  nickname: v.pipe(v.string(), v.minLength(3), v.maxLength(50)),
});

export const updateAccountNicknameRoute = createRoute({
  path: "/api/account/update-nickname",
  component: UpdateAccountNickname,
  permission: {
    check: isLoggedIn,
    redirectPath: "/",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
  formValidationSchema: UpdateAccountNicknameSchema,
});
