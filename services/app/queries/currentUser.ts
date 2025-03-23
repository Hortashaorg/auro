import { getGlobalContext } from "@kalena/framework";
import { and, db, eq, schema } from "@package/database";
import { throwError } from "@package/common";

export const currentUser = async (serverId: string) => {
  const context = getGlobalContext();
  const email = context.var.email ?? throwError("Email not found");

  const [user] = await db.select({
    id: schema.user.id,
    email: schema.account.email,
    name: schema.user.name,
  })
    .from(schema.user)
    .innerJoin(schema.account, eq(schema.user.accountId, schema.account.id))
    .where(
      and(
        eq(schema.account.email, email),
        eq(schema.user.serverId, serverId),
      ),
    );

  return user ?? throwError("User not found");
};
