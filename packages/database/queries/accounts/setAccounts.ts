import { type InferInsertModel, sql } from "drizzle-orm";
import {
  catchConstraintByName,
  db,
  schema,
  type Transaction,
} from "@db/mod.ts";
import { throwError } from "@package/common";

type SetAccountData = Omit<
  InferInsertModel<typeof schema.account>,
  "createdAt" | "updatedAt"
>;

export const setAccounts = async (data: SetAccountData[], tx?: Transaction) => {
  const transaction = tx ?? db;

  try {
    return await transaction
      .insert(schema.account)
      .values(data)
      .onConflictDoUpdate({
        target: [schema.account.id],
        set: {
          canCreateGame: sql`excluded.can_create_game`,
          email: sql`excluded.email`,
          nickname: sql`excluded.nickname`,
          updatedAt: Temporal.Now.instant(),
        },
      })
      .returning();
  } catch (error) {
    if (catchConstraintByName(error, "account_email_unique")) {
      return await transaction
        .insert(schema.account)
        .values(data)
        .onConflictDoUpdate({
          target: [schema.account.email],
          set: {
            canCreateGame: sql`excluded.can_create_game`,
            email: sql`excluded.email`,
            nickname: sql`excluded.nickname`,
            updatedAt: Temporal.Now.instant(),
          },
        })
        .returning();
    }
    console.error(error);
    throw error;
  }
};

export const setAccount = async (data: SetAccountData, tx?: Transaction) => {
  const accounts = await setAccounts([data], tx);
  return accounts[0] ?? throwError("Account should exist");
};
