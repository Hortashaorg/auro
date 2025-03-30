import { db } from "@package/database";

export const getAccount = async (email: string) => {
  return await db.query.account.findFirst({
    where: (account, { eq }) => eq(account.email, email),
  });
};
