import { getGlobalContext } from "@kalena/framework";
import { and, db, eq, schema } from "@package/database";
import { throwError } from "@package/common";

export const currentUser = async (gameId: string) => {
  const context = getGlobalContext();
  const email = context.var.email ?? throwError("Email not found");

  const [user] = await db.select({
    id: schema.user.id,
    email: schema.account.email,
    name: schema.user.name,
    availableActions: schema.user.availableActions,
  })
    .from(schema.user)
    .innerJoin(schema.account, eq(schema.user.accountId, schema.account.id))
    .where(
      and(
        eq(schema.account.email, email),
        eq(schema.user.gameId, gameId),
      ),
    );

  return user ?? throwError("User not found");
};
