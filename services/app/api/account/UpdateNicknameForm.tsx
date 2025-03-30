import { createRoute, getGlobalContext } from "@kalena/framework";
import { db } from "@package/database";
import { throwError } from "@package/common";
import { isLoggedIn } from "@permissions/index.ts";
import { DefaultNicknameForm } from "@sections/forms/DefaultNicknameForm.tsx";

const UpdateNicknameFormComponent = async () => {
  const context = getGlobalContext();
  const email = context.var.email ?? throwError("Email not found");

  const account = await db.query.account.findFirst({
    where: (account, { eq }) => eq(account.email, email),
  }) ?? throwError("Account not found");

  if (!account) {
    return <div id="default-nickname-display">Error: Account not found.</div>;
  }

  return (
    <div id="default-nickname-display">
      <DefaultNicknameForm account={account} />
    </div>
  );
};

export const updateNicknameFormRoute = createRoute({
  path: "/api/account/update-nickname-form",
  component: UpdateNicknameFormComponent,
  permission: {
    check: isLoggedIn,
    redirectPath: "/",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
