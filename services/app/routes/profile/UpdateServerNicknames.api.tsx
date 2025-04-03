import { ServerNicknamesTable } from "./ServerNicknamesTable.section.tsx";
import { createRoute, v } from "@kalena/framework";
import { isLoggedIn } from "@permissions/index.ts";
import { and, db, eq, schema } from "@package/database";
import { throwError } from "@package/common";

const formSchema = v.record(v.string(), v.string());

const UpdateHandler = async () => {
  const context = updateServerNicknamesRoute.context();
  const email = context.var.email ?? throwError("Email not found");

  const account = await db.query.account.findFirst({
    columns: { id: true },
    where: (account, { eq }) => eq(account.email, email),
  }) ?? throwError("Account not found for email");
  const accountId = account.id;

  const result = context.req.valid("form");

  if (!result.success) {
    console.error("Form validation failed:", result.issues);
    context.status(400);
    return <p>Error: Invalid data submitted.</p>;
  }

  const formData = result.output;
  const updatePromises = [];

  for (const [key, value] of Object.entries(formData)) {
    if (key.startsWith("server_") && key.endsWith("_nickname")) {
      const parts = key.split("_");
      if (parts.length === 3) {
        const serverId = parts[1];
        const newNickname = value;

        updatePromises.push(
          db.update(schema.user)
            .set({ name: newNickname })
            .where(and(
              eq(schema.user.serverId, serverId as string),
              eq(schema.user.accountId, accountId),
            )),
        );
      }
    }
  }

  await Promise.all(updatePromises);
  return <ServerNicknamesTable />;
};

export const updateServerNicknamesRoute = createRoute({
  path: "/api/profile/update-server-nicknames",
  component: UpdateHandler,
  formValidationSchema: formSchema,
  permission: {
    check: isLoggedIn,
    redirectPath: "/",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
