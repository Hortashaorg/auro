import { createRoute, getGlobalContext, v } from "@kalena/framework";
import { and, db, eq, schema, sql } from "@package/database";
import { createEvents } from "@comp/utils/events.ts";
import { throwError } from "@package/common";
import { ServerName } from "@sections/profile/ServerName.tsx";
import { isLoggedIn } from "@permissions/index.ts";

const UpdateServerUsername = async () => {
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
    const serverId = result.output.serverId;

    // Get account
    const [account] = await db.select()
      .from(schema.account)
      .where(eq(schema.account.email, email));

    if (!account) {
      throw new Error("Account not found");
    }

    // Update user name for this server
    await db.update(schema.user)
      .set({
        name: result.output.name,
        updatedAt: sql`now()`,
      })
      .where(
        and(
          eq(schema.user.accountId, account.id),
          eq(schema.user.serverId, serverId),
        ),
      );

    context.header(
      "HX-Trigger",
      createEvents([
        { name: "clear-form", values: { value: true } },
        {
          name: "form-error",
          values: { success: "Username updated successfully" },
        },
      ]),
    );

    // Get updated data
    const [serverData] = await db.select({
      user: schema.user,
      server: schema.server,
    })
      .from(schema.user)
      .innerJoin(schema.server, eq(schema.user.serverId, schema.server.id))
      .where(
        and(
          eq(schema.user.accountId, account.id),
          eq(schema.user.serverId, serverId),
        ),
      );

    if (!serverData) {
      throw new Error("Failed to retrieve updated server data");
    }

    // Prepare simplified server data for component
    const simplifiedServerData = {
      server: {
        id: serverData.server.id,
        name: serverData.server.name,
      },
      user: {
        id: serverData.user.id,
        name: serverData.user.name,
      },
    };

    // Return the updated row
    return (
      <ServerName
        serverData={simplifiedServerData}
        defaultNickname={account.nickname || ""}
        hx-swap-oob={`true`}
        id={`server-name-${serverId}`}
      />
    );
  } catch (error) {
    console.error("Error updating server username:", error);
    context.header(
      "HX-Trigger",
      createEvents([
        {
          name: "form-error",
          values: {
            error: "Failed to update username",
          },
        },
      ]),
    );
    return <p>Failure</p>;
  }
};

const UpdateServerUsernameSchema = v.object({
  serverId: v.string(),
  name: v.pipe(v.string(), v.minLength(3), v.maxLength(50)),
});

export const updateServerUsernameRoute = createRoute({
  path: "/api/server/update-username",
  component: UpdateServerUsername,
  permission: {
    check: isLoggedIn,
    redirectPath: "/",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
  formValidationSchema: UpdateServerUsernameSchema,
});
