import { db, eq, schema } from "@package/database";
import type { ModuleFailure, User } from "./types.ts";
import { ERROR_CODES } from "./types.ts";
import { throwError } from "@package/common";

export const validateUser = async (
  userId: string,
): Promise<ModuleFailure | User> => {
  try {
    const userData = await db.select()
      .from(schema.user)
      .leftJoin(
        schema.userResource,
        eq(schema.user.id, schema.userResource.userId),
      )
      .where(eq(schema.user.id, userId));

    if (userData.length === 0) {
      return {
        error: {
          code: ERROR_CODES.USER_NOT_FOUND,
          message: "User not found",
          context: { userId },
        },
      };
    }

    const user = userData[0]?.user ?? throwError("User should exist here");

    if (user.availableActions <= 0) {
      return {
        error: {
          code: ERROR_CODES.NO_ACTIONS_LEFT,
          message: "No actions left",
          context: { userId, availableActions: user.availableActions },
        },
      };
    }

    const userResources = userData.map((data) => data.user_resource).filter(
      (userResource) => userResource !== null,
    );

    return {
      user,
      userResources,
    };
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
