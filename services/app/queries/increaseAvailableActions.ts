import {
  and,
  db,
  eq,
  inArray,
  type InferSelectModel,
  lt,
  schema,
  sql,
} from "@package/database";

export const increaseAvailableActions = async () => {
  const now = Temporal.Now.plainDateTimeISO().round("minute");
  const minute = now.minute;
  const hour = now.hour;

  const intervals: InferSelectModel<
    typeof schema.server
  >["actionRecoveryInterval"][] = [];

  if (minute % 5 === 0) {
    intervals.push("5min");
  }

  if (minute % 15 === 0) {
    intervals.push("15min");
  }

  if (minute % 30 === 0) {
    intervals.push("30min");
  }

  if (minute === 0) {
    intervals.push("1hour");
  }

  if (hour % 2 === 0 && minute === 0) {
    intervals.push("2hour");
  }

  if (hour % 4 === 0 && minute === 0) {
    intervals.push("4hour");
  }

  if (hour % 8 === 0 && minute === 0) {
    intervals.push("8hour");
  }

  if (hour % 12 === 0 && minute === 0) {
    intervals.push("12hour");
  }

  if (hour === 0 && minute === 0) {
    intervals.push("1day");
  }

  const serversToUpdate = await db.select().from(schema.server).where(
    and(
      inArray(schema.server.actionRecoveryInterval, intervals),
      eq(schema.server.online, true),
    ),
  );

  for (const server of serversToUpdate) {
    await db.update(schema.user)
      .set({
        availableActions:
          sql`${schema.user.availableActions} + ${server.actionRecoveryAmount}`,
      })
      .where(
        and(
          eq(schema.user.serverId, server.id),
          eq(schema.user.type, "player"),
          lt(schema.user.availableActions, server.maxAvailableActions),
        ),
      );
  }
};
