import { db, schema, type Transaction } from "@package/database";
import { eq } from "drizzle-orm";

export const deleteSession = async (
  refreshTokenHash: string,
  tx?: Transaction,
) => {
  const transaction = tx ?? db;
  await transaction.delete(schema.session).where(
    eq(schema.session.refreshTokenHash, refreshTokenHash),
  );
};
