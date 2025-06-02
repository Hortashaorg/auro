import { and, db, eq, schema } from "@db/mod.ts";
import { throwError } from "@package/common";

export const getUserByName = async (name: string, gameId: string) => {
  const user = await db.query.user.findFirst({
    where: and(
      eq(schema.user.name, name),
      eq(schema.user.gameId, gameId),
    ),
  });

  return user ?? throwError("User not found");
};
