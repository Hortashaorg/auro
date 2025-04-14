import { expect, type Page, test } from "@playwright/test";

test("Profile page loads for player user", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "player");
  await page.getByRole("button", { name: "Account" }).nth(0).click();
  await page.getByRole("link", { name: "Profile" }).click();

  // Check that we've landed on the profile page
  const profileTitle = page.getByRole("heading", { name: "Profile" });
  await expect(profileTitle).toBeVisible();

  await page.close();
});

test("Profile page loads for admin user", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "admin");
  await page.getByRole("button", { name: "Account" }).nth(0).click();
  await page.getByRole("link", { name: "Profile" }).click();

  // Check that we've landed on the profile page
  const profileTitle = page.getByRole("heading", { name: "Profile" });
  await expect(profileTitle).toBeVisible();

  await page.close();
});

test("Edit nickname functionality", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "admin");
  await page.getByRole("button", { name: "Account" }).nth(0).click();
  await page.getByRole("link", { name: "Profile" }).click();
  await page.getByRole("button", { name: "Edit" }).nth(0).click();

  const nicknameInput = page.getByRole("textbox", { name: "Nickname" });
  await expect(nicknameInput).toBeVisible();

  const testNickname = "Admin Nickname";
  await nicknameInput.fill(testNickname);
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText(testNickname)).toBeVisible();

  await page.close();
});

test("@target Redirect when not logged in", async ({ page }) => {
  await page.goto("http://localhost:4000/profile");
  await page.waitForURL("http://localhost:4000/");

  expect(page.url()).not.toContain("/profile");

  await page.close();
});
