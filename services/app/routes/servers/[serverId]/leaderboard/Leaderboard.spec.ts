import { expect, type Page, test } from "@playwright/test";

test("player can see the resource leaderboard", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "player");
  await page.goto(
    "http://localhost:4000/servers/5bbcb026-e240-48d8-b66d-7105df74cf9f/leaderboard",
  );

  await expect(page.getByRole("heading", { name: "Leaderboards", exact: true }))
    .toBeVisible();

  await expect(page.getByText("testuserplayer").first()).toBeVisible();
});
