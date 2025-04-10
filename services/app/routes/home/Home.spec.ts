import { expect, type Page, test } from "@playwright/test";

test("Has profile link", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "player");
  await page.getByRole("button", { name: "Account" }).nth(0).click();
  const profileLink = page.getByRole("link", { name: "Profile" });
  expect(profileLink).toBeVisible();
  await page.close();
});
