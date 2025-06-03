import { createRoute, v } from "@kalena/framework";
import { catchConstraintByName, queries } from "@package/database";
import { isAdminOfGame } from "@permissions/index.ts";
import { createEvents } from "@comp/utils/events.ts";
import { throwError } from "@package/common";
import { LocationGrid } from "./LocationGrid.section.tsx";
import { userContext } from "@contexts/userContext.ts";

const CreateLocation = async () => {
  const context = createLocationRoute.context();
  const { user } = await createLocationRoute.customContext();
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

    return <p>Failure</p>;
  }

  const gameId = user.gameId;

  try {
    await queries.locations.setLocation({
      name: result.output.name,
      description: result.output.description,
      gameId: gameId,
      assetId: result.output.assetId,
    });

    context.header(
      "HX-Trigger",
      createEvents([
        { name: "dialog-close", values: { value: true } },
        { name: "form-clear", values: { value: true } },
      ]),
    );

    return <LocationGrid hx-swap-oob="true" gameId={gameId} />;
  } catch (error) {
    if (catchConstraintByName(error, "unique_location_name_per_game")) {
      // Unique constraint violation
      context.header(
        "HX-Trigger",
        createEvents([
          {
            name: "form-error",
            values: {
              name: "A location with this name already exists on this game",
            },
          },
        ]),
      );
      return <p>Failure</p>;
    }
    throw error;
  }
};

const CreateLocationSchema = v.object({
  name: v.pipe(v.string(), v.minLength(3), v.maxLength(50)),
  description: v.optional(v.pipe(
    v.string(),
    v.transform((val: string) => {
      return val.trim() === "" ? undefined : val;
    }),
  )),
  assetId: v.pipe(v.string(), v.uuid()),
});

export const createLocationRoute = createRoute({
  path: "/api/games/:gameId/admin/locations/create-location",
  component: CreateLocation,
  permission: {
    check: isAdminOfGame,
    redirectPath: "/games",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
  formValidationSchema: CreateLocationSchema,
  customContext: userContext,
});
