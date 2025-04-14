import { expect, type Page, test } from "@playwright/test";

test("Server admin page loads for admin user", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "admin");

  await page.getByRole("link", { name: "Servers" }).first().click();
  await page.waitForURL("http://localhost:4000/servers");

  const card = page.locator('[data-card="true"]').filter({
    hasText: "Populated Test Server",
  }).first();

  await card.locator("a").first().click();
  await page.waitForURL(
    "http://localhost:4000/servers/5bbcb026-e240-48d8-b66d-7105df74cf9f/admin",
  );

  await page.screenshot({ path: "screenshot.png" });

  await page.close();
});

test("Server admin page not accessible to player user", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "player");
  await page.goto(
    `http://localhost:4000/servers/5bbcb026-e240-48d8-b66d-7105df74cf9f/admin`,
  );
  await page.waitForURL("http://localhost:4000/servers");
  expect(page.url()).not.toContain("/admin");

  await page.close();
});

test("Toggle server status functionality", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "admin");

  await page.getByRole("link", { name: "Servers" }).first().click();
  await page.waitForLoadState("networkidle");

  const card = page.locator('[data-card="true"]').filter({
    hasText: "Populated Test Server",
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
    `http://localhost:4000/servers/5bbcb026-e240-48d8-b66d-7105df74cf9f/admin`,
  );
  await page.waitForURL("http://localhost:4000/");

  expect(page.url()).not.toContain(
    "/servers/5bbcb026-e240-48d8-b66d-7105df74cf9f/admin",
  );

  await page.close();
});
