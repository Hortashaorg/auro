import { db, eq, type InferSelectModel, schema } from "@package/database";
import type { ModuleFailure } from "./types.ts";
import { ERROR_CODES } from "./types.ts";

export const validateUser = async (
  userId: string,
): Promise<ModuleFailure | InferSelectModel<typeof schema.user>> => {
  try {
    const [user] = await db.select()
      .from(schema.user)
      .where(eq(schema.user.id, userId));

    if (!user) {
      return {
        error: {
          code: ERROR_CODES.USER_NOT_FOUND,
          message: "User not found",
          context: { userId },
        },
      };
    }

    if (user.availableActions <= 0) {
      return {
        error: {
          code: ERROR_CODES.NO_ACTIONS_LEFT,
          message: "No actions left",
          context: { userId, availableActions: user.availableActions },
        },
      };
    }

    return user;
  } catch (error) {
    console.error("Error validating user:", error);
    return {
      error: {
        code: ERROR_CODES.DATABASE_ERROR,
        message: "Failed to validate user",
        context: {
          userId,
          originalError: error instanceof Error ? error.message : String(error),
        },
      },
    };
  }
};
