import { db, schema } from "../mod.ts";

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

async function main() {
  console.log("🌱 Starting database seed for e2e tests...");
  await setAdminUser();
  console.log("✨ Database seeding complete!");
  Deno.exit(0);
}

main().catch((error) => {
  console.error("❌ Seeding failed:", error);
  Deno.exit(1);
});
