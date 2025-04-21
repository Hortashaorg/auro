import { expect, type Page, test } from "@playwright/test";

test("player can see their action log entry", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "player");
  await page.goto(
    "http://localhost:4000/games/5bbcb026-e240-48d8-b66d-7105df74cf9f/action-log",
  );

  await expect(page.getByRole("heading", { name: "Action Log", exact: true }))
    .toBeVisible();

  await expect(page.getByText("Populated Test Action").first()).toBeVisible();
});
