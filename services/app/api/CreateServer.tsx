import { createRoute, v } from "@kalena/framework";
import { db, schema } from "@package/database";
import { ServerGrid } from "@sections/views/ServerGrid.tsx";
import { createEvents } from "@comp/utils/events.ts";
import { throwError } from "@package/common";

const CreateServer = async () => {
  const context = createServerRoute.context();
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

    return (
      <p className="text-red-500">
        {result.issues[0].message}
      </p>
    );
  }

  // Create the server
  await db.insert(schema.server).values({
    name: result.output.name,
  });

  // Fetch updated server list
  const servers = await db.query.server.findMany({
    orderBy: (server, { desc }) => [desc(server.updatedAt)],
  });

  context.header(
    "HX-Trigger",
    createEvents([
      {
        name: "close-dialog",
        values: {
          value: true,
        },
      },
      {
        name: "clear-form",
        values: {
          value: true,
        },
      },
    ]),
  );

  // Return the updated server list using ServerGrid component
  return <ServerGrid servers={servers} hx-swap-oob="true" />;
};

const CreateServerSchema = v.object({
  name: v.pipe(v.string(), v.minLength(10)),
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
});
