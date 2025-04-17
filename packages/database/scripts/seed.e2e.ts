import { db, eq, schema } from "../mod.ts";

const setAdminUser = async () => {
  await db.insert(schema.account).values({
    email: "testuseradmin@kalena.site",
    nickname: "testuseradmin",
    canCreateServer: true,
  }).onConflictDoUpdate({
    target: [schema.account.email],
    set: {
      canCreateServer: true,
    },
  });
};

const setupTestServer = async () => {
  let [server] = await db.insert(schema.server).values({
    id: "5bbcb026-e240-48d8-b66d-7105df74cf9f",
    actionRecoveryInterval: "15min",
    name: "Populated Test Server",
    online: true,
  })
    .returning()
    .onConflictDoNothing();

  if (!server) {
    server = await db.query.server.findFirst({
      where: eq(schema.server.name, "Populated Test Server"),
    });
  }

  const account = await db.query.account.findFirst({
    where: eq(schema.account.email, "testuseradmin@kalena.site"),
  });

  if (!account || !server) {
    throw new Error("Account or server not found");
  }

  let [user] = await db.insert(schema.user).values({
    accountId: account.id,
    serverId: server.id,
    type: "admin",
    availableActions: 15,
  })
    .returning()
    .onConflictDoNothing();

  if (!user) {
    user = await db.query.user.findFirst({
      where: eq(schema.user.accountId, account.id),
    });
  }

  if (!user) {
    throw new Error("User not found");
  }

  const asset = await db.query.asset.findFirst({
    where: eq(schema.asset.name, "Castle 1"),
  });

  if (!asset) {
    throw new Error("Asset not found");
  }

  let [location] = await db.insert(schema.location).values({
    id: "5bbcb026-e240-48d8-b66d-7105df74cf9f",
    serverId: server.id,
    assetId: asset.id,
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
};

async function main() {
  console.log("🌱 Starting database seed for e2e tests...");
  await setAdminUser();
  await setupTestServer();
  console.log("✨ Database seeding complete!");
  Deno.exit(0);
}

main().catch((error) => {
  console.error("❌ Seeding failed:", error);
  Deno.exit(1);
});
