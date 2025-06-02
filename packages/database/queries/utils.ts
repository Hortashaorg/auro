import { PostgresError } from "@db/mod.ts";

export const catchConstraintByName = (error: unknown, constraint: string) => {
  if (error instanceof PostgresError) {
    if (error.constraint_name === constraint) {
      return true;
    }
  }
  if (error instanceof Error && error.cause instanceof PostgresError) {
    if (error.cause.constraint_name === constraint) {
      return true;
    }
  }
  return false;
};
