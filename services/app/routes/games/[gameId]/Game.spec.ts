import { expect, type Page, test } from "@playwright/test";

test("player can execute an action on the game page", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "player");
  await page.goto(
    "http://localhost:4000/games/5bbcb026-e240-48d8-b66d-7105df74cf9f",
  );

  await page.locator('[data-card="true"]').filter({
    hasText: "Populated Test Action",
  }).getByRole("button", { name: "Do it!" }).click();

  await page.waitForTimeout(200);

  const success = await page.getByText("Success", {
    exact: true,
  }).count();
  expect(success).toBe(1);
});
