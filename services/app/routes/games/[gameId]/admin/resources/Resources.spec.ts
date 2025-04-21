import { expect, type Page, test } from "@playwright/test";

test("Create resource functionality", async ({ page }) => {
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
  await page.getByRole("link", { name: "Resources" }).click();
  await page.waitForTimeout(300);

  await page.getByRole("button", { name: "Create Resource" }).click();

  await page.getByRole("textbox", { name: "Resource Name*" }).fill(
    "Test Resource",
  );
  await page.getByRole("textbox", { name: "Description" }).fill(
    "Test resource description",
  );

  await page.getByRole("switch").locator("..").click();

  await page.getByRole("img", { name: "Fish 1" }).click();
  await page.getByRole("dialog").getByRole("button", {
    name: "Create Resource",
  }).click();

  const resourceName = page.getByText("Test Resource").first();
  await expect(resourceName).toBeVisible();

  await page.close();
});

test("Player cannot access resources admin page", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "player");

  await page.goto(
    "http://localhost:4000/games/5bbcb026-e240-48d8-b66d-7105df74cf9f/admin/resources",
  );

  await page.waitForURL("http://localhost:4000/games");
  expect(page.url()).not.toContain("/admin");

  await page.close();
});
