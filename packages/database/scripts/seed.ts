import { db, queries, schema } from "@db/mod.ts";
import type { InferInsertModel } from "drizzle-orm";
import { notInArray } from "drizzle-orm";

async function seedAssets() {
  const assets: InferInsertModel<typeof schema.asset>[] = [
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
    {
      type: "symbol",
      name: "Arrow Up 1",
      url: "https://hortashaorg.github.io/assets/arrow_symbol1.png",
    },
    {
      type: "symbol",
      name: "Arrow Up 2",
      url: "https://hortashaorg.github.io/assets/arrow_symbol3.png",
    },
    {
      type: "symbol",
      name: "Arrow Up 3",
      url: "https://hortashaorg.github.io/assets/arrow_symbol5.png",
    },
    {
      type: "symbol",
      name: "Arrow Down 1",
      url: "https://hortashaorg.github.io/assets/arrow_symbol2.png",
    },
    {
      type: "symbol",
      name: "Arrow Down 2",
      url: "https://hortashaorg.github.io/assets/arrow_symbol4.png",
    },
    {
      type: "item",
      name: "Book 1",
      url: "https://hortashaorg.github.io/assets/book1.png",
    },
    {
      type: "skill",
      name: "Chopping 1",
      url: "https://hortashaorg.github.io/assets/chopping1.png",
    },
    {
      type: "resource",
      name: "Coins 2",
      url: "https://hortashaorg.github.io/assets/coins2.png",
    },
    {
      type: "resource",
      name: "Fish 1",
      url: "https://hortashaorg.github.io/assets/fish1.png",
    },
    {
      type: "resource",
      name: "Fish 2",
      url: "https://hortashaorg.github.io/assets/fish2.png",
    },
    {
      type: "resource",
      name: "Fish 3",
      url: "https://hortashaorg.github.io/assets/fish3.png",
    },
    {
      type: "resource",
      name: "Fish 4",
      url: "https://hortashaorg.github.io/assets/fish4.png",
    },
    {
      type: "resource",
      name: "Fish 5",
      url: "https://hortashaorg.github.io/assets/fish5.png",
    },
    {
      type: "resource",
      name: "Fish 6",
      url: "https://hortashaorg.github.io/assets/fish6.png",
    },
    {
      type: "resource",
      name: "Fish 7",
      url: "https://hortashaorg.github.io/assets/fish7.png",
    },
    {
      type: "symbol",
      name: "Flag 1",
      url: "https://hortashaorg.github.io/assets/flag1.png",
    },
    {
      type: "symbol",
      name: "Flash 1",
      url: "https://hortashaorg.github.io/assets/flash1.png",
    },
    {
      type: "symbol",
      name: "Flash 2",
      url: "https://hortashaorg.github.io/assets/flash2.png",
    },
    {
      type: "resource",
      name: "Gold 1",
      url: "https://hortashaorg.github.io/assets/gold1.png",
    },
    {
      type: "symbol",
      name: "Heart 1",
      url: "https://hortashaorg.github.io/assets/heart1.png",
    },
    {
      type: "item",
      name: "Key 1",
      url: "https://hortashaorg.github.io/assets/key1.png",
    },
    {
      type: "item",
      name: "Key 2",
      url: "https://hortashaorg.github.io/assets/key2.png",
    },
    {
      type: "skill",
      name: "Mining 1",
      url: "https://hortashaorg.github.io/assets/mining1.png",
    },
    {
      type: "symbol",
      name: "Skill Up 1",
      url: "https://hortashaorg.github.io/assets/skill1.png",
    },
    {
      type: "symbol",
      name: "Skill Up 2",
      url: "https://hortashaorg.github.io/assets/skill2.png",
    },
    {
      type: "symbol",
      name: "Skill Up 3",
      url: "https://hortashaorg.github.io/assets/skill3.png",
    },
    {
      type: "symbol",
      name: "Star 1",
      url: "https://hortashaorg.github.io/assets/star1.png",
    },
    {
      type: "item",
      name: "Sword 6",
      url: "https://hortashaorg.github.io/assets/sword6.png",
    },
    {
      type: "item",
      name: "Sword 7",
      url: "https://hortashaorg.github.io/assets/sword7.png",
    },
    {
      type: "item",
      name: "Sword 8",
      url: "https://hortashaorg.github.io/assets/sword8.png",
    },
    {
      type: "item",
      name: "Sword 9",
      url: "https://hortashaorg.github.io/assets/sword9.png",
    },
    {
      type: "item",
      name: "Sword 10",
      url: "https://hortashaorg.github.io/assets/sword10.png",
    },
  ];
  console.log("🌱 Seeding assets...");
  await queries.assets.setAssets(assets);
  await db.delete(schema.asset).where(
    notInArray(schema.asset.name, assets.map((a) => a.name)),
  );
}

const setAdminUser = async () => {
  await queries.accounts.setAccounts([{
    email: "eidemartin_303@hotmail.com",
    nickname: "Martin",
    canCreateGame: true,
  }, {
    email: "andreas.ander.li@gmail.com",
    canCreateGame: true,
  }]);
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
