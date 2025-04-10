import { expect, type Page, test } from "@playwright/test";

test("Shows server grid when user is logged in", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "player");
  await page.goto("/servers");

  expect(await page.locator("main").innerHTML()).toContain("ServerGrid");
});

test("Shows Create Server button for users with permission", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "admin");
  await page.goto("/servers");

  const createButton = page.getByRole("button", { name: "Create Server" });
  await expect(createButton).toBeVisible();
});

test("Create Server button opens modal", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "admin");
  await page.goto("/servers");

  await page.getByRole("button", { name: "Create Server" }).click();

  const modal = page.locator("div[id^='modal-createServerModal']");
  await expect(modal).toBeVisible();

  const modalTitle = modal.locator("h2");
  await expect(modalTitle).toContainText("Create New Server");
});

test("Redirects to home page when not logged in", async ({ page }) => {
  await page.goto("/servers");

  expect(page.url()).toContain("/");
  expect(page.url()).not.toContain("/servers");
});
