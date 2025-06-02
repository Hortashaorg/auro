import { catchConstraintByName, db, eq, queries, schema } from "@db/mod.ts";
import type { InferSelectModel } from "drizzle-orm";
import { throwError } from "@package/common";

const setAccounts = async () => {
  await queries.accounts.setAccounts([{
    email: "testuseradmin@kalena.site",
    nickname: "testuseradmin",
    canCreateGame: true,
  }, {
    email: "testuserplayer@kalena.site",
    nickname: "testuserplayer",
    canCreateGame: false,
  }]);
};

const setupTestGame = async () => {
  const game = await queries.games.setGame({
    id: "5bbcb026-e240-48d8-b66d-7105df74cf9f",
    actionRecoveryInterval: "15min",
    name: "Populated Test Game",
    online: true,
  });

  const adminAccount = await queries.accounts.getAccountByEmail(
    "testuseradmin@kalena.site",
  );

  const playerAccount = await queries.accounts.getAccountByEmail(
    "testuserplayer@kalena.site",
  );

  const locationAsset = await queries.assets.getAssetByName("Castle 1");

  const location = await queries.locations.setLocation({
    id: "5bbcb026-e240-48d8-b66d-7105df74cf9f",
    gameId: game.id,
    assetId: locationAsset.id,
    name: "Test Location",
    description: "A location for e2e tests.",
  });

  let admin: InferSelectModel<typeof schema.user> | undefined;
  let player: InferSelectModel<typeof schema.user> | undefined;
  try {
    const users = await queries.users.setUsers([{
      accountId: adminAccount.id,
      gameId: game.id,
      type: "admin",
      locationId: location.id,
      name: "testuseradmin",
      availableActions: 15,
    }, {
      accountId: playerAccount.id,
      gameId: game.id,
      type: "player",
      locationId: location.id,
      name: "testuserplayer",
      availableActions: 15,
    }]);

    admin = users[0] ?? throwError("Admin user not found");
    player = users[1] ?? throwError("Player user not found");
  } catch (error) {
    if (catchConstraintByName(error, "unique_user_name_per_game")) {
      console.log("Users already exist");
      admin = await queries.users.getUserByName("testuseradmin", game.id);
      player = await queries.users.getUserByName("testuserplayer", game.id);
    } else {
      throw error;
    }
  }

  console.log("Admin user with ID:", admin.id);
  console.log("Player user with ID:", player.id);

  const resourceAsset = await queries.assets.getAssetByName("Gold 1");

  const resources = await queries.resources.setResources([{
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
  }]);

  const resource1 = resources[0] ?? throwError("Resource should exist");
  const resource2 = resources[1] ?? throwError("Resource should exist");

  const actionAsset = await queries.assets.getAssetByName("Fishing 2");

  const action = await queries.actions.setAction({
    id: "5bbcb026-e240-48d8-b66d-7105df74cf9f",
    gameId: game.id,
    name: "Populated Test Action",
    description: "A action for e2e tests.",
    assetId: actionAsset.id,
    locationId: location.id,
  });

  await queries.actions.setActionResourceReward({
    id: "5bbcb026-e240-48d8-b66d-7105df74cf9f",
    actionId: action.id,
    resourceId: resource2.id,
    chance: 100,
    quantityMax: 1,
    quantityMin: 1,
  });

  await queries.users.setUserResources([{
    userId: player.id,
    resourceId: resource1.id,
    quantity: 100,
  }, {
    userId: player.id,
    resourceId: resource2.id,
    quantity: 100,
  }]);

  await queries.actions.insertActionLog({
    gameId: game.id,
    userId: player.id,
    actionId: action.id,
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
  });
};

async function main() {
  console.log("🌱 Starting database seed for e2e tests...");
  await setAccounts();
  await setupTestGame();
  console.log("✨ Database seeding complete!");
  Deno.exit(0);
}

main().catch((error) => {
  console.error("❌ Seeding failed:", error);
  Deno.exit(1);
});
