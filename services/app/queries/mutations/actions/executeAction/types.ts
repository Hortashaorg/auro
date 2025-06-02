import type { db, InferSelectModel, schema } from "@package/database";

export interface ModuleFailure {
  success: false;
  error: {
    code: string;
    message: string;
    context: Record<string, unknown>;
  };
}

export type User = {
  user: InferSelectModel<typeof schema.user>;
  userResources: InferSelectModel<typeof schema.userResource>[];
};

export type Action = {
  action: InferSelectModel<typeof schema.action>;
  actionResourceCosts: InferSelectModel<typeof schema.actionResourceCost>[];
  actionResourceRewards: InferSelectModel<typeof schema.actionResourceReward>[];
  actionItemRewards: InferSelectModel<typeof schema.actionItemReward>[];
};

export const ERROR_CODES = {
  USER_NOT_FOUND: "USER_NOT_FOUND",
  NO_ACTIONS_LEFT: "NO_ACTIONS_LEFT",
  INSUFFICIENT_RESOURCES: "INSUFFICIENT_RESOURCES",
  ACTION_NOT_FOUND: "ACTION_NOT_FOUND",
  DATABASE_ERROR: "DATABASE_ERROR",
  INVALID_REWARD_CONFIG: "INVALID_REWARD_CONFIG",
} as const;

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
