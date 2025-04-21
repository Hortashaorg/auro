import { expect, type Page, test } from "@playwright/test";

test("Game admin page loads for admin user", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "admin");

  await page.getByRole("link", { name: "Games" }).first().click();
  await page.waitForURL("http://localhost:4000/games");

  const card = page.locator('[data-card="true"]').filter({
    hasText: "Populated Test Game",
  }).first();

  await card.locator("a").first().click();
  await page.waitForURL(
    "http://localhost:4000/games/5bbcb026-e240-48d8-b66d-7105df74cf9f/admin",
  );

  await page.close();
});

test("Game admin page not accessible to player user", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "player");
  await page.goto(
    `http://localhost:4000/games/5bbcb026-e240-48d8-b66d-7105df74cf9f/admin`,
  );
  await page.waitForURL("http://localhost:4000/games");
  expect(page.url()).not.toContain("/admin");

  await page.close();
});

test("Toggle game status functionality", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "admin");

  await page.getByRole("link", { name: "Games" }).first().click();
  await page.waitForLoadState("networkidle");

  const card = page.locator('[data-card="true"]').filter({
    hasText: "Populated Test Game",
  }).first();

  await card.locator("a").first().click();
  await page.waitForTimeout(300);

  const isInitiallyOnline = await page.getByText("Online").isVisible();

  await page.getByRole("switch").locator("..").click();

  const expectedNewStatus = isInitiallyOnline ? "Offline" : "Online";
  await expect(page.getByText(expectedNewStatus).first()).toBeVisible();

  await page.getByRole("switch").locator("..").click();

  await expect(page.getByText(isInitiallyOnline ? "Online" : "Offline").first())
    .toBeVisible();

  await page.close();
});

test("Redirect when not logged in", async ({ page }) => {
  await page.goto(
    `http://localhost:4000/games/5bbcb026-e240-48d8-b66d-7105df74cf9f/admin`,
  );
  await page.waitForURL("http://localhost:4000/");

  expect(page.url()).not.toContain(
    "/games/5bbcb026-e240-48d8-b66d-7105df74cf9f/admin",
  );

  await page.close();
});
