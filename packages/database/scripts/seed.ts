import { db, schema } from "../mod.ts";
import { asset } from "../db/schema.ts";

async function seedAssets() {
  console.log("🌱 Seeding assets...");
  await db.insert(asset).values([
    {
      type: "location",
      name: "Castle 1",
      url: "https://hortashaorg.github.io/assets/castle1.png",
    },
    {
      type: "creature",
      name: "Bear 1",
      url: "https://hortashaorg.github.io/assets/bear1.png",
    },
    {
      type: "location",
      name: "Cave 1",
      url: "https://hortashaorg.github.io/assets/cave1.png",
    },
    {
      type: "location",
      name: "Cave 2",
      url: "https://hortashaorg.github.io/assets/cave2.png",
    },
    {
      type: "character",
      name: "Elf 1",
      url: "https://hortashaorg.github.io/assets/elf1.png",
    },
    {
      type: "character",
      name: "Elf 2",
      url: "https://hortashaorg.github.io/assets/elf2.png",
    },
    {
      type: "character",
      name: "Elf 3",
      url: "https://hortashaorg.github.io/assets/elf3.png",
    },
    {
      type: "action",
      name: "Fishing 1",
      url: "https://hortashaorg.github.io/assets/fishing1.png",
    },
    {
      type: "action",
      name: "Fishing 2",
      url: "https://hortashaorg.github.io/assets/fishing2.png",
    },
    {
      type: "character",
      name: "Human 1",
      url: "https://hortashaorg.github.io/assets/human1.png",
    },
    {
      type: "character",
      name: "Human 2",
      url: "https://hortashaorg.github.io/assets/human2.png",
    },
    {
      type: "location",
      name: "Mountains 1",
      url: "https://hortashaorg.github.io/assets/mountains1.png",
    },
    {
      type: "character",
      name: "Orc 1",
      url: "https://hortashaorg.github.io/assets/orc1.png",
    },
    {
      type: "action",
      name: "Smithing 1",
      url: "https://hortashaorg.github.io/assets/smithing1.png",
    },
    {
      type: "location",
      name: "Village 1",
      url: "https://hortashaorg.github.io/assets/village1.png",
    },
    {
      type: "location",
      name: "Village 2",
      url: "https://hortashaorg.github.io/assets/village2.png",
    },
    {
      type: "resource",
      name: "Coins 1",
      url: "https://hortashaorg.github.io/assets/coins1.png",
    },
    {
      type: "resource",
      name: "Iron 1",
      url: "https://hortashaorg.github.io/assets/iron1.png",
    },
    {
      type: "item",
      name: "Sword 1",
      url: "https://hortashaorg.github.io/assets/sword1.png",
    },
    {
      type: "item",
      name: "Mace 1",
      url: "https://hortashaorg.github.io/assets/mace1.png",
    },
    {
      type: "item",
      name: "Armor 1",
      url: "https://hortashaorg.github.io/assets/armor1.png",
    },
    {
      type: "item",
      name: "Sword 2",
      url: "https://hortashaorg.github.io/assets/sword2.png",
    },
    {
      type: "item",
      name: "Sword 3",
      url: "https://hortashaorg.github.io/assets/sword3.png",
    },
    {
      type: "item",
      name: "Sword 4",
      url: "https://hortashaorg.github.io/assets/sword4.png",
    },
    {
      type: "item",
      name: "Sword 5",
      url: "https://hortashaorg.github.io/assets/sword5.png",
    },
    {
      type: "resource",
      name: "Wood 1",
      url: "https://hortashaorg.github.io/assets/wood1.png",
    },
    {
      type: "resource",
      name: "Wood 2",
      url: "https://hortashaorg.github.io/assets/wood2.png",
    },
  ]).onConflictDoNothing();
}

export const setAdminUser = async () => {
  await db.insert(schema.account).values({
    email: "eidemartin_303@hotmail.com",
    nickname: "Martin",
    canCreateServer: true,
  }).onConflictDoNothing();
};

// Main seeding function
async function main() {
  console.log("🌱 Starting database seed...");

  await seedAssets();
  await setAdminUser();
  console.log("✨ Database seeding complete!");
  Deno.exit(0);
}

main().catch((error) => {
  console.error("❌ Seeding failed:", error);
  Deno.exit(1);
});
