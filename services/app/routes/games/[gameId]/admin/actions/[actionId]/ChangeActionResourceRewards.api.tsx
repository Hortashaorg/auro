import { createRoute, v } from "@kalena/framework";
import { isAdminOfGame } from "@permissions/index.ts";
import { throwError } from "@package/common";
import { createEvents } from "@comp/utils/events.ts";
import { ModifyResourceOfActionForm } from "./ModifyResourceOfActionForm.section.tsx";
import { updateActionResourceRewards } from "@queries/mutations/actions/updateActionResourceRewards.ts";

const ChangeActionResourceRewards = async () => {
  const context = changeActionResourceRewardsRoute.context();
  const actionId = context.req.param("actionId");
  if (!actionId) throwError("Missing actionId");

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

  const resourceRewards = Object.entries(result.output);

  const res = resourceRewards.reduce((acc, [key, value]) => {
    const resourceId = key.split("_")[1] ?? throwError("Missing key");
    const field = key.split("_")[2] ?? throwError("Missing key");
    const fieldValue = value as string;

    if (acc[resourceId]) {
      acc[resourceId][field] = fieldValue;
    } else {
      acc[resourceId] = {
        id: resourceId,
      };
      acc[resourceId][field] = fieldValue;
    }
    return acc;
  }, {} as Record<string, Record<string, string>>);
  // Define schema for a single resource entry
  const resourcesSchema = v.array(v.object({
    id: v.pipe(v.string(), v.uuid()),
    chance: v.pipe(
      v.string(),
      v.transform((val: string) => parseInt(val, 10)),
      v.number(),
      v.integer(),
      v.minValue(0),
      v.maxValue(100),
    ),
    min: v.pipe(
      v.string(),
      v.transform((val: string) => parseInt(val, 10)),
      v.number(),
      v.integer(),
      v.minValue(1),
    ),
    max: v.pipe(
      v.string(),
      v.transform((val: string) => parseInt(val, 10)),
      v.number(),
      v.integer(),
      v.minValue(1),
    ),
  }));

  const parsedResult = v.parse(resourcesSchema, Object.values(res));

  // If maxQuantity is less than minQuantity, return an error for both min and max fields.
  const errorEvents: Record<string, string> = {};
  for (const entry of parsedResult) {
    if (entry.max < entry.min) {
      errorEvents[`resource_${entry.id}_max`] =
        "Max quantity cannot be less than min quantity";
      errorEvents[`resource_${entry.id}_min`] =
        "Max quantity cannot be less than min quantity";
    }
  }

  if (Object.keys(errorEvents).length > 0) {
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

  try {
    const updates = parsedResult.map((entry) => ({
      id: entry.id,
      updates: {
        chance: entry.chance,
        quantityMin: entry.min,
        quantityMax: entry.max,
      },
    }));
    if (updates.length > 0) {
      await updateActionResourceRewards(updates);
    }

    // Trigger events to update the UI using the correct format
    context.header(
      "HX-Trigger",
      createEvents([
        {
          name: "form-clear",
          values: { value: true },
        },
        {
          name: "toast-show",
          values: {
            message: "Resource rewards updated successfully",
            variant: "success",
            title: "Success",
          },
        },
      ]),
    );

    // Return the updated form content
    return <ModifyResourceOfActionForm hx-swap-oob="true" />;
  } catch (error) {
    console.error("Error updating resources:", error);

    context.header(
      "HX-Trigger",
      createEvents([
        {
          name: "toast-show",
          values: {
            message: "Failed to update resource rewards",
            variant: "danger",
            title: "Error",
          },
        },
      ]),
    );
    context.status(500);
    return <p>Error updating resource rewards</p>;
  }
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
  path: "/api/games/:gameId/admin/actions/:actionId/change-resource-rewards",
  component: ChangeActionResourceRewards,
  partial: true,
  permission: {
    check: isAdminOfGame,
    redirectPath: "/games",
  },
  formValidationSchema: inputSchema,
  hmr: Deno.env.get("ENV") === "local",
});
