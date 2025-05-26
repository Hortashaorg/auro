export interface ModuleFailure {
  error: {
    code: string;
    message: string;
    context: Record<string, unknown>;
  };
}

export const ERROR_CODES = {
  USER_NOT_FOUND: "USER_NOT_FOUND",
  NO_ACTIONS_LEFT: "NO_ACTIONS_LEFT",
  INSUFFICIENT_RESOURCES: "INSUFFICIENT_RESOURCES",
  ACTION_NOT_FOUND: "ACTION_NOT_FOUND",
  DATABASE_ERROR: "DATABASE_ERROR",
  INVALID_REWARD_CONFIG: "INVALID_REWARD_CONFIG",
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
