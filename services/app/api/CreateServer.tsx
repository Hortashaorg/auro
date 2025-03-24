import { createRoute, v } from "@kalena/framework";
import { db, PostgresError, schema } from "@package/database";
import { ServerGrid } from "@sections/views/ServerGrid.tsx";
import { createEvents } from "@comp/utils/events.ts";
import { throwError } from "@package/common";

const CreateServer = async () => {
  const context = createServerRoute.context();
  const customContext = await createServerRoute.customContext();
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
      const [server] = await tx.insert(schema.server)
        .values({
          name: result.output.name,
        })
        .returning();

      await tx.insert(schema.user)
        .values({
          accountId: customContext.account?.id ??
            throwError("No account found"),
          serverId: server?.id ?? throwError("No server id"),
          availableActions: 0,
          name: customContext.account?.nickname,
          type: "admin",
        });
    });

    context.header(
      "HX-Trigger",
      createEvents([
        { name: "close-dialog", values: { value: true } },
        { name: "clear-form", values: { value: true } },
      ]),
    );

    return <ServerGrid hx-swap-oob="true" />;
  } catch (error) {
    if (error instanceof PostgresError) {
      if (
        error.constraint_name === "unique_server_name"
      ) {
        // Unique constraint violation
        context.header(
          "HX-Trigger",
          createEvents([
            {
              name: "form-error",
              values: {
                name: "A server with this name already exists",
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

const CreateServerSchema = v.object({
  name: v.pipe(v.string(), v.minLength(3), v.maxLength(50)),
});

export const createServerRoute = createRoute({
  path: "/api/create-server",
  component: CreateServer,
  permission: {
    check: async (c) => {
      const email = c.var.email;
      if (email) {
        const account = await db.query.account.findFirst({
          where: (account, { eq }) => eq(account.email, email),
        });

        return account?.canCreateServer ?? false;
      }

      return false;
    },
    redirectPath: "/",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
  formValidationSchema: CreateServerSchema,
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
