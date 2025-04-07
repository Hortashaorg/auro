import * as v from "@valibot/valibot";
export const ActionLog = v.object({
  resource: v.array(
    v.object({
      resourceId: v.pipe(v.string(), v.uuid()),
    }),
  ),
});

export type ActionLogType = v.InferInput<typeof ActionLog>;
