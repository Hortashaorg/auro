import { db, eq, isNull, schema } from "../mod.ts";
import { throwError } from "@package/common";

export const patchLocation = async () => {
  const locations = await db.select().from(schema.location);
  const assets = await db.select().from(schema.asset);

  const users = await db.select().from(schema.user).where(
    isNull(schema.user.locationId),
  );

  for (const user of users) {
    let gameLocation = locations.find((loc) => loc.gameId === user.gameId);

    if (!gameLocation) {
      const asset = assets.find((a) => a.type === "location") ??
        throwError("Failed");
      const [loc] = await db.insert(schema.location).values({
        assetId: asset.id,
        gameId: user.gameId,
        name: "A Location",
      }).returning();

      gameLocation = loc ?? throwError("Does exist now");
    }

    await db.update(schema.user).set({
      locationId: gameLocation.id,
      updatedAt: Temporal.Now.instant(),
    }).where(eq(schema.user.id, user.id));
  }

  console.log("Patch of locations");
};
