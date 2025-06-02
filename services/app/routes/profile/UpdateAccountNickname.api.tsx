import { createRoute, v } from "@kalena/framework";
import { isLoggedIn } from "@permissions/index.ts";
import { createEvents } from "@comp/utils/events.ts";
import { PostgresError, queries } from "@package/database";
import { AccountNicknameFlex } from "./AccountNicknameFlex.section.tsx";
import { accountContext } from "@contexts/accountContext.ts";

const UpdateAccountNickname = async () => {
  const context = updateAccountNicknameRoute.context();
  const result = context.req.valid("form");

  if (!result.success) {
    const errorEvents: Record<string, string> = {};
    for (const issue of result.issues) {
      const field: string = issue.path?.[0]?.key as string ?? "form";
      errorEvents[field] = issue.message;
    }
    context.header(
      "HX-Trigger",
      createEvents([{ name: "form-error", values: errorEvents }]),
    );
    context.status(400);
    return <p>Validation Failure</p>;
  }

  try {
    const account = await updateAccountNicknameRoute.customContext();

    await queries.accounts.setAccount({
      id: account.id,
      nickname: result.output.nickname,
      email: account.email,
    });

    context.header(
      "HX-Trigger",
      createEvents([{ name: "dialog-close", values: { value: true } }, {
        name: "toast-show",
        values: {
          message: "Nickname updated successfully",
          variant: "success",
          title: "Nickname Updated",
        },
      }]),
    );

    return (
      <AccountNicknameFlex
        hx-swap-oob="true"
        currentNickname={result.output.nickname}
      />
    );
  } catch (error) {
    if (
      error instanceof PostgresError &&
      error.constraint_name === "account_nickname_unique"
    ) {
      context.header(
        "HX-Trigger",
        createEvents([
          {
            name: "form-error",
            values: { nickname: "This nickname is already taken." },
          },
        ]),
      );
      context.status(400);
      return <p>Nickname taken</p>;
    }
    throw error;
  }
};

const updateNicknameSchema = v.object({
  nickname: v.pipe(v.string(), v.minLength(3)),
});

export const updateAccountNicknameRoute = createRoute({
  path: "/api/profile/update-account-nickname",
  component: UpdateAccountNickname,
  customContext: accountContext,
  permission: { check: isLoggedIn, redirectPath: "/" },
  formValidationSchema: updateNicknameSchema,
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
