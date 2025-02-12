import { createRoute, v } from "@package/framework";
import { db } from "@package/database";

const CreateServer = () => {
  const context = createServerRoute.context();

  const data = context.req.valid("form");

  console.log(data);

  return <p>response</p>;
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
