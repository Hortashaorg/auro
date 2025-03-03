import { createRoute, v } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";
import { throwError } from "@package/common";
import { createEvents } from "@comp/utils/events.ts";

const ChangeActionResourceRewards = () => {
  const context = changeActionResourceRewardsRoute.context();
  const result = context.req.valid("form");

  if (!result.success) {
    const errorEvents: Record<string, string> = {};
    for (const issue of result.issues) {
      const field: string = issue.path?.[0]?.key as string ??
        throwError("Invalid issue path");
      errorEvents[field] = issue.message;
    }

    context.header(
      "HX-Trigger",
      createEvents([
        {
          name: "form-error",
          values: errorEvents,
        },
      ]),
    );
    return <p>Invalid form data</p>;
  }

  context.header(
    "HX-Trigger",
    createEvents([
      {
        name: "form-error",
        values: {
          "resource_dbb6eac1-693b-46e0-a117-b5436dfae18b_max": "Mr li failed",
        },
      },
    ]),
  );

  console.log(result.output);
  return <p>yolo</p>;
};

const endPattern = v.custom<`resource_${string}_${string}`>(
  (input) =>
    typeof input === "string" &&
    /(chance|min|max)$/.test(input),
);

const uuidSchema = v.pipe(v.string(), v.uuid());
const validUUID = v.custom<`resource_${string}_${string}`>(
  (input) => {
    if (typeof input !== "string") return false;
    const uuid = input.split("_")[1];
    if (!uuid) return false;
    const result = v.safeParse(uuidSchema, uuid);
    return result.success;
  },
);

const inputSchema = v.record(
  v.pipe(v.string(), v.startsWith("resource_"), endPattern, validUUID),
  v.string(),
);

export const changeActionResourceRewardsRoute = createRoute({
  path: "/api/servers/:serverId/actions/:actionId/resource-rewards/change",
  component: ChangeActionResourceRewards,
  partial: true,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  formValidationSchema: inputSchema,
  hmr: Deno.env.get("ENV") === "local",
});
