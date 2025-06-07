import { db, eq, schema } from "@db/mod.ts";
import type { ModuleFailure, User } from "./types.ts";
import { ERROR_CODES } from "./types.ts";

export const validateUser = async (
  userId: string,
): Promise<ModuleFailure | User> => {
  try {
    const [user] = await db.select()
      .from(schema.user)
      .where(eq(schema.user.id, userId));

    if (!user) {
      return {
        success: false,
        error: {
          code: ERROR_CODES.USER_NOT_FOUND,
          message: "User not found",
          context: { userId },
        },
      };
    }

    if (user.availableActions <= 0) {
      return {
        success: false,
        error: {
          code: ERROR_CODES.NO_ACTIONS_LEFT,
          message: "No actions left",
          context: { userId, availableActions: user.availableActions },
        },
      };
    }

    const userResources = await db.select()
      .from(schema.userResource)
      .where(
        eq(schema.userResource.userId, userId),
      );
    return {
      success: true,
      user,
      userResources,
    };
  } catch (error) {
    console.error("Error validating user:", error);
    return {
      success: false,
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
