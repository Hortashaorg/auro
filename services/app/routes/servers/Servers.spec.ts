import { expect, type Page, test } from "@playwright/test";

test("/servers page as user", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "player");
  await page.goto("http://localhost:4000/servers");
  const availableServersTitle = page.getByRole("heading", {
    name: "Available Servers",
  });
  await expect(availableServersTitle).toBeVisible();

  const createServerButton = page.getByRole("button", {
    name: "Create Server",
  });
  await expect(createServerButton).not.toBeVisible();

  const myServersTitle = page.getByRole("heading", {
    name: "My Servers",
  });
  await expect(myServersTitle).not.toBeVisible();
});

test("/servers page as admin", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "admin");
  await page.getByRole("link", { name: "Servers" }).nth(0).click();
  const availableServersTitle = page.getByRole("heading", {
    name: "Available Servers",
  });
  await expect(availableServersTitle).toBeVisible();

  const createServerButton = page.getByRole("button", {
    name: "Create Server",
  });
  await expect(createServerButton).toBeVisible();

  const myServersTitle = page.getByRole("heading", {
    name: "My Servers",
  });
  await expect(myServersTitle).toBeVisible();
});

test("create server as admin", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "admin");
  await page.getByRole("link", { name: "Servers" }).nth(0).click();

  await page.getByRole("button", {
    name: "Create Server",
  }).click();

  await page.getByRole("textbox", {
    name: "Server Name",
  }).fill("Test Server");

  await page.getByLabel("Action Recovery Interval").selectOption("1hour");

  await page.getByRole("dialog").getByRole("button", { name: "Create Server" })
    .click();

  const testServerHeader = page.getByRole("heading", {
    name: "Test Server",
    exact: true,
  });
  await expect(testServerHeader).toBeVisible();

  await page.getByRole("button", {
    name: "Create Server",
  }).click();

  await page.getByRole("textbox", {
    name: "Server Name",
  }).fill("Test Server");

  await page.getByLabel("Action Recovery Interval").selectOption("1hour");

  await page.getByRole("dialog").getByRole("button", { name: "Create Server" })
    .click();

  await expect(page.getByText("A server with this name already exists"))
    .toBeVisible();
});
