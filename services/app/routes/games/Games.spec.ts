import { expect, type Page, test } from "@playwright/test";

test("/games page as user", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "player");
  await page.goto("http://localhost:4000/games");
  const availableGamesTitle = page.getByRole("heading", {
    name: "Available Games",
  });
  await expect(availableGamesTitle).toBeVisible();

  const createGameButton = page.getByRole("button", {
    name: "Create Game",
  });
  await expect(createGameButton).not.toBeVisible();

  const myGamesTitle = page.getByRole("heading", {
    name: "My Games",
  });
  await expect(myGamesTitle).not.toBeVisible();

  await page.close();
});

test("/games page as admin", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "admin");
  await page.getByRole("link", { name: "Games" }).nth(0).click();
  const availableGamesTitle = page.getByRole("heading", {
    name: "Available Games",
  });
  await expect(availableGamesTitle).toBeVisible();

  const createGameButton = page.getByRole("button", {
    name: "Create Game",
  });
  await expect(createGameButton).toBeVisible();

  const myGamesTitle = page.getByRole("heading", {
    name: "My Games",
  });
  await expect(myGamesTitle).toBeVisible();

  await page.close();
});

test("create game as admin", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "admin");
  await page.getByRole("link", { name: "Games" }).nth(0).click();

  await page.getByRole("button", {
    name: "Create Game",
  }).click();

  await page.getByRole("textbox", {
    name: "Game Name",
  }).fill("Test Game");

  await page.getByLabel("Action Recovery Interval").selectOption("1hour");

  await page.getByRole("dialog").getByRole("button", { name: "Create Game" })
    .click();

  const testGameHeader = page.getByRole("heading", {
    name: "Test Game",
    exact: true,
  });
  await expect(testGameHeader).toBeVisible();

  await page.getByRole("button", {
    name: "Create Game",
  }).click();

  await page.getByRole("textbox", {
    name: "Game Name",
  }).fill("Test Game");

  await page.getByLabel("Action Recovery Interval").selectOption("1hour");

  await page.getByRole("dialog").getByRole("button", { name: "Create Game" })
    .click();

  await expect(page.getByText("A game with this name already exists"))
    .toBeVisible();

  await page.close();
});

test("redirect when not logged in", async ({ page }) => {
  await page.goto("http://localhost:4000/games");
  await page.waitForURL("http://localhost:4000/");

  expect(page.url()).not.toContain("/games");

  await page.close();
});
