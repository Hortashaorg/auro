import { db, type InferInsertModel, schema } from "@package/database";
import { throwError } from "@package/common";

export type InsertActionResourceReward = InferInsertModel<
  typeof schema.actionResourceReward
>;

export const createActionResourceReward = async (
  input: InsertActionResourceReward,
) => {
  const [inserted] = await db.insert(schema.actionResourceReward).values({
    actionId: input.actionId,
    resourceId: input.resourceId,
    chance: input.chance ?? 100,
    quantityMin: input.quantityMin ?? 1,
    quantityMax: input.quantityMax ?? 1,
  }).returning();
  return inserted ?? throwError("Failed to create action resource reward");
};
