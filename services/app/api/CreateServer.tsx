import { createRoute, v } from "@kalena/framework";
import { db, schema } from "@package/database";
import { ServerGrid } from "@sections/views/ServerGrid.tsx";

const CreateServer = async () => {
  const context = createServerRoute.context();
  const result = context.req.valid("form");

  if (!result.success) {
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
    JSON.stringify({
      "close-dialog": {
        value: true,
      },
      "input-error": {
        message: "Server created successfully",
      },
    }),
  );

  // Return the updated server list using ServerGrid component
  return <ServerGrid servers={servers} />;
};

const CreateServerSchema = v.object({
  name: v.pipe(v.string(), v.minLength(3)),
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
