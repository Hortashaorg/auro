import { expect, type Page, test } from "@playwright/test";

test("Create item functionality", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "admin");
  await page.getByRole("link", { name: "Games" }).first().click();
  await page.waitForURL("http://localhost:4000/games");

  await page.locator("section").filter({ hasText: "My GamesPopulated Test" })
    .getByRole("button").click();
  await page.getByRole("button", { name: "Configuration" }).click();
  await page.getByRole("link", { name: "Items" }).click();
  await page.waitForTimeout(300);

  await page.getByRole("button", { name: "Create Item" }).click();

  await page.getByRole("textbox", { name: "Item Name*" }).fill(
    "Test Item",
  );
  await page.getByRole("textbox", { name: "Description" }).fill(
    "Test item description",
  );
  await page.getByLabel("Rarity*").selectOption("legendary");
  await page.getByRole("img", { name: "Sword 3" }).click();
  await page.getByRole("dialog").getByRole("button", {
    name: "Create Item",
  }).click();

  const itemName = page.getByText("Test Item").first();

  await expect(itemName).toBeVisible();

  await page.close();
});

test("Player cannot access items admin page", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "player");

  await page.goto(
    "http://localhost:4000/games/5bbcb026-e240-48d8-b66d-7105df74cf9f/admin/items",
  );

  await page.waitForURL("http://localhost:4000/games");
  expect(page.url()).not.toContain("/admin");

  await page.close();
});
