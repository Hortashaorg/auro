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
