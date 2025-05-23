import { db, eq, schema, sql } from "../mod.ts";

const setAdminUser = async () => {
  await db.insert(schema.account).values([{
    email: "testuseradmin@kalena.site",
    nickname: "testuseradmin",
    canCreateGame: true,
  }, {
    email: "testuserplayer@kalena.site",
    nickname: "testuserplayer",
    canCreateGame: false,
  }]).onConflictDoNothing();
};

const setupTestGame = async () => {
  let [game] = await db.insert(schema.game).values({
    id: "5bbcb026-e240-48d8-b66d-7105df74cf9f",
    actionRecoveryInterval: "15min",
    name: "Populated Test Game",
    online: true,
  })
    .returning()
    .onConflictDoNothing();

  if (!game) {
    game = await db.query.game.findFirst({
      where: eq(schema.game.name, "Populated Test Game"),
    });
  }

  const adminAccount = await db.query.account.findFirst({
    where: eq(schema.account.email, "testuseradmin@kalena.site"),
  });

  const playerAccount = await db.query.account.findFirst({
    where: eq(schema.account.email, "testuserplayer@kalena.site"),
  });

  if (!adminAccount || !playerAccount || !game) {
    throw new Error("Account or game not found");
  }

  let [admin, player] = await db.insert(schema.user).values([{
    accountId: adminAccount.id,
    gameId: game.id,
    type: "admin",
    name: "testuseradmin",
    availableActions: 15,
  }, {
    accountId: playerAccount.id,
    gameId: game.id,
    type: "player",
    name: "testuserplayer",
    availableActions: 15,
  }])
    .returning()
    .onConflictDoUpdate({
      target: [schema.user.accountId, schema.user.gameId],
      set: {
        name: sql`excluded.name`,
      },
    });

  if (!admin) {
    admin = await db.query.user.findFirst({
      where: eq(schema.user.accountId, adminAccount.id),
    });
  }

  if (!player) {
    player = await db.query.user.findFirst({
      where: eq(schema.user.accountId, playerAccount.id),
    });
  }

  if (!admin || !player) {
    throw new Error("User not found");
  }

  const locationAsset = await db.query.asset.findFirst({
    where: eq(schema.asset.name, "Castle 1"),
  });
  if (!locationAsset) {
    throw new Error("Asset not found");
  }

  let [location] = await db.insert(schema.location).values({
    id: "5bbcb026-e240-48d8-b66d-7105df74cf9f",
    gameId: game.id,
    assetId: locationAsset.id,
    name: "Test Location",
    description: "A location for e2e tests.",
  }).returning().onConflictDoNothing();

  if (!location) {
    location = await db.query.location.findFirst({
      where: eq(schema.location.name, "Test Location"),
    });
  }

  if (!location) {
    throw new Error("Location not found");
  }

  const resourceAsset = await db.query.asset.findFirst({
    where: eq(schema.asset.name, "Gold 1"),
  });
  if (!resourceAsset) {
    throw new Error("Asset not found");
  }

  let [resource1, resource2] = await db.insert(schema.resource).values([{
    id: "5bbcb026-e240-48d8-b66d-7105df74cf9f",
    gameId: game.id,
    assetId: resourceAsset.id,
    name: "Test Resource",
    description: "A resource for e2e tests.",
    leaderboard: true,
  }, {
    id: "05645ee0-8a62-4c2e-ae05-7f6d237cf6b7",
    gameId: game.id,
    assetId: resourceAsset.id,
    name: "Test Resource 2",
    description: "A resource for e2e tests.",
    leaderboard: true,
  }]).returning().onConflictDoNothing();

  if (!resource1) {
    resource1 = await db.query.resource.findFirst({
      where: eq(schema.resource.name, "Test Resource"),
    });
  }

  if (!resource2) {
    resource2 = await db.query.resource.findFirst({
      where: eq(schema.resource.name, "Test Resource 2"),
    });
  }

  if (!resource1 || !resource2) {
    throw new Error("Resource not found");
  }

  const actionAsset = await db.query.asset.findFirst({
    where: eq(schema.asset.name, "Fishing 2"),
  });
  if (!actionAsset) {
    throw new Error("Asset not found");
  }

  let [action] = await db.insert(schema.action).values({
    id: "5bbcb026-e240-48d8-b66d-7105df74cf9f",
    gameId: game.id,
    name: "Populated Test Action",
    description: "A action for e2e tests.",
    assetId: actionAsset.id,
    locationId: location.id,
  }).returning().onConflictDoNothing();

  if (!action) {
    action = await db.query.action.findFirst({
      where: eq(schema.action.name, "Populated Test Action"),
    });
  }

  if (!action) {
    throw new Error("Action not found");
  }

  let [actionReward] = await db.insert(schema.actionResourceReward).values({
    id: "5bbcb026-e240-48d8-b66d-7105df74cf9f",
    actionId: action.id,
    resourceId: resource2.id,
    chance: 100,
    quantityMax: 1,
    quantityMin: 1,
  }).returning().onConflictDoNothing();

  if (!actionReward) {
    actionReward = await db.query.actionResourceReward.findFirst({
      where: eq(schema.actionResourceReward.actionId, action.id),
    });
  }

  if (!actionReward) {
    throw new Error("Action reward not found");
  }

  await db.insert(schema.userResource).values([{
    userId: player.id,
    resourceId: resource1.id,
    quantity: 100,
  }, {
    userId: player.id,
    resourceId: resource2.id,
    quantity: 100,
  }]).onConflictDoNothing();

  // --- Seed an action log entry for the player ---
  await db.insert(schema.actionLog).values({
    id: "5bbcb026-e240-48d8-b66d-7105df74cf9f",
    gameId: game.id,
    userId: player.id,
    actionId: action.id,
    version: 1,
    data: {
      resource: [
        {
          resourceId: resource1.id,
          type: "reward",
          amount: 10,
        },
        {
          resourceId: resource2.id,
          type: "cost",
          amount: 2,
        },
      ],
    },
    executedAt: Temporal.Now.instant(),
  }).onConflictDoNothing();
};

async function main() {
  console.log("🌱 Starting database seed for e2e tests...");
  await setAdminUser();
  await setupTestGame();
  console.log("✨ Database seeding complete!");
  Deno.exit(0);
}

main().catch((error) => {
  console.error("❌ Seeding failed:", error);
  Deno.exit(1);
});
